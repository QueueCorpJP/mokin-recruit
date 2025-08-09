'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
// Separator component (inline)
interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
}

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
    <div
      ref={ref}
      role={decorative ? "none" : "separator"}
      aria-orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
);
Separator.displayName = "Separator";

// Navigation data structure for better maintainability
const navigationItems = [
  {
    icon: <Image src="/images/admin/home.svg" alt="home" width={20} height={20} />,
    title: "管理画面ホーム",
    href: "/admin",
    subItems: [],
  },
  {
    icon: <Image src="/images/admin/ofer.svg" alt="file-text" width={20} height={20} />,
    title: "求人",
    href: "/admin/job",
    subItems: ["求人一覧", "新規求人作成", "要確認求人"],
  },
  {
    icon: <Image src="/images/admin/mail.svg" alt="mail" width={20} height={20} />,
    title: "メッセージ",
    href: "/admin/message",
    subItems: ["メッセージ一覧", "要確認メッセージ", "NGワード設定"],
  },
  {
    icon: <Image src="/images/admin/company.svg" alt="building" width={20} height={20} />,
    title: "企業アカウント",
    href: "/admin/company",
    subItems: ["企業一覧", "新規企業アカウント追加"],
  },
  {
    icon: <Image src="/images/admin/candidate.svg" alt="users" width={20} height={20} />,
    title: "候補者",
    href: "/admin/candidate",
    subItems: ["候補者一覧", "新規追加", "登録待ち書類"],
  },
  {
    icon: <Image src="/images/admin/media.svg" alt="newspaper" width={20} height={20} />,
    title: "メディア",
    href: "/admin/media",
    subItems: [
      "記事一覧",
      "記事作成",
      "カテゴリ一覧",
      "カテゴリ作成",
      "タグ一覧",
      "タグ作成",
    ],
  },
  {
    icon: <Image src="/images/admin/notice.svg" alt="megaphone" width={20} height={20} />,
    title: "運営からのお知らせ",
    href: "/admin/notice",
    subItems: ["お知らせ一覧", "お知らせ追加"],
  },
  {
    icon: <Image src="/images/admin/chert.svg" alt="bar-chart" width={20} height={20} />,
    title: "分析",
    href: "/admin/analytics",
    subItems: ["企業・候補者分析"],
  },
];

// Main Screen component (inline)
export const AdminSidebar = (): React.JSX.Element => {
  return (
    <nav className="flex flex-col items-start gap-4 p-6 bg-r-ul-TKL border-r border-[#efefef]">
      {navigationItems.map((section, index) => (
        <React.Fragment key={`nav-section-${index}`}>
          <Link href={section.href} className="flex items-center gap-2 w-full">
            {section.icon}
            <span className="font-bold Noto_Sans_JP text-[#323232] tracking-[1.6px] leading-[200%] whitespace-nowrap">
              {section.title}
            </span>
          </Link>

          {section.subItems.map((item, subIndex) => (
            <div
              key={`sub-item-${index}-${subIndex}`}
              className="flex items-center gap-2 pl-7 w-full"
            >
              <div className="w-1.5 h-1.5 bg-ZC-dn-VC rounded-[3px]" />
              <span className="font-bold Noto_Sans_JP text-[#323232] text-[16px] tracking-[1.6px] leading-[200%] whitespace-nowrap">
                {item}
              </span>
            </div>
          ))}

          {index < navigationItems.length - 1 && (
            <Separator className="w-full" />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

