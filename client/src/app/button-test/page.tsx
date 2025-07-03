import { Metadata, Viewport } from 'next';
import { ButtonShowcase } from '@/components/ui/button-showcase';

export const metadata: Metadata = {
  title: 'ボタンテスト | CuePoint',
  description: 'UIボタンコンポーネントのテストページ',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function ButtonTestPage() {
  return <ButtonShowcase />;
}
