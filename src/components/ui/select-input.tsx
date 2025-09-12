'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectInputProps {
  options: SelectOption[];
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  className?: string;
  style?: React.CSSProperties;
  radius?: number;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  onOpen?: () => void;
  onClose?: () => void;
  'data-testid'?: string;
  forcePosition?: 'top' | 'bottom'; // ドロップダウンの位置を強制指定
  // NOTE: 元に戻すため、borderlessは撤回（呼び出し局所で制御する）
}

// カスタムドロップダウンアイコンコンポーネント
const DropdownIcon = ({
  className,
  isOpen,
  error,
  disabled,
}: {
  className?: string;
  isOpen: boolean;
  error: boolean;
  disabled: boolean;
}) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='14'
    height='10'
    viewBox='0 0 14 10'
    fill='none'
    className={cn(
      'transition-transform duration-200',
      isOpen && 'rotate-180',
      className
    )}
    style={{
      width: '14px',
      height: '9.333px',
      aspectRatio: '14.00/9.33',
    }}
  >
    <path
      d='M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z'
      fill={error ? '#F56C6C' : disabled ? '#999999' : '#0F9058'}
    />
  </svg>
);

export function SelectInput({
  options = [],
  value = '',
  placeholder = '選択してください',
  disabled = false,
  error = false,
  errorMessage = '',
  className = '',
  style,
  radius = 8,
  onChange,
  onBlur,
  onFocus,
  onOpen,
  onClose,
  forcePosition,
  'data-testid': testId,
}: SelectInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
  const selectRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // 選択された項目のラベルを取得
  const selectedOption = options.find(option => option.value === selectedValue);
  let displayText = selectedOption ? selectedOption.label : placeholder;
  // 年収・アピールポイントセレクト用途の場合はprefixを付与
  if (
    placeholder &&
    (placeholder.startsWith('年収') ||
      placeholder.startsWith('アピールポイント'))
  ) {
    if (selectedOption) {
      const prefix = placeholder.startsWith('年収')
        ? '年収：'
        : 'アピールポイント：';
      const base = `${prefix}${selectedOption.label}`;
      displayText = base.length > 30 ? base.slice(0, 30) + '...' : base;
    } else {
      displayText = placeholder;
    }
  }

  // 外部クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        if (isOpen) {
          onClose?.();
        }
        setIsOpen(false);
        onBlur?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onBlur, onClose, isOpen]);

  // propsのvalueが変更された時に内部状態を同期
  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  // ドロップダウンの位置を計算
  useEffect(() => {
    if (isOpen && selectRef.current) {
      // forcePositionが指定されている場合はそれを使用
      if (forcePosition) {
        setDropdownPosition(forcePosition);
        return;
      }
      
      const rect = selectRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      const dropdownMaxHeight = 240; // max-h-60 = 240px
      
      // 下に十分なスペースがあるか、または上のスペースが不十分な場合は下に表示
      if (spaceBelow >= dropdownMaxHeight || spaceAbove < dropdownMaxHeight) {
        setDropdownPosition('bottom');
      } else {
        setDropdownPosition('top');
      }
    }
  }, [isOpen, forcePosition]);

  // 選択処理
  const handleSelect = (optionValue: string) => {
    if (disabled) return;

    const selectedOption = options.find(opt => opt.value === optionValue);
    if (selectedOption?.disabled) return;

    setSelectedValue(optionValue);
    setIsOpen(false);
    onClose?.();
    onChange?.(optionValue);
    onBlur?.();
  };

  // トグル処理
  const handleToggle = () => {
    if (disabled) return;
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    
    if (newIsOpen) {
      onOpen?.();
    } else {
      onClose?.();
    }
  };

  // キーボード操作
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        const newIsOpen = !isOpen;
        setIsOpen(newIsOpen);
        if (newIsOpen) {
          onOpen?.();
        } else {
          onClose?.();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        onClose?.();
        onBlur?.();
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          onOpen?.();
        } else {
          // フォーカスを次の選択肢に移動
          const currentIndex = options.findIndex(
            opt => opt.value === selectedValue
          );
          const nextIndex = Math.min(currentIndex + 1, options.length - 1);
          if (nextIndex !== currentIndex && options[nextIndex]) {
            handleSelect(options[nextIndex]!.value);
          }
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (isOpen) {
          const currentIndex = options.findIndex(
            opt => opt.value === selectedValue
          );
          const prevIndex = Math.max(currentIndex - 1, 0);
          if (prevIndex !== currentIndex && options[prevIndex]) {
            handleSelect(options[prevIndex]!.value);
          }
        }
        break;
    }
  };

  return (
    <div
      className={cn('relative', className)}
      ref={selectRef}
      data-testid={testId}
    >
      {/* セレクトボタン */}
      <button
        type='button'
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        onFocus={onFocus}
        disabled={disabled}
        className={cn(
          // 基本スタイル（Figma準拠）
          'flex items-center justify-between w-full',
          'bg-white border border-[#999999] rounded-[8px] text-left',
          'font-["Noto_Sans_JP"] text-[16px] font-bold leading-[32px] tracking-[1.6px]',
          'transition-all duration-200 ease-in-out',
          'appearance-none outline-none focus:outline-none',

          // 状態別スタイル
          !disabled &&
            !error && [
              'hover:border-[#4FC3A1] hover:shadow-[0_0_0_2px_rgba(79,195,161,0.1)]',
              'focus:border-[#4FC3A1] focus:shadow-[0_0_0_2px_rgba(79,195,161,0.2)]',
              isOpen &&
                'border-[#4FC3A1] shadow-[0_0_0_2px_rgba(79,195,161,0.2)]',
            ],

          // エラー状態
          error && [
            'border-[#F56C6C] text-[#F56C6C]',
            'hover:border-[#F56C6C] focus:border-[#F56C6C]',
            'focus:shadow-[0_0_0_2px_rgba(245,108,108,0.2)]',
          ],

          // 無効状態
          disabled && [
            'bg-[#F5F5F5] border-[#E0E0E0] text-[#999999] cursor-not-allowed',
          ],

          // テキスト色
          selectedValue ? 'text-[#323232]' : 'text-[#323232]'
        )}
        style={{
          padding: '4px 16px 4px 11px',
          alignItems: 'center',
          gap: '16px',
          borderRadius: `${radius}px`,
          ...style,
        }}
        aria-expanded={isOpen}
        aria-haspopup='listbox'
        aria-label={placeholder}
      >
        <span
          className={cn(
            'w-full block text-ellipsis overflow-hidden whitespace-nowrap',
            displayText === 'すべて' && 'text-[14px]'
          )}
        >
          {displayText}
        </span>

        {/* カスタムドロップダウンアイコン */}
        <DropdownIcon
          className='ml-1'
          isOpen={isOpen}
          error={error}
          disabled={disabled}
        />
      </button>

      {/* ドロップダウンリスト */}
      {isOpen && (
        <ul
          ref={listRef}
          className={cn(
            // 基本スタイル
            'absolute left-0 right-0 z-[9999]',
            'bg-white border border-[#999999] rounded-[8px]',
            'shadow-[0_4px_12px_0_rgba(0,0,0,0.15)]',
            'max-h-60 overflow-y-auto',
            'py-1',
            // 位置に応じたスタイル
            dropdownPosition === 'bottom' ? 'top-full mt-1' : 'bottom-full mb-1'
          )}
          style={{ borderRadius: `${radius}px` }}
          role='listbox'
          aria-label='選択肢'
        >
          {options.map(option => (
            <li
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={cn(
                // 基本スタイル
                'px-4 py-3 cursor-pointer',
                'font-["Noto_Sans_JP"] text-[16px] font-bold leading-[32px] tracking-[1.6px]',
                'transition-colors duration-150',

                // 状態別スタイル
                option.disabled
                  ? ['text-[#CCCCCC] cursor-not-allowed bg-[#F9F9F9]']
                  : ['text-[#323232] hover:bg-[#F0F9F2] hover:text-[#0F9058]'],

                // 選択済み
                option.value === selectedValue &&
                  !option.disabled && ['bg-[#E8F5E8] text-[#0F9058] font-bold']
              )}
              role='option'
              aria-selected={option.value === selectedValue}
              aria-disabled={option.disabled}
            >
              {option.label}
            </li>
          ))}

          {/* 選択肢が空の場合 */}
          {options.length === 0 && (
            <li className="px-4 py-3 text-[#999999] font-['Noto_Sans_JP'] text-[16px] font-bold leading-[32px] tracking-[1.6px]">
              選択肢がありません
            </li>
          )}
        </ul>
      )}

      {/* エラーメッセージ */}
      {error && errorMessage && (
        <div className="mt-1 text-[#F56C6C] text-[14px] font-['Noto_Sans_JP'] font-normal leading-[1.4] tracking-[0.025em]">
          {errorMessage}
        </div>
      )}
    </div>
  );
}