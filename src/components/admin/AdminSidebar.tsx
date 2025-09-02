'use client';

import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";
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
    icon: <img src="/images/admin/home.svg" alt="home" width={20} height={20} />,
    title: "管理画面ホーム",
    href: "/admin",
    subItems: [],
  },
  {
    icon: <img src="/images/admin/ofer.svg" alt="file-text" width={20} height={20} />,
    title: "求人",
    href: "/admin/job",
    subItems: [
      { title: "求人一覧", href: "/admin/job" },
      { title: "新規求人作成", href: "/admin/job/new" },
      { title: "要確認求人", href: "/admin/job/pending" },
    ],
  },
  {
    icon: <img src="/images/admin/mail.svg" alt="mail" width={20} height={20} />,
    title: "メッセージ",
    href: "/admin/message",
    subItems: [
      { title: "メッセージ一覧", href: "/admin/message" },
      { title: "要確認メッセージ", href: "/admin/message/pending" },
      { title: "NGワード設定", href: "/admin/message/ngword" },
    ],
  },
  {
    icon: <img src="/images/admin/company.svg" alt="building" width={20} height={20} />,
    title: "企業アカウント",
    href: "/admin/company",
    subItems: [
      { title: "企業一覧", href: "/admin/company" },
      { title: "新規企業アカウント追加", href: "/admin/company/new" },
    ],
  },
  {
    icon: <img src="/images/admin/candidate.svg" alt="users" width={20} height={20} />,
    title: "候補者",
    href: "/admin/candidate",
    subItems: [
      { title: "候補者一覧", href: "/admin/candidate" },
      { title: "新規追加", href: "/admin/candidate/new" },
      // { title: "登録待ち書類", href: "/admin/candidate/pending" }, // 未実装のため一時的にコメントアウト
    ],
  },
  {
    icon: <img src="/images/admin/media.svg" alt="newspaper" width={20} height={20} />,
    title: "メディア",
    href: "/admin/media",
    subItems: [
      { title: "記事一覧", href: "/admin/media" },
      { title: "記事作成", href: "/admin/media/new" },
      { title: "カテゴリ一覧", href: "/admin/media/category" },
      { title: "カテゴリ作成", href: "/admin/media/category?modal=add" },
      { title: "タグ一覧", href: "/admin/media/tag" },
      { title: "タグ作成", href: "/admin/media/tag?modal=add" },
    ],
  },
  {
    icon: <img src="/images/admin/notice.svg" alt="megaphone" width={20} height={20} />,
    title: "運営からのお知らせ",
    href: "/admin/notice",
    subItems: [
      { title: "お知らせ一覧", href: "/admin/notice" },
      { title: "お知らせ追加", href: "/admin/notice/new" },
    ],
  },
  {
    icon: <img src="/images/admin/chert.svg" alt="bar-chart" width={20} height={20} />,
    title: "分析",
    href: "/admin/analytics",
    subItems: [
      { title: "企業・候補者分析", href: "/admin/analytics" },
    ],
  },
];

// Main Screen component (inline)
export const AdminSidebar = React.memo((): React.JSX.Element => {
  return (
    <nav className="flex flex-col items-start gap-4 p-6 bg-r-ul-TKL border-r border-[#efefef]">
      {navigationItems.map((section, index) => (
        <React.Fragment key={section.href}>
          <Link 
            href={section.href}
            prefetch={true}
            className="flex items-center gap-2 w-full hover:opacity-80 transition-opacity duration-150"
          >
            {section.icon}
            <span className="font-bold Noto_Sans_JP text-[#323232] tracking-[1.6px] leading-[200%] whitespace-nowrap">
              {section.title}
            </span>
          </Link>

          {section.subItems.length > 0 && (
            <div className="pl-7 space-y-1">
              {section.subItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={true}
                  className="flex items-center gap-2 w-full hover:opacity-80 transition-opacity duration-150"
                >
                  <span className="text-[#323232] text-[12px] leading-[200%]">•</span>
                  <span className="font-bold Noto_Sans_JP text-[#323232] text-[16px] tracking-[1.6px] leading-[200%] whitespace-nowrap">
                    {item.title}
                  </span>
                </Link>
              ))}
            </div>
          )}

          {index < navigationItems.length - 1 && (
            <Separator className="w-full" />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
});

AdminSidebar.displayName = 'AdminSidebar';

