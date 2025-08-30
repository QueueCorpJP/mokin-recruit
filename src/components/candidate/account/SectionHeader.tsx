interface SectionHeaderProps {
  title: string;
}

export default function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <div className="mb-6 lg:mb-6">
      <div className="mb-2">
        <h2 className="text-[#323232] text-[18px] lg:text-[20px] font-bold tracking-[1.8px] lg:tracking-[2px] leading-[1.6]">
          {title}
        </h2>
      </div>
      <div className="border-b border-[#dcdcdc] mb-6"></div>
    </div>
  );
}