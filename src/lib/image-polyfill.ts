// Image constructor polyfill to prevent "Failed to construct 'Image': Please use the 'new' operator" error

if (typeof window !== 'undefined') {
  // Store original Image constructor
  const OriginalImage = window.Image;

  // Override global Image to ensure it's always called with 'new'
  window.Image = function (
    this: HTMLImageElement,
    width?: number,
    height?: number
  ) {
    // If called without 'new', call it with 'new'
    if (!(this instanceof window.Image)) {
      return new OriginalImage(width, height);
    }
    return new OriginalImage(width, height);
  } as any;

  // Preserve prototype
  window.Image.prototype = OriginalImage.prototype;
}
