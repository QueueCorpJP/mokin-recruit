import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div className='flex flex-wrap items-center gap-2 mb-2 lg:mb-4'>
      {items.map((item, index) => (
        <div key={index} className='flex items-center gap-2'>
          {item.href ? (
            <Link
              href={item.href}
              className='text-white text-[14px] font-bold tracking-[1.4px] hover:opacity-80 transition-opacity'
            >
              {item.label}
            </Link>
          ) : (
            <span className='text-white text-[14px] font-bold tracking-[1.4px]'>
              {item.label}
            </span>
          )}
          {index < items.length - 1 && (
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
        </div>
      ))}
    </div>
  );
}
