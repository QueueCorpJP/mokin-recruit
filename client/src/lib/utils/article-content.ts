interface ContentImage {
  url: string;
  order: number;
  position: number;
  filename: string;
  uploadedAt: string;
}

export function processArticleContent(content: string, contentImages?: ContentImage[]): string {
  if (!contentImages || contentImages.length === 0) {
    return content;
  }

  let processedContent = content;
  
  // HTMLから画像タグを抽出し、ストレージから取得した画像で置換
  contentImages.forEach((image) => {
    const imgRegex = new RegExp(
      `<img[^>]*src="${escapeRegExp(image.url)}"[^>]*data-image-order="${image.order}"[^>]*>`,
      'g'
    );
    
    processedContent = processedContent.replace(imgRegex, (match) => {
      // 既存のimg属性を保持しつつ、確実にストレージのURLを使用
      return match.replace(/src="[^"]*"/, `src="${image.url}"`);
    });
  });

  return processedContent;
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function getContentImages(contentImages?: ContentImage[]): ContentImage[] {
  if (!contentImages) return [];
  return contentImages.sort((a, b) => a.order - b.order);
}