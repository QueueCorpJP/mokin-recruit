'use client';

import { useState } from 'react';
import { BaseInput } from './base-input';
import { PasswordInput } from './password-input';
import { InputField } from './input-field';

export function InputSystemShowcase() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [text, setText] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
  });

  return (
    <div className='max-w-6xl mx-auto p-8 space-y-12'>
      <div className='text-center space-y-2'>
        <h1 className='text-3xl font-bold text-gray-900'>
          Input System Showcase
        </h1>
        <p className='text-gray-600'>
          汎用Input System（Design Token + Atomic Design + Type切り替え）
        </p>
      </div>

      {/* BaseInput (Atom) */}
      <section className='bg-white p-6 rounded-lg shadow-sm border'>
        <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
          BaseInput Components (Atoms)
        </h2>

        <div className='space-y-6'>
          <div>
            <h3 className='text-lg font-medium text-gray-700 mb-3'>
              Email Input
            </h3>
            <BaseInput
              type='email'
              placeholder='name@example.com'
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div>
            <h3 className='text-lg font-medium text-gray-700 mb-3'>
              Text Input
            </h3>
            <BaseInput
              type='text'
              placeholder='テキストを入力してください'
              value={text}
              onChange={e => setText(e.target.value)}
            />
          </div>

          <div>
            <h3 className='text-lg font-medium text-gray-700 mb-3'>
              Error State
            </h3>
            <BaseInput
              type='email'
              placeholder='エラー状態のサンプル'
              error={true}
            />
          </div>
        </div>
      </section>

      {/* PasswordInput (Specialized Atom) */}
      <section className='bg-white p-6 rounded-lg shadow-sm border'>
        <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
          PasswordInput Component (Specialized Atom)
        </h2>

        <div className='space-y-6'>
          <div>
            <h3 className='text-lg font-medium text-gray-700 mb-3'>
              Password with Toggle
            </h3>
            <PasswordInput
              value={password}
              onChange={e => setPassword(e.target.value)}
              showToggle={true}
            />
          </div>

          <div>
            <h3 className='text-lg font-medium text-gray-700 mb-3'>
              Password without Toggle
            </h3>
            <PasswordInput showToggle={false} />
          </div>

          <div>
            <h3 className='text-lg font-medium text-gray-700 mb-3'>
              Password Error State
            </h3>
            <PasswordInput error={true} />
          </div>
        </div>
      </section>

      {/* InputField (Molecule) */}
      <section className='bg-white p-6 rounded-lg shadow-sm border'>
        <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
          InputField Components (Molecules)
        </h2>

        <div className='space-y-8'>
          <div>
            <h3 className='text-lg font-medium text-gray-700 mb-4'>
              Horizontal Layout (ラベル左揃え - 従来版)
            </h3>
            <div className='space-y-6'>
              <InputField
                inputType='email'
                layout='horizontal'
                required={true}
                inputProps={{
                  value: formData.email,
                  onChange: e =>
                    setFormData(prev => ({ ...prev, email: e.target.value })),
                }}
              />

              <InputField
                inputType='password'
                layout='horizontal'
                required={true}
                inputProps={{
                  value: formData.password,
                  onChange: e =>
                    setFormData(prev => ({
                      ...prev,
                      password: e.target.value,
                    })),
                }}
              />

              <InputField
                inputType='password'
                label='パスワード確認'
                layout='horizontal'
                required={true}
                inputProps={{
                  value: formData.confirmPassword,
                  onChange: e =>
                    setFormData(prev => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    })),
                }}
              />

              <InputField
                inputType='text'
                label='ユーザー名'
                layout='horizontal'
                inputProps={{
                  value: formData.username,
                  onChange: e =>
                    setFormData(prev => ({
                      ...prev,
                      username: e.target.value,
                    })),
                  placeholder: 'username123',
                }}
              />
            </div>
          </div>

          <div>
            <h3 className='text-lg font-medium text-gray-700 mb-4'>
              Vertical Layout
            </h3>
            <div className='space-y-4 max-w-md'>
              <InputField inputType='email' layout='vertical' required={true} />

              <InputField
                inputType='password'
                layout='vertical'
                required={true}
              />
            </div>
          </div>

          <div>
            <h3 className='text-lg font-medium text-gray-700 mb-4'>
              Error States
            </h3>
            <div className='space-y-6'>
              <InputField
                inputType='email'
                layout='horizontal'
                errorMessage='有効なメールアドレスを入力してください'
                inputProps={{
                  error: true,
                }}
              />

              <InputField
                inputType='password'
                layout='horizontal'
                errorMessage='パスワードは8文字以上である必要があります'
                inputProps={{
                  error: true,
                }}
              />
            </div>
          </div>

          <div>
            <h3 className='text-lg font-medium text-gray-700 mb-4'>
              Horizontal Layout (Figma仕様 + ラベル右揃え)
            </h3>
            <div className='space-y-6'>
              <InputField
                inputType='email'
                layout='horizontal'
                required={true}
                inputProps={{
                  value: formData.email,
                  onChange: e =>
                    setFormData(prev => ({ ...prev, email: e.target.value })),
                }}
              />

              <InputField
                inputType='password'
                layout='horizontal'
                required={true}
                inputProps={{
                  value: formData.password,
                  onChange: e =>
                    setFormData(prev => ({
                      ...prev,
                      password: e.target.value,
                    })),
                }}
              />

              <InputField
                inputType='password'
                label='パスワード確認'
                layout='horizontal'
                required={true}
                inputProps={{
                  value: formData.confirmPassword,
                  onChange: e =>
                    setFormData(prev => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    })),
                }}
              />

              <InputField
                inputType='text'
                label='ユーザー名'
                layout='horizontal'
                inputProps={{
                  value: formData.username,
                  onChange: e =>
                    setFormData(prev => ({
                      ...prev,
                      username: e.target.value,
                    })),
                  placeholder: 'username123',
                }}
              />

              {/* ラベル長の違いをテストするための追加ケース */}
              <InputField
                inputType='text'
                label='会社名'
                layout='horizontal'
                inputProps={{
                  placeholder: '株式会社サンプル',
                }}
              />

              <InputField
                inputType='text'
                label='電話番号'
                layout='horizontal'
                inputProps={{
                  placeholder: '090-1234-5678',
                }}
              />

              <InputField
                inputType='text'
                label='住所（都道府県）'
                layout='horizontal'
                inputProps={{
                  placeholder: '東京都',
                }}
              />
            </div>

            <div className='mt-6 p-4 bg-blue-50 rounded-lg'>
              <h4 className='text-sm font-medium text-blue-800 mb-2'>
                🎯 ラベル右揃えの効果
              </h4>
              <p className='text-sm text-blue-700'>
                ラベルの文字数が異なっても、すべての入力フィールドの開始位置が統一されています。
                <br />
                これにより、フォーム全体の視覚的な一貫性が保たれ、ユーザビリティが向上します。
              </p>
            </div>
          </div>

          <div>
            <h3 className='text-lg font-medium text-gray-700 mb-4'>
              Error States
            </h3>
            <div className='space-y-6'>
              <InputField
                inputType='email'
                layout='horizontal'
                errorMessage='有効なメールアドレスを入力してください'
                inputProps={{
                  error: true,
                }}
              />

              <InputField
                inputType='password'
                layout='horizontal'
                errorMessage='パスワードは8文字以上である必要があります'
                inputProps={{
                  error: true,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Form Example */}
      <section className='bg-white p-6 rounded-lg shadow-sm border'>
        <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
          Complete Form Example
        </h2>

        <form className='space-y-6 max-w-2xl'>
          <InputField
            inputType='email'
            layout='horizontal'
            required={true}
            inputProps={{
              value: formData.email,
              onChange: e =>
                setFormData(prev => ({ ...prev, email: e.target.value })),
            }}
          />

          <InputField
            inputType='password'
            layout='horizontal'
            required={true}
            inputProps={{
              value: formData.password,
              onChange: e =>
                setFormData(prev => ({ ...prev, password: e.target.value })),
            }}
          />

          <InputField
            inputType='text'
            label='ユーザー名'
            layout='horizontal'
            inputProps={{
              value: formData.username,
              onChange: e =>
                setFormData(prev => ({ ...prev, username: e.target.value })),
              placeholder: 'username123',
            }}
          />

          <div className='pt-4'>
            <button
              type='submit'
              className='px-6 py-2 bg-[var(--input-focus-border-color)] text-white rounded-md hover:opacity-90 transition-opacity'
            >
              送信
            </button>
          </div>
        </form>
      </section>

      {/* Design Token Values */}
      <section className='bg-gray-50 p-6 rounded-lg'>
        <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
          Design Token Values
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm'>
          <div className='bg-white p-3 rounded border'>
            <div className='font-medium text-gray-700'>Width</div>
            <div className='text-gray-600'>400px</div>
          </div>
          <div className='bg-white p-3 rounded border'>
            <div className='font-medium text-gray-700'>Padding</div>
            <div className='text-gray-600'>11px</div>
          </div>
          <div className='bg-white p-3 rounded border'>
            <div className='font-medium text-gray-700'>Border Radius</div>
            <div className='text-gray-600'>5px</div>
          </div>
          <div className='bg-white p-3 rounded border'>
            <div className='font-medium text-gray-700'>Border Color</div>
            <div className='text-gray-600'>#999999</div>
          </div>
          <div className='bg-white p-3 rounded border'>
            <div className='font-medium text-gray-700'>Focus Color</div>
            <div className='text-gray-600'>#0f9058</div>
          </div>
          <div className='bg-white p-3 rounded border'>
            <div className='font-medium text-gray-700'>Text Color</div>
            <div className='text-gray-600'>#323232</div>
          </div>
        </div>
      </section>
    </div>
  );
}
