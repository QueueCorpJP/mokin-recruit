// Web Vitals メトリクス
export interface WebVitalsMetric {
  name: string;
  value: number;
  delta: number;
  entries: PerformanceEntry[];
  id: string;
  navigationType: string;
}

// パフォーマンス監視クラス
class PerformanceMonitor {
  private metrics: Map<string, number> = new Map();
  private observers: PerformanceObserver[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeObservers();
    }
  }

  private initializeObservers() {
    // Navigation Timing
    if ('PerformanceObserver' in window) {
      try {
        const navigationObserver = new PerformanceObserver(list => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'navigation') {
              const navEntry = entry as PerformanceNavigationTiming;
              this.recordNavigationMetrics(navEntry);
            }
          }
        });
        navigationObserver.observe({ entryTypes: ['navigation'] });
        this.observers.push(navigationObserver);
      } catch (e) {
        if (process.env.NODE_ENV === 'development') console.warn('Navigation timing observer not supported');
      }

      // Resource Timing
      try {
        const resourceObserver = new PerformanceObserver(list => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'resource') {
              const resourceEntry = entry as PerformanceResourceTiming;
              this.recordResourceMetrics(resourceEntry);
            }
          }
        });
        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.push(resourceObserver);
      } catch (e) {
        if (process.env.NODE_ENV === 'development') console.warn('Resource timing observer not supported');
      }

      // Largest Contentful Paint
      try {
        const lcpObserver = new PerformanceObserver(list => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.metrics.set('LCP', lastEntry.startTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (e) {
        if (process.env.NODE_ENV === 'development') console.warn('LCP observer not supported');
      }

      // First Input Delay
      try {
        const fidObserver = new PerformanceObserver(list => {
          for (const entry of list.getEntries()) {
            const fidEntry = entry as PerformanceEventTiming;
            const fid = fidEntry.processingStart - fidEntry.startTime;
            this.metrics.set('FID', fid);
          }
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);
      } catch (e) {
        if (process.env.NODE_ENV === 'development') console.warn('FID observer not supported');
      }

      // Cumulative Layout Shift
      try {
        const clsObserver = new PerformanceObserver(list => {
          let clsValue = 0;
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          this.metrics.set('CLS', clsValue);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch (e) {
        if (process.env.NODE_ENV === 'development') console.warn('CLS observer not supported');
      }
    }
  }

  private recordNavigationMetrics(entry: PerformanceNavigationTiming) {
    // Time to First Byte
    const ttfb = entry.responseStart - entry.requestStart;
    this.metrics.set('TTFB', ttfb);

    // DOM Content Loaded
    const dcl = entry.domContentLoadedEventEnd - entry.fetchStart;
    this.metrics.set('DCL', dcl);

    // Load Complete
    const loadComplete = entry.loadEventEnd - entry.fetchStart;
    this.metrics.set('Load', loadComplete);

    // DNS Lookup Time
    const dnsTime = entry.domainLookupEnd - entry.domainLookupStart;
    this.metrics.set('DNS', dnsTime);

    // TCP Connection Time
    const tcpTime = entry.connectEnd - entry.connectStart;
    this.metrics.set('TCP', tcpTime);

    // SSL Negotiation Time
    if (entry.secureConnectionStart > 0) {
      const sslTime = entry.connectEnd - entry.secureConnectionStart;
      this.metrics.set('SSL', sslTime);
    }
  }

  private recordResourceMetrics(entry: PerformanceResourceTiming) {
    // 画像リソースの読み込み時間を監視
    if (entry.name.match(/\.(jpg|jpeg|png|gif|svg|webp|avif)$/i)) {
      const loadTime = entry.responseEnd - entry.startTime;
      const existingImageTime = this.metrics.get('ImageLoad') || 0;
      this.metrics.set('ImageLoad', Math.max(existingImageTime, loadTime));
    }

    // JavaScriptリソースの読み込み時間を監視
    if (entry.name.match(/\.js$/i)) {
      const loadTime = entry.responseEnd - entry.startTime;
      const existingJSTime = this.metrics.get('JSLoad') || 0;
      this.metrics.set('JSLoad', Math.max(existingJSTime, loadTime));
    }

    // CSSリソースの読み込み時間を監視
    if (entry.name.match(/\.css$/i)) {
      const loadTime = entry.responseEnd - entry.startTime;
      const existingCSSTime = this.metrics.get('CSSLoad') || 0;
      this.metrics.set('CSSLoad', Math.max(existingCSSTime, loadTime));
    }
  }

  // メトリクスの取得
  getMetric(name: string): number | undefined {
    return this.metrics.get(name);
  }

  // すべてのメトリクスの取得
  getAllMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  // パフォーマンスレポートの生成
  generateReport(): PerformanceReport {
    const metrics = this.getAllMetrics();

    return {
      timestamp: Date.now(),
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      metrics,
      scores: this.calculateScores(metrics),
    };
  }

  private calculateScores(metrics: Record<string, number>): PerformanceScores {
    const scores: PerformanceScores = {
      overall: 0,
      lcp: 0,
      fid: 0,
      cls: 0,
      ttfb: 0,
    };

    // LCP スコア (2.5秒以下が良好)
    if (metrics.LCP) {
      scores.lcp =
        metrics.LCP <= 2500
          ? 100
          : Math.max(0, 100 - (metrics.LCP - 2500) / 25);
    }

    // FID スコア (100ms以下が良好)
    if (metrics.FID) {
      scores.fid =
        metrics.FID <= 100 ? 100 : Math.max(0, 100 - (metrics.FID - 100) / 10);
    }

    // CLS スコア (0.1以下が良好)
    if (metrics.CLS) {
      scores.cls =
        metrics.CLS <= 0.1 ? 100 : Math.max(0, 100 - (metrics.CLS - 0.1) * 500);
    }

    // TTFB スコア (600ms以下が良好)
    if (metrics.TTFB) {
      scores.ttfb =
        metrics.TTFB <= 600
          ? 100
          : Math.max(0, 100 - (metrics.TTFB - 600) / 10);
    }

    // 総合スコア
    const validScores = Object.values(scores).filter(score => score > 0);
    scores.overall =
      validScores.length > 0
        ? Math.round(
            validScores.reduce((sum, score) => sum + score, 0) /
              validScores.length
          )
        : 0;

    return scores;
  }

  // リソースのクリーンアップ
  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics.clear();
  }
}

// 型定義
export interface PerformanceReport {
  timestamp: number;
  url: string;
  userAgent: string;
  metrics: Record<string, number>;
  scores: PerformanceScores;
}

export interface PerformanceScores {
  overall: number;
  lcp: number;
  fid: number;
  cls: number;
  ttfb: number;
}

// ユーティリティ関数
export function measureAsync<T>(
  name: string,
  asyncFn: () => Promise<T>
): Promise<T> {
  const start = performance.now();

  return asyncFn().finally(() => {
    const duration = performance.now() - start;
    if (process.env.NODE_ENV === 'development') console.log(`${name}: ${duration.toFixed(2)}ms`);
  });
}

export function measureSync<T>(name: string, syncFn: () => T): T {
  const start = performance.now();
  const result = syncFn();
  const duration = performance.now() - start;
  if (process.env.NODE_ENV === 'development') console.log(`${name}: ${duration.toFixed(2)}ms`);
  return result;
}

// デフォルトインスタンス
export const performanceMonitor = new PerformanceMonitor();

// Web Vitals の監視
export function reportWebVitals(metric: WebVitalsMetric) {
  // 開発環境でのログ出力
  if (process.env.NODE_ENV === 'development') {
    if (process.env.NODE_ENV === 'development') console.log(`${metric.name}: ${metric.value.toFixed(2)}ms`);
  }

  // プロダクション環境では分析サービスに送信
  if (process.env.NODE_ENV === 'production') {
    // Google Analytics 4 への送信例
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', metric.name, {
        value: Math.round(metric.value),
        metric_id: metric.id,
        metric_value: metric.value,
        metric_delta: metric.delta,
      });
    }
  }
}
