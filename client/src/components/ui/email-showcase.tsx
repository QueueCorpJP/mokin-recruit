'use client';

import { useState } from 'react';
import { EmailInput } from './email-input';
import { EmailFormField } from './email-form-field';

export function EmailShowcase() {
  const [email1, setEmail1] = useState('');
  const [email2, setEmail2] = useState('');
  const [email3, setEmail3] = useState('');
  const [email4, setEmail4] = useState('');

  return (
    <div className='max-w-6xl mx-auto p-8 space-y-8'>
      <div className='text-center space-y-2'>
        <h1 className='text-3xl font-bold text-gray-900'>
          Email Input Components Showcase
        </h1>
        <p className='text-gray-600'>
          Figma仕様に基づくメールアドレス入力コンポーネント（Design Token +
          Atomic Design）
        </p>
      </div>

      {/* EmailInput (Atom) */}
      <section className='bg-white p-6 rounded-lg shadow-sm border'>
        <h2 className='text-xl font-semibold text-gray-800 mb-4'>
          EmailInput (Atom)
        </h2>
        <div className='space-y-6'>
          {/* Default State */}
          <div className='space-y-2'>
            <h3 className='text-sm font-medium text-gray-600'>Default</h3>
            <EmailInput
              value={email1}
              onChange={e => setEmail1(e.target.value)}
            />
          </div>

          {/* Error State */}
          <div className='space-y-2'>
            <h3 className='text-sm font-medium text-gray-600'>Error State</h3>
            <EmailInput
              value={email2}
              onChange={e => setEmail2(e.target.value)}
              error={true}
            />
          </div>

          {/* Disabled State */}
          <div className='space-y-2'>
            <h3 className='text-sm font-medium text-gray-600'>Disabled</h3>
            <EmailInput value='disabled@example.com' disabled />
          </div>
        </div>
      </section>

      {/* EmailFormField (Molecule) - Horizontal Layout */}
      <section className='bg-white p-6 rounded-lg shadow-sm border'>
        <h2 className='text-xl font-semibold text-gray-800 mb-4'>
          EmailFormField - 横並びレイアウト (Figma仕様)
        </h2>
        <div className='space-y-6'>
          {/* Default */}
          <div className='space-y-2'>
            <h3 className='text-sm font-medium text-gray-600'>Default</h3>
            <EmailFormField
              value={email3}
              onChange={e => setEmail3(e.target.value)}
            />
          </div>

          {/* Required */}
          <div className='space-y-2'>
            <h3 className='text-sm font-medium text-gray-600'>Required</h3>
            <EmailFormField
              required
              value={email4}
              onChange={e => setEmail4(e.target.value)}
            />
          </div>

          {/* With Description */}
          <div className='space-y-2'>
            <h3 className='text-sm font-medium text-gray-600'>
              With Description
            </h3>
            <EmailFormField description='登録時に使用したメールアドレスを入力してください' />
          </div>

          {/* Error State */}
          <div className='space-y-2'>
            <h3 className='text-sm font-medium text-gray-600'>Error State</h3>
            <EmailFormField errorMessage='有効なメールアドレスを入力してください' />
          </div>

          {/* Custom Label */}
          <div className='space-y-2'>
            <h3 className='text-sm font-medium text-gray-600'>Custom Label</h3>
            <EmailFormField label='会社メールアドレス' required />
          </div>
        </div>
      </section>

      {/* EmailFormField (Molecule) - Vertical Layout */}
      <section className='bg-white p-6 rounded-lg shadow-sm border'>
        <h2 className='text-xl font-semibold text-gray-800 mb-4'>
          EmailFormField - 縦並びレイアウト
        </h2>
        <div className='space-y-6'>
          {/* Vertical Default */}
          <div className='space-y-2'>
            <h3 className='text-sm font-medium text-gray-600'>
              Vertical Layout
            </h3>
            <EmailFormField layout='vertical' />
          </div>

          {/* Vertical with Error */}
          <div className='space-y-2'>
            <h3 className='text-sm font-medium text-gray-600'>
              Vertical with Error
            </h3>
            <EmailFormField
              layout='vertical'
              errorMessage='このメールアドレスは既に登録されています'
            />
          </div>
        </div>
      </section>

      {/* Design Tokens Reference */}
      <section className='bg-gray-50 p-6 rounded-lg border'>
        <h2 className='text-xl font-semibold text-gray-800 mb-4'>
          Design Tokens Reference
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
          <div className='space-y-2'>
            <h3 className='font-medium'>Input Field</h3>
            <ul className='space-y-1 text-gray-600'>
              <li>Width: 400px</li>
              <li>Padding: 11px</li>
              <li>Border Radius: 5px</li>
              <li>Border: 1px solid #999999</li>
              <li>Font: Noto Sans JP, 500, 16px</li>
            </ul>
          </div>
          <div className='space-y-2'>
            <h3 className='font-medium'>Label</h3>
            <ul className='space-y-1 text-gray-600'>
              <li>Color: #323232</li>
              <li>Font: Noto Sans JP, 700, 16px</li>
              <li>Line Height: 2em</li>
              <li>Letter Spacing: 0.1em</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
