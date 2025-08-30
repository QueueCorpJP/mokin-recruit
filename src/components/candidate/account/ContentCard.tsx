import { ReactNode } from 'react';

interface ContentCardProps {
  children: ReactNode;
}

export default function ContentCard({ children }: ContentCardProps) {
  return (
    <div className="flex flex-col items-center gap-6 lg:gap-10">
      <div className="bg-white rounded-3xl lg:rounded-[40px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] p-6 pb-6 pt-10 lg:p-10 w-full max-w-[728px]">
        {children}
      </div>
    </div>
  );
}