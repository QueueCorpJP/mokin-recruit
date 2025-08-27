import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white">
      <div className="flex min-h-[calc(100vh-160px)] items-center justify-center px-4 py-12">
        <div className="max-w-md text-center">
          <div className="mb-8">
            <h1 
              className="text-8xl font-bold text-[#0F9058] mb-4"
              style={{
                fontFamily: 'Noto Sans JP, sans-serif',
                fontWeight: 700,
              }}
            >
              404
            </h1>
            <h2 
              className="text-3xl font-bold text-[#323232] mb-4"
              style={{
                fontFamily: 'Noto Sans JP, sans-serif',
                fontWeight: 700,
                lineHeight: '140%',
                letterSpacing: '0.05em',
              }}
            >
              ページが見つかりません
            </h2>
            <p 
              className="text-lg text-gray-600 mb-8"
              style={{
                fontFamily: 'Noto Sans JP, sans-serif',
                fontWeight: 400,
                lineHeight: '180%',
                letterSpacing: '0.05em',
              }}
            >
              お探しのページは存在しないか、移動した可能性があります。
              URLをご確認いただくか、トップページからお探しください。
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="green-gradient"
              size="lg"
              className="rounded-full px-8 py-3 font-bold tracking-[0.1em] h-12 transition-all duration-200 ease-in-out hover:shadow-lg"
              asChild
            >
              <Link href="/">
                トップページに戻る
              </Link>
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-8 py-3 font-bold tracking-[0.1em] h-12 border-2 border-[#0F9058] text-[#0F9058] hover:bg-[#F3FBF7] transition-all duration-200 ease-in-out"
              onClick={() => window.history.back()}
            >
              前のページに戻る
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}