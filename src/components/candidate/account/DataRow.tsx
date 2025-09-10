import { ReactNode } from 'react';

interface DataRowProps {
  label: string;
  children: ReactNode;
}

export default function DataRow({ label, children }: DataRowProps) {
  return (
    <div className='lg:flex lg:gap-6'>
      <div className='bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center mb-2 lg:mb-0'>
        <div className='font-bold text-[16px] text-[#323232] tracking-[1.6px]'>
          {label}
        </div>
      </div>
      <div className='px-4 lg:px-0 lg:py-6 lg:flex-1'>{children}</div>
    </div>
  );
}
