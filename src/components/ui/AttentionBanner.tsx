import React from 'react';

interface AttentionBannerProps {
  title?: string;
  content?: string | React.ReactNode;
  className?: string;
}

function AttentionIcon() {
  return (
    <div className="content-stretch flex gap-2.5 items-center justify-center relative size-full">
      <div className="aspect-[24/20.971] basis-0 grow min-h-px min-w-px relative shrink-0">
        <svg 
          width="24" 
          height="22" 
          viewBox="0 0 24 22" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="block max-w-none size-full"
        >
          <path 
            d="M11.9991 0.513672C12.6648 0.513672 13.2789 0.864747 13.6164 1.44051L23.7422 18.6666C24.0844 19.247 24.0844 19.9632 23.7515 20.5437C23.4187 21.1241 22.7952 21.4845 22.1249 21.4845H1.8734C1.20304 21.4845 0.579561 21.1241 0.246725 20.5437C-0.0861113 19.9632 -0.0814235 19.2423 0.256101 18.6666L10.3818 1.44051C10.7193 0.864747 11.3335 0.513672 11.9991 0.513672ZM11.9991 6.50535C11.3756 6.50535 10.874 7.00622 10.874 7.62879V12.8715C10.874 13.4941 11.3756 13.9949 11.9991 13.9949C12.6226 13.9949 13.1242 13.4941 13.1242 12.8715V7.62879C13.1242 7.00622 12.6226 6.50535 11.9991 6.50535ZM13.4992 16.9908C13.4992 16.5935 13.3412 16.2125 13.0599 15.9316C12.7785 15.6507 12.397 15.4929 11.9991 15.4929C11.6013 15.4929 11.2197 15.6507 10.9384 15.9316C10.6571 16.2125 10.499 16.5935 10.499 16.9908C10.499 17.3881 10.6571 17.7691 10.9384 18.05C11.2197 18.3309 11.6013 18.4887 11.9991 18.4887C12.397 18.4887 12.7785 18.3309 13.0599 18.05C13.3412 17.7691 13.4992 17.3881 13.4992 16.9908Z" 
            fill="#FF5B5B"
          />
        </svg>
      </div>
    </div>
  );
}

export default function AttentionBanner({ 
  title = "求人内容の編集についてのご注意",
  content = (
    <>
      <p className="mb-0">この求人は現在公開中です。すでに応募・スカウト済みの候補者がいる場合、内容変更により誤解やトラブルが発生する可能性があります。</p>
      <p className="">変更内容は慎重にご確認の上、必要に応じて応募者へのご連絡をお願いいたします。</p>
    </>
  ),
  className = ""
}: AttentionBannerProps) {
  return (
    <div className={`bg-[#ffe3e3] box-border content-stretch flex flex-col gap-6 items-center justify-start p-[40px] relative rounded-[10px] size-full ${className}`}>
      <div className="content-stretch flex gap-3 items-center justify-start relative shrink-0 w-full">
        <div className="content-stretch flex gap-2.5 items-center justify-center relative shrink-0 size-6">
          <AttentionIcon />
        </div>
        <div className="font-['Noto_Sans_JP'] font-bold leading-[0] not-italic relative shrink-0 text-[#ff5b5b] text-[20px] text-nowrap tracking-[2px]">
          <p className="leading-[1.6] whitespace-pre">{title}</p>
        </div>
      </div>
      <div className="font-['Noto_Sans_JP'] font-medium leading-[2] not-italic relative shrink-0 text-[#323232] text-[14px] tracking-[1.4px] w-full">
        {typeof content === 'string' ? <p>{content}</p> : content}
      </div>
    </div>
  );
}