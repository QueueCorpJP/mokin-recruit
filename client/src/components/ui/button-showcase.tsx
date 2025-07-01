import React from 'react';
import { Button } from './button';

export function ButtonShowcase() {
  return (
    <div className='p-8 space-y-6 bg-gray-50 min-h-screen'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold text-gray-900 mb-8'>
          Button Component Showcase
        </h1>

        {/* Figma Design Button - Square Version */}
        <section className='bg-white p-6 rounded-lg shadow-sm mb-8'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>
            Figma Design - Green Square Button (四角いバージョン)
          </h2>
          <div className='space-y-4'>
            <div className='flex items-center gap-4 flex-wrap'>
              <Button variant='green-square' size='figma-square'>
                テキスト
              </Button>
              <Button variant='green-square' size='figma-square' disabled>
                無効状態
              </Button>
            </div>
            <div className='text-sm text-gray-600'>
              <p>
                <strong>仕様 (四角いバージョン):</strong>
              </p>
              <ul className='list-disc list-inside space-y-1 mt-2'>
                <li>
                  グラデーション: var(--green-gradient-start) →
                  var(--green-gradient-end)
                </li>
                <li>
                  ホバー時: var(--green-gradient-hover-start) →
                  var(--green-gradient-hover-end)
                </li>
                <li>
                  ボーダーラディウス: var(--green-button-square-radius) = 10px
                </li>
                <li>パディング: 14px 40px</li>
                <li>シャドウ: var(--green-button-shadow)</li>
                <li>フォント: 太字, 文字間隔: 10%</li>
                <li>Design Tokens: CSS変数を使用</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Figma Design Button - Round Version */}
        <section className='bg-white p-6 rounded-lg shadow-sm mb-8'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>
            Figma Design - Green Gradient Button (丸いバージョン)
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
                <strong>仕様 (丸いバージョン):</strong>
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

        {/* Shape Comparison */}
        <section className='bg-white p-6 rounded-lg shadow-sm mb-8'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>
            形状比較 - 四角 vs 丸
          </h2>
          <div className='space-y-4'>
            <div className='flex items-center gap-6 flex-wrap'>
              <div className='text-center'>
                <p className='text-sm font-medium text-gray-600 mb-2'>
                  四角いボタン (10px radius)
                </p>
                <div className='p-4 bg-gray-50 rounded-lg'>
                  <Button variant='green-square' size='figma-square'>
                    四角いテキスト
                  </Button>
                </div>
                <p className='text-xs text-gray-500 mt-1'>Design Token使用</p>
              </div>
              <div className='text-center'>
                <p className='text-sm font-medium text-gray-600 mb-2'>
                  丸いボタン (32px radius)
                </p>
                <div className='p-4 bg-gray-50 rounded-lg'>
                  <Button variant='green-gradient' size='figma-default'>
                    丸いテキスト
                  </Button>
                </div>
                <p className='text-xs text-gray-500 mt-1'>従来の実装</p>
              </div>
            </div>
          </div>
        </section>

        {/* Size Variations */}
        <section className='bg-white p-6 rounded-lg shadow-sm mb-8'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>
            サイズバリエーション (四角いボタン)
          </h2>
          <div className='space-y-4'>
            <div className='flex items-center gap-4 flex-wrap'>
              <Button variant='green-square' size='sm'>
                Small Square
              </Button>
              <Button variant='green-square' size='default'>
                Default Square
              </Button>
              <Button variant='green-square' size='lg'>
                Large Square
              </Button>
              <Button variant='green-square' size='figma-square'>
                Figma Square
              </Button>
            </div>
          </div>
        </section>

        {/* Interactive Hover Demonstration */}
        <section className='bg-white p-6 rounded-lg shadow-sm mb-8'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>
            ホバーステートのデモンストレーション (四角いボタン)
          </h2>
          <div className='space-y-4'>
            <div className='flex items-center gap-6 flex-wrap'>
              <div className='text-center'>
                <p className='text-sm font-medium text-gray-600 mb-2'>
                  通常状態
                </p>
                <div className='p-4 bg-gray-50 rounded-lg'>
                  <Button variant='green-square' size='figma-square'>
                    テキスト
                  </Button>
                </div>
                <p className='text-xs text-gray-500 mt-1'>CSS変数使用</p>
              </div>
              <div className='text-center'>
                <p className='text-sm font-medium text-gray-600 mb-2'>
                  ホバー時
                </p>
                <div className='p-4 bg-gray-50 rounded-lg'>
                  <Button variant='green-square' size='figma-square'>
                    マウスオーバーしてください
                  </Button>
                </div>
                <p className='text-xs text-gray-500 mt-1'>Design Token適用</p>
              </div>
            </div>
            <div className='mt-4 p-3 bg-green-50 rounded-lg'>
              <p className='text-sm text-green-800'>
                <strong>🎨 Design Tokens:</strong>{' '}
                CSS変数を使用してFigmaデザインの四角いボタンを実装しました。色やサイズの変更が容易です。
              </p>
            </div>
          </div>
        </section>

        {/* Atomic Design Structure */}
        <section className='bg-white p-6 rounded-lg shadow-sm mb-8'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>
            Atomic Design構造
          </h2>
          <div className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='p-4 border rounded-lg'>
                <h3 className='font-semibold text-gray-700 mb-2'>🔬 Atoms</h3>
                <p className='text-sm text-gray-600 mb-3'>
                  基本的なButton component
                </p>
                <div className='flex gap-2 flex-wrap'>
                  <Button variant='green-square' size='sm'>
                    Atom
                  </Button>
                </div>
              </div>
              <div className='p-4 border rounded-lg'>
                <h3 className='font-semibold text-gray-700 mb-2'>
                  🧩 Design Tokens
                </h3>
                <p className='text-sm text-gray-600 mb-3'>
                  CSS変数による統一されたデザインシステム
                </p>
                <div className='text-xs font-mono bg-gray-100 p-2 rounded'>
                  --green-gradient-start
                  <br />
                  --green-button-square-radius
                  <br />
                  --green-button-shadow
                </div>
              </div>
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
                Green Gradient (Round)
              </Button>
              <Button variant='green-square' size='figma-square'>
                Green Square (New)
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
