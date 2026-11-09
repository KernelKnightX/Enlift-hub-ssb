import type { TestImage } from '@/types/schema';

export function prefetchImageUrls(urls: string[]): void {
  urls.filter(Boolean).forEach((url) => {
    const img = new Image();
    img.decoding = 'async';
    img.src = url;
  });
}

export function prefetchTestImages(images: Pick<TestImage, 'url'>[]): void {
  prefetchImageUrls(images.map((i) => i.url));
}
