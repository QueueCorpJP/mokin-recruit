import React from 'react';
import CompanyConfirmClient from './CompanyConfirmClient';

// URLパラメータやセッションストレージから企業データを取得する予定
// 現在はデバッグ用のダミーデータを使用
const dummyCompanyData = {
  companyId: '企業IDが入ります',
  plan: 'プラン名が入ります',
  companyName: '株式企業Company',
  companyUrl: 'タイトルテキストが入ります',
  website: 'https://---------',
  iconImage: null,
  representativePosition: '代表取締役',
  representativeName: '山田 太郎',
  establishedYear: '2020',
  capital: '100',
  capitalUnit: '万円',
  employeeCount: '500',
  industries: ['テキストが入ります。'],
  businessContent: 'テキストが入ります。\nテキストが入ります。\nテキストが入ります。',
  prefecture: '東京都',
  address: '千代田区〜〜〜〜〜〜',
  companyPhase: '上場企業',
  images: [],
  attractions: [
    {
      title: '企業の魅力テキストが入ります',
      description: '企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。'
    },
    {
      title: '企業の魅力テキストが入ります',
      description: '企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。'
    },
    {
      title: '企業の魅力テキストが入ります',
      description: '企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。'
    }
  ]
};

export default function CompanyNewConfirmPage() {
  return <CompanyConfirmClient companyData={dummyCompanyData} />;
}
