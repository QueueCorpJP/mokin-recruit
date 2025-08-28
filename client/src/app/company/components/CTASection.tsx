'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useState } from 'react';

export function CTASection() {
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    department: '',
    email: '',
    inquiryType: '',
    content: '',
    agreeTerms: false,
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateField = (field: string, value: string | boolean) => {
    let error = '';
    
    switch (field) {
      case 'name':
        if (!String(value).trim()) error = 'お名前を入力してください';
        break;
      case 'companyName':
        if (!String(value).trim()) error = '貴社名を入力してください';
        break;
      case 'department':
        if (!String(value).trim()) error = '部署名・役職を入力してください';
        break;
      case 'email':
        if (!String(value).trim()) {
          error = 'メールアドレスを入力してください';
        } else if (!/\S+@\S+\.\S+/.test(String(value))) {
          error = 'メールアドレスの形式が正しくありません';
        }
        break;
      case 'inquiryType':
        if (!String(value)) error = 'お問い合わせ種別を選択してください';
        break;
      case 'content':
        if (!String(value).trim()) error = 'お問い合わせ内容を入力してください';
        break;
    }
    
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    validateField(field, value);
  };

  const isFormValid = () => {
    const hasNoErrors = Object.values(errors).every(error => !error);
    const hasAllRequiredFields = formData.name && formData.companyName && formData.department && 
                                formData.email && formData.inquiryType && formData.content && formData.agreeTerms;
    return hasNoErrors && hasAllRequiredFields;
  };
  const scrollToContactForm = () => {
    const element = document.getElementById('contact-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleButtonClick = (buttonText: string) => {
    if (buttonText.includes('面談予約')) {
      window.open('https://timerex.net/s/cuepoint/71614305', '_blank');
    } else {
      scrollToContactForm();
    }
  };

  const cards = [
    {
      title: '資料請求',
      description: [
        'サービス概要やどんな内容か知りたい',
        '他媒体との違いを知りたい',
        'どんな人材がいるのか知りたい'
      ],
      buttonText: '資料請求する',
      image: '/images/document.png' // 後で画像を追加
    },
    {
      title: 'サービス利用面談',
      description: [
        '利用イメージやどう活用できるのか相談',
        '現状の採用課題を相談する',
        'サービスを利用する為直接質問したい'
      ],
      buttonText: '面談予約する',
      image: '/images/contact.png' // 後で画像を追加
    }
  ];

  return (
    <section className='py-0 flex justify-center items-center relative overflow-visible'>
      <div className='relative w-full max-w-[1360px]'>
        {/* メインコンテナ - グラデーション背景 */}
        <div 
          className='md:py-[80px] md:px-[80px] py-[40px] px-[24px] flex flex-col items-center gap-10 relative overflow-hidden min-h-[700px] md:min-h-[500px]'
          style={{ background: 'linear-gradient(0deg, #17856F 0%, #229A4E 100%)' }}>
          {/* bar.png を絶対配置で下部に配置 - 固定サイズ、中央配置 */}
          <img 
            src="/bar.png" 
            alt="" 
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
            style={{ 
              width: '1360px',
              height: 'auto',
              maxWidth: 'none'
            }}
          />
          
          {/* カードコンテナ */}
          <div className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-8 w-full justify-center items-stretch">
            {cards.map((card, index) => (
              <div 
                key={index}
                className="bg-white rounded-[10px] p-[24px] md:p-[40px] flex flex-col gap-10 items-center justify-between w-full md:w-[350px] md:min-h-[600px] min-h-[400px] shadow-lg"
              >
                <div className='flex md:flex-col flex-row items-center justify-between w-full'>
                {/* タイトル */}
                <h3 className="font-bold text-[#0f9058] text-[24px] text-center tracking-[2.4px] leading-[1.6] font-[family-name:var(--font-noto-sans-jp)]">
                  {card.title}
                </h3>
                
                {/* 画像 */}
                <div className="w-[100px] md:w-full h-[100px] md:h-[auto] flex items-center justify-end">
                  <img 
                    src={card.image} 
                    alt={card.title}
                    className="w-[100px] md:w-full h-[67px] md:h-[auto] object-contain"
                  />
                </div>
                </div>
                {/* 説明テキスト */}
                <ul className="w-full space-y-2 flex-1">
                  {card.description.map((item, idx) => (
                    <li key={idx} className="font-bold text-[16px] text-[#262626] leading-[2] tracking-[1.6px] font-[family-name:var(--font-noto-sans-jp)]">
                      ・{item}
                    </li>
                  ))}
                </ul>
                
                {/* ボタン */}
                <Button 
                  variant="green-gradient"
                  size="figma-default"
                  className="min-w-[160px] mt-auto md:w-auto w-full text-center"
                  onClick={() => handleButtonClick(card.buttonText)}
                >
                  {card.buttonText}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* お問い合わせフォームセクション */}
      <div id="contact-form" className="w-full max-w-[800px] mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-8 text-[#0f9058]">お問い合わせフォーム</h2>
        
        <form className="space-y-6">
          {/* お名前 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              お名前 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="山田太郎"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0f9058] focus:border-transparent"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* 貴社名 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              貴社名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="株式会社ABC"
              value={formData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0f9058] focus:border-transparent"
            />
            {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
          </div>

          {/* 部署名・役職 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              部署名・役職 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="部署名・役職を入力"
              value={formData.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0f9058] focus:border-transparent"
            />
            {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
          </div>

          {/* メールアドレス */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              メールアドレス <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0f9058] focus:border-transparent"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* お問い合わせ種別 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              お問い合わせ種別 <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.inquiryType}
              onChange={(e) => handleInputChange('inquiryType', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0f9058] focus:border-transparent"
            >
              <option value="">未選択</option>
              <option value="資料請求をしたい">資料請求をしたい</option>
              <option value="導入を検討している">導入を検討している</option>
              <option value="料金・プランについて">料金・プランについて</option>
              <option value="機能・使い方について">機能・使い方について</option>
              <option value="契約・請求について">契約・請求について</option>
              <option value="その他">その他</option>
            </select>
            {errors.inquiryType && <p className="text-red-500 text-sm mt-1">{errors.inquiryType}</p>}
          </div>

          {/* お問い合わせ内容 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              お問い合わせ内容 <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="お問い合わせ内容を入力"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              rows={6}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0f9058] focus:border-transparent resize-vertical"
            />
            {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
          </div>

          {/* プライバシーポリシー同意 */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.agreeTerms}
                onChange={(e) => handleInputChange('agreeTerms', e.target.checked)}
                className="w-4 h-4 text-[#0f9058] border-gray-300 rounded focus:ring-[#0f9058]"
              />
              <span className="text-sm text-gray-700">
                プライバシーポリシーに同意します <span className="text-red-500">*</span>
              </span>
            </label>
          </div>

          {/* 送信ボタン */}
          <div className="text-center">
            <Button
              type="button"
              disabled={!isFormValid()}
              className={`px-8 py-3 rounded-md text-white font-medium ${
                isFormValid() 
                  ? 'bg-[#0f9058] hover:bg-[#0d7a4a] cursor-pointer' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              送信する
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}