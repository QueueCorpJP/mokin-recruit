export const fontOptimizer = {
  preloadFonts: () => {
    if (typeof window === 'undefined') return;

    const criticalFonts = [
      {
        family: 'Noto Sans JP',
        weight: '400',
        style: 'normal',
        unicodeRange: 'U+3000-9FFF, U+FF00-FFEF',
      },
      {
        family: 'Noto Sans JP',
        weight: '500',
        style: 'normal',
        unicodeRange: 'U+3000-9FFF, U+FF00-FFEF',
      },
      {
        family: 'Noto Sans JP',
        weight: '700',
        style: 'normal',
        unicodeRange: 'U+3000-9FFF, U+FF00-FFEF',
      },
    ];

    criticalFonts.forEach((font) => {
      const observer = new FontFaceObserver(font.family, {
        weight: font.weight,
        style: font.style,
      });

      observer.load(null, 5000).then(
        () => {
          document.documentElement.classList.add('fonts-loaded');
        },
        () => {
          console.warn(`Font ${font.family} ${font.weight} failed to load`);
        }
      );
    });
  },

  injectFontPreload: () => {
    if (typeof document === 'undefined') return;

    const fontUrls = [
      'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap',
    ];

    fontUrls.forEach((url) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = url;
      link.crossOrigin = 'anonymous';
      
      const onLoad = () => {
        link.onload = link.onerror = null;
        link.rel = 'stylesheet';
      };
      
      link.onload = onLoad;
      link.onerror = onLoad;
      
      document.head.appendChild(link);
    });
  },

  measureFontLoadTime: () => {
    if (typeof window === 'undefined' || !window.performance) return;

    const fontLoadEntries = performance.getEntriesByType('resource')
      .filter(entry => entry.name.includes('fonts.googleapis.com') || entry.name.includes('fonts.gstatic.com'));

    const totalLoadTime = fontLoadEntries.reduce((total, entry) => {
      return total + (entry.responseEnd - entry.startTime);
    }, 0);

    return {
      entries: fontLoadEntries,
      totalLoadTime,
      averageLoadTime: fontLoadEntries.length > 0 ? totalLoadTime / fontLoadEntries.length : 0,
    };
  },
};

declare global {
  interface Window {
    FontFaceObserver: any;
  }
}

class FontFaceObserver {
  family: string;
  weight: string;
  style: string;

  constructor(family: string, descriptors: { weight?: string; style?: string } = {}) {
    this.family = family;
    this.weight = descriptors.weight || 'normal';
    this.style = descriptors.style || 'normal';
  }

  load(text?: string | null, timeout?: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const font = `${this.style} ${this.weight} 1px ${this.family}`;
      
      if (document.fonts && typeof document.fonts.load === 'function') {
        document.fonts.load(font, text || 'BESbswy').then(
          (fonts) => {
            if (fonts.length > 0) {
              resolve();
            } else {
              reject(new Error('Font load failed'));
            }
          },
          () => reject(new Error('Font load failed'))
        );
      } else {
        setTimeout(() => resolve(), 100);
      }
    });
  }
}