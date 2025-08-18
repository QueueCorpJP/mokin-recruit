'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const closeIcon = "http://localhost:3845/assets/a0396fedb26c10cbda7f34a7019f04ee792845d6.svg";
const modalCloseIcon = "http://localhost:3845/assets/ca527250688df149a478765bdeb765225fed4f49.svg";
const tagCloseIcon = "http://localhost:3845/assets/20c8c5f9f2aa6159959eba646d0e3d86647e8627.svg";

interface BlockedCompany {
  id: string;
  name: string;
}

interface CompanyTagProps {
  company: BlockedCompany;
  onRemove: (id: string) => void;
}

interface AddBlockCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCompany: (companyName: string) => void;
  existingCompanies: BlockedCompany[];
}

function AddBlockCompanyModal({ isOpen, onClose, onAddCompany, existingCompanies }: AddBlockCompanyModalProps) {
  const [companyName, setCompanyName] = useState('');
  const [selectedCompanies, setSelectedCompanies] = useState<BlockedCompany[]>([]);

  const handleAddToSelected = () => {
    if (companyName.trim() && !selectedCompanies.find(c => c.name === companyName.trim())) {
      const newCompany: BlockedCompany = {
        id: Date.now().toString(),
        name: companyName.trim()
      };
      setSelectedCompanies(prev => [...prev, newCompany]);
      setCompanyName('');
    }
  };

  const handleRemoveFromSelected = (id: string) => {
    setSelectedCompanies(prev => prev.filter(company => company.id !== id));
  };

  const handleSave = () => {
    selectedCompanies.forEach(company => {
      onAddCompany(company.name);
    });
    setSelectedCompanies([]);
    setCompanyName('');
  };

  const handleCancel = () => {
    setSelectedCompanies([]);
    setCompanyName('');
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddToSelected();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="box-border content-stretch flex flex-col items-center justify-center overflow-clip p-0 relative rounded-[10px] bg-white max-w-[680px] w-full mx-4">
        {/* ヘッダー */}
        <div className="bg-[#ffffff] box-border content-stretch flex flex-row gap-6 items-center justify-start px-10 py-6 relative shrink-0 w-full border-b border-[#efefef]">
          <div className="basis-0 font-['Noto_Sans_JP:Bold',_sans-serif] grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#323232] text-[24px] text-left tracking-[2.4px]">
            <p className="block leading-[1.6]">ブロック企業追加</p>
          </div>
          <button 
            onClick={handleCancel}
            className="box-border content-stretch flex flex-row gap-2.5 items-center justify-center p-0 relative shrink-0 size-6 cursor-pointer"
          >
            <div className="aspect-[135.994/135.999] basis-0 grow min-h-px min-w-px relative shrink-0">
              <img alt="" className="block max-w-none size-full" src={modalCloseIcon} />
            </div>
          </button>
        </div>

        {/* フォーム */}
        <div className="box-border content-stretch flex flex-col gap-6 items-center justify-center min-h-60 px-10 py-10 relative shrink-0 w-full">
          <div className="box-border content-stretch flex flex-row gap-4 items-start justify-start p-0 relative shrink-0 w-full">
            <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-center pb-0 pt-[11px] px-0 relative shrink-0">
              <div className="font-['Noto_Sans_JP:Bold',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#323232] text-[16px] text-left text-nowrap tracking-[1.6px] font-medium">
                <p className="adjustLetterSpacing block leading-[2] whitespace-pre">企業名</p>
              </div>
            </div>
            <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-[400px]">
              <div className="bg-[#ffffff] box-border content-stretch flex flex-row gap-2.5 items-center justify-start p-[11px] relative rounded-[5px] shrink-0 w-full border border-[#999999]">
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="企業名を入力"
                  className="basis-0 font-['Noto_Sans_JP:Medium',_sans-serif] grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#323232] text-[16px] text-left tracking-[1.6px] font-medium bg-transparent border-none outline-none placeholder:text-[#999999]"
                />
                {companyName.trim() && (
                  <button
                    onClick={handleAddToSelected}
                    className="px-3 py-1 bg-[#0f9058] text-white rounded text-sm font-medium hover:bg-[#0d7a4a] transition-colors"
                  >
                    追加
                  </button>
                )}
              </div>
              
              {/* 選択された企業のタグ */}
              {selectedCompanies.length > 0 && (
                <div className="box-border content-stretch flex flex-col gap-2 items-start justify-center p-0 relative shrink-0 w-full">
                  {selectedCompanies.map((company) => (
                    <div
                      key={company.id}
                      className="bg-[#d2f1da] box-border content-stretch flex flex-row h-10 items-center justify-between px-6 py-0 relative rounded-[10px] shrink-0 w-full"
                    >
                      <div className="font-['Noto_Sans_JP:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#0f9058] text-[14px] text-center text-nowrap tracking-[1.4px]">
                        <p className="adjustLetterSpacing block leading-[1.6] whitespace-pre">{company.name}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveFromSelected(company.id)}
                        className="box-border content-stretch flex flex-row gap-2.5 items-center justify-center p-0 relative shrink-0 size-3 cursor-pointer"
                      >
                        <div className="aspect-[135.994/135.999] basis-0 grow min-h-px min-w-px relative shrink-0">
                          <img alt="" className="block max-w-none size-full" src={tagCloseIcon} />
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* フッター */}
        <div className="bg-[#ffffff] box-border content-stretch flex flex-row gap-10 h-[104px] items-center justify-center px-10 py-6 relative shrink-0 w-full border-t border-[#efefef]">
          <div className="box-border content-stretch flex flex-row gap-4 items-center justify-start p-0 relative shrink-0">
            <Button
              variant="green-outline"
              size="figma-outline"
              className="min-w-40"
              onClick={handleCancel}
            >
              保存せず戻る
            </Button>
            <Button
              variant="green-gradient"
              size="figma-square"
              className="min-w-40"
              onClick={handleSave}
              disabled={selectedCompanies.length === 0}
            >
              保存する
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CompanyTag({ company, onRemove }: CompanyTagProps) {
  return (
    <div className="bg-[#d2f1da] box-border content-stretch flex flex-row h-10 items-center justify-between px-6 py-0 relative rounded-[10px] shrink-0 w-full">
      <div className="font-['Noto_Sans_JP:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#0f9058] text-[14px] text-center text-nowrap tracking-[1.4px]">
        <p className="adjustLetterSpacing block leading-[1.6] whitespace-pre">{company.name}</p>
      </div>
      <button
        onClick={() => onRemove(company.id)}
        className="box-border content-stretch flex flex-row gap-2.5 items-center justify-center p-0 relative shrink-0 size-3 cursor-pointer"
        aria-label={`${company.name}を削除`}
      >
        <div className="aspect-[135.994/135.999] basis-0 grow min-h-px min-w-px relative shrink-0">
          <img alt="" className="block max-w-none size-full" src={closeIcon} />
        </div>
      </button>
    </div>
  );
}

export default function NgCompanyPage() {
  const router = useRouter();
  const [blockedCompanies, setBlockedCompanies] = useState<BlockedCompany[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // 実際はサーバーAPIから現在の設定を取得
    const fetchBlockedCompanies = async () => {
      try {
        // const response = await fetch('/api/candidate/blocked-companies');
        // const data = await response.json();
        // setBlockedCompanies(data);
        
        // デモ用のデータ
        setBlockedCompanies([
          { id: '1', name: '企業名テキスト' },
          { id: '2', name: '企業名テキスト' },
          { id: '3', name: '企業名テキスト' }
        ]);
      } catch (error) {
        console.error('設定の取得に失敗しました:', error);
      }
    };

    fetchBlockedCompanies();
  }, []);

  const handleRemoveCompany = async (companyId: string) => {
    try {
      // 実際はサーバーAPIを呼び出してブロック企業を削除
      // const response = await fetch(`/api/candidate/blocked-companies/${companyId}`, {
      //   method: 'DELETE',
      // });
      
      // if (!response.ok) {
      //   throw new Error('企業の削除に失敗しました');
      // }

      // 削除処理
      setBlockedCompanies(prev => prev.filter(company => company.id !== companyId));
    } catch (error) {
      console.error('企業の削除に失敗しました:', error);
      // エラーハンドリング
    }
  };

  const handleBack = () => {
    router.push('/candidate/setting');
  };

  const handleAddBlockCompany = () => {
    setIsModalOpen(true);
  };

  const handleAddCompany = (companyName: string) => {
    // 新規企業をリストに追加
    const newCompany: BlockedCompany = {
      id: Date.now().toString(),
      name: companyName
    };
    setBlockedCompanies(prev => [...prev, newCompany]);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <div
        className="bg-[#f9f9f9] box-border content-stretch flex flex-col gap-10 items-center justify-start pb-20 pt-10 px-4 md:px-20 relative w-full"
      >
        <div
          className="bg-[#ffffff] box-border content-stretch flex flex-col gap-10 items-start justify-start p-[40px] relative rounded-[10px] shrink-0 w-full max-w-4xl"
        >
          <div
            className="box-border content-stretch flex flex-col gap-6 items-center justify-start p-0 relative shrink-0 w-full"
          >
            <div
              className="font-['Noto_Sans_JP:Bold',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#323232] text-[16px] text-left tracking-[1.6px] font-medium w-full"
            >
              <p className="block leading-[2]">
                希望しない会社からスカウトを受け取らないよう設定できます。
                <br aria-hidden="true" />
                設定した企業からのスカウトは受信トレイに表示されません。
              </p>
            </div>
          </div>
          <div
            className="box-border content-stretch flex flex-row gap-4 items-start justify-start p-0 relative shrink-0 w-full"
          >
            <div
              className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-[400px]"
            >
              <div
                className="box-border content-stretch flex flex-col gap-2 items-start justify-center p-0 relative shrink-0 w-full"
              >
                {blockedCompanies.length > 0 ? (
                  blockedCompanies.map((company) => (
                    <CompanyTag
                      key={company.id}
                      company={company}
                      onRemove={handleRemoveCompany}
                    />
                  ))
                ) : (
                  <div className="font-['Noto_Sans_JP:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#666666] text-[14px] text-center tracking-[1.4px] w-full py-8">
                    <p className="adjustLetterSpacing block leading-[1.6] whitespace-pre">
                      設定企業はありません
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div
          className="[flex-flow:wrap] box-border content-start flex gap-4 items-start justify-center p-0 relative shrink-0"
        >
          <Button
            variant="green-outline"
            size="figma-outline"
            className="min-w-40 w-[202px]"
            onClick={handleBack}
          >
            戻る
          </Button>
          <Button
            variant="green-gradient"
            size="figma-square"
            className="min-w-40"
            onClick={handleAddBlockCompany}
          >
            設定企業追加
          </Button>
        </div>
      </div>

      {/* ブロック企業追加モーダル */}
      {isModalOpen && (
        <AddBlockCompanyModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddCompany={handleAddCompany}
          existingCompanies={blockedCompanies}
        />
      )}
    </div>
  );
}