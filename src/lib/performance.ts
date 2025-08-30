import React from 'react';

// パフォーマンス監視ユーティリティ
export class PerformanceMonitor {
  private static measurements: Map<string, number> = new Map();

  static startMeasure(name: string) {
    this.measurements.set(name, performance.now());
  }

  static endMeasure(name: string): number {
    const startTime = this.measurements.get(name);
    if (!startTime) {
      console.warn(`No start time found for measurement: ${name}`);
      return 0;
    }
    
    const duration = performance.now() - startTime;
    this.measurements.delete(name);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
    }
    
    return duration;
  }

  static measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    this.startMeasure(name);
    return fn().finally(() => {
      this.endMeasure(name);
    });
  }

  static measureSync<T>(name: string, fn: () => T): T {
    this.startMeasure(name);
    try {
      return fn();
    } finally {
      this.endMeasure(name);
    }
  }
}

// Web Vitals 監視
export function reportWebVitals(metric: any) {
  if (process.env.NODE_ENV === 'production') {
    // プロダクションでは実際の分析ツールに送信
    console.log(metric);
  } else {
    // 開発時はコンソールログ
    console.log(`🚀 ${metric.name}: ${metric.value.toFixed(2)}`);
  }
}

// コンポーネントレンダリング時間監視
export function withPerformanceLogging<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) {
  const WrappedComponent = (props: P) => {
    React.useEffect(() => {
      PerformanceMonitor.startMeasure(`${componentName}-render`);
      return () => {
        PerformanceMonitor.endMeasure(`${componentName}-render`);
      };
    });

    return React.createElement(Component, props);
  };

  WrappedComponent.displayName = `withPerformanceLogging(${componentName})`;
  return WrappedComponent;
}