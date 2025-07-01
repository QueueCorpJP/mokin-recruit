import React from 'react';
import { Button } from './button';

export function ButtonShowcase() {
  return (
    <div className='p-8 space-y-6 bg-gray-50 min-h-screen'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold text-gray-900 mb-8'>
          Button Component Showcase
        </h1>

        {/* Figma Design Button */}
        <section className='bg-white p-6 rounded-lg shadow-sm mb-8'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>
            Figma Design - Green Gradient Button
          </h2>
          <div className='space-y-4'>
            <div className='flex items-center gap-4 flex-wrap'>
              <Button variant='green-gradient' size='figma-default'>
                テキスト
              </Button>
              <Button variant='green-gradient' size='figma-default' disabled>
                無効状態
              </Button>
            </div>
            <div className='text-sm text-gray-600'>
              <p>
                <strong>仕様:</strong>
              </p>
              <ul className='list-disc list-inside space-y-1 mt-2'>
                <li>グラデーション: #198D76 → #1CA74F</li>
                <li>ホバー時: #12614E → #1A8946</li>
                <li>ボーダーラディウス: 32px</li>
                <li>パディング: 14px 40px</li>
                <li>シャドウ: 0px 5px 10px rgba(0,0,0,0.15)</li>
                <li>フォント: 太字, 文字間隔: 10%</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Size Variations */}
        <section className='bg-white p-6 rounded-lg shadow-sm mb-8'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>
            サイズバリエーション
          </h2>
          <div className='space-y-4'>
            <div className='flex items-center gap-4 flex-wrap'>
              <Button variant='green-gradient' size='sm'>
                Small
              </Button>
              <Button variant='green-gradient' size='default'>
                Default
              </Button>
              <Button variant='green-gradient' size='lg'>
                Large
              </Button>
              <Button variant='green-gradient' size='figma-default'>
                Figma Default
              </Button>
            </div>
          </div>
        </section>

        {/* Interactive Hover Demonstration */}
        <section className='bg-white p-6 rounded-lg shadow-sm mb-8'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>
            ホバーステートのデモンストレーション
          </h2>
          <div className='space-y-4'>
            <div className='flex items-center gap-6 flex-wrap'>
              <div className='text-center'>
                <p className='text-sm font-medium text-gray-600 mb-2'>
                  通常状態
                </p>
                <div className='p-4 bg-gray-50 rounded-lg'>
                  <Button variant='green-gradient' size='figma-default'>
                    テキスト
                  </Button>
                </div>
                <p className='text-xs text-gray-500 mt-1'>#198D76 → #1CA74F</p>
              </div>
              <div className='text-center'>
                <p className='text-sm font-medium text-gray-600 mb-2'>
                  ホバー時
                </p>
                <div className='p-4 bg-gray-50 rounded-lg'>
                  <Button
                    variant='green-gradient'
                    size='figma-default'
                    className='hover:from-[#12614E] hover:to-[#1A8946]'
                  >
                    マウスオーバーしてください
                  </Button>
                </div>
                <p className='text-xs text-gray-500 mt-1'>#12614E → #1A8946</p>
              </div>
            </div>
            <div className='mt-4 p-3 bg-blue-50 rounded-lg'>
              <p className='text-sm text-blue-800'>
                <strong>💡 Tips:</strong>{' '}
                マウスをボタンの上に乗せると、Figmaデザイン通りの濃いグリーンに変化します
              </p>
            </div>
          </div>
        </section>

        {/* Comparison with Standard Variants */}
        <section className='bg-white p-6 rounded-lg shadow-sm'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>
            標準バリエーションとの比較
          </h2>
          <div className='space-y-4'>
            <div className='flex items-center gap-4 flex-wrap'>
              <Button variant='default'>Default</Button>
              <Button variant='secondary'>Secondary</Button>
              <Button variant='outline'>Outline</Button>
              <Button variant='green-gradient' size='figma-default'>
                Green Gradient (Figma)
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
