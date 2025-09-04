'use client';

import React from 'react';
import { PaginationArrow } from '@/components/svg/PaginationArrow';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  className = '' 
}: PaginationProps) {
  // ページ番号の計算ロジック（会社求人一覧と同じ）
  const getPages = () => {
    if (totalPages <= 5) {
      // 総ページ数が5以下の場合は全て表示
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // 5個固定で表示
    const pages = new Set<number>();
    
    // 先頭ページ
    pages.add(1);
    
    // 前ページ
    if (currentPage > 1) {
      pages.add(currentPage - 1);
    }
    
    // 現在のページ
    pages.add(currentPage);
    
    // 次ページ
    if (currentPage < totalPages) {
      pages.add(currentPage + 1);
    }
    
    // 最終ページ
    pages.add(totalPages);
    
    // 5個になるまで追加
    const sortedPages = [...pages].sort((a, b) => a - b);
    while (sortedPages.length < 5) {
      // 現在のページ周辺で不足分を埋める
      for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
        if (!pages.has(i)) {
          pages.add(i);
          break;
        }
      }
      // それでも足りない場合は全体から補完
      for (let i = 1; i <= totalPages && sortedPages.length < 5; i++) {
        if (!pages.has(i)) {
          pages.add(i);
        }
      }
      break;
    }
    
    return [...pages].sort((a, b) => a - b).slice(0, 5);
  };

  if (totalPages < 1) {
    return null;
  }

  return (
    <div className={`flex justify-center items-center gap-4 ${className}`}>
      {/* 前のページボタン */}
      <button
        className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full border text-[16px] font-bold transition-colors
          ${currentPage === 1
            ? 'border-[#DCDCDC] text-[#DCDCDC] cursor-not-allowed bg-white'
            : 'border-[#0F9058] text-[#0F9058] hover:bg-[#F3FBF7] bg-white'
          }`}
        onClick={() => {
          onPageChange(Math.max(1, currentPage - 1));
          // ページ遷移後にページトップにスクロール
          setTimeout(() => {
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          }, 100);
        }}
        disabled={currentPage === 1}
        aria-label="前のページ"
      >
        <PaginationArrow direction="left" className="w-3 h-4" />
      </button>

      {/* ページ番号ボタン */}
      {getPages().map((pageNum, index) => {
        // スマホでは最大3つまで表示
        const isHiddenOnMobile = index > 2;
        
        return (
          <button
            key={pageNum}
            className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full border text-[16px] font-bold transition-colors
              ${currentPage === pageNum
                ? 'bg-[#0F9058] text-white border-[#0F9058]'
                : 'border-[#0F9058] text-[#0F9058] bg-white hover:bg-[#F3FBF7]'
              }
              ${isHiddenOnMobile ? 'hidden md:flex' : 'flex'}`}
            onClick={() => {
              onPageChange(pageNum);
              // ページ遷移後にページトップにスクロール
              setTimeout(() => {
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth'
                });
              }, 100);
            }}
          >
            {pageNum}
          </button>
        );
      })}

      {/* 次のページボタン */}
      <button
        className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full border text-[16px] font-bold transition-colors
          ${currentPage === totalPages
            ? 'border-[#DCDCDC] text-[#DCDCDC] cursor-not-allowed bg-white'
            : 'border-[#0F9058] text-[#0F9058] hover:bg-[#F3FBF7] bg-white'
          }`}
        onClick={() => {
          onPageChange(Math.min(totalPages, currentPage + 1));
          // ページ遷移後にページトップにスクロール
          setTimeout(() => {
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          }, 100);
        }}
        disabled={currentPage === totalPages}
        aria-label="次のページ"
      >
        <PaginationArrow direction="right" className="w-3 h-4" />
      </button>
    </div>
  );
}