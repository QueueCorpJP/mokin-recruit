import React from 'react';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * [Breadcrumbs]
 * パンくずリストを共通化するコンポーネント。
 * - items: パンくずリストの項目（label, href, isCurrent）
 * - className: 追加クラス
 */
const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  return (
    <nav
      className={`flex flex-wrap items-center gap-2 mb-2 lg:mb-4 ${className}`}
      aria-label='breadcrumb'
    >
      {items.map((item, idx) => (
        <React.Fragment key={item.label}>
          {item.href && !item.isCurrent ? (
            <Link
              href={item.href}
              className='text-white text-[14px] font-bold tracking-[1.4px] hover:opacity-80 transition-opacity'
            >
              {item.label}
            </Link>
          ) : (
            <span
              className={`text-white text-[14px] font-bold tracking-[1.4px]${
                item.isCurrent ? ' opacity-80' : ''
              }`}
            >
              {item.label}
            </span>
          )}
          {idx < items.length - 1 && (
            <svg
              width='8'
              height='8'
              viewBox='0 0 8 8'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              className='flex-shrink-0'
            >
              <path
                d='M3 1L6 4L3 7'
                stroke='white'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
