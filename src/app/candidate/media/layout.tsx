import { MediaCacheProvider } from '@/contexts/MediaCacheContext';

export default function MediaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MediaCacheProvider>
      {children}
    </MediaCacheProvider>
  );
}