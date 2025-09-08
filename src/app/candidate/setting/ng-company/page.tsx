'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/mo-dal';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { X } from 'lucide-react';
import { useServerCompanyAutocomplete } from '@/hooks/useServerCompanyAutocomplete';
import AutocompleteInput from '@/components/ui/AutocompleteInput';
import { addBlockedCompany, removeBlockedCompany, getBlockedCompanies } from './actions';
import Image from 'next/image';
import { useCandidateAuth } from '@/hooks/useClientAuth';

const closeIcon = "http://localhost:3845/assets/a0396fedb26c10cbda7f34a7019f04ee792845d6.svg";
const modalCloseIcon = "http://localhost:3845/assets/ca527250688df149a478765bdeb765225fed4f49.svg";
const tagCloseIcon = "http://localhost:3845/assets/20c8c5f9f2aa6159959eba646d0e3d86647e8627.svg";

interface BlockedCompany {
  name: string;
}

interface CompanyTagProps {
  company: BlockedCompany;
  onRemove: (name: string) => void;
}

interface AddBlockCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCompany: (companyName: string) => Promise<void>;
  existingCompanies: BlockedCompany[];
}

function AddBlockCompanyModal({ isOpen, onClose, onAddCompany, existingCompanies }: AddBlockCompanyModalProps) {
  const [companyName, setCompanyName] = useState('');
  const [selectedCompanies, setSelectedCompanies] = useState<BlockedCompany[]>([]);
  
  // Company autocomplete
  const { suggestions: companySuggestions, loading: companyLoading } = useServerCompanyAutocomplete(companyName);

  const handleAddToSelected = (companyNameToAdd: string) => {
    if (companyNameToAdd.trim() && !selectedCompanies.find(c => c.name === companyNameToAdd.trim())) {
      const newCompany: BlockedCompany = {
        name: companyNameToAdd.trim()
      };
      setSelectedCompanies(prev => [...prev, newCompany]);
      setCompanyName('');
    }
  };

  const handleRemoveFromSelected = (name: string) => {
    setSelectedCompanies(prev => prev.filter(company => company.name !== name));
  };

  const handleSave = async () => {
    try {
      for (const company of selectedCompanies) {
        await onAddCompany(company.name);
      }
      setSelectedCompanies([]);
      setCompanyName('');
      onClose();
    } catch (error) {
      console.error('企業の保存に失敗しました:', error);
    }
  };

  const handleCancel = () => {
    setSelectedCompanies([]);
    setCompanyName('');
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && companyName.trim()) {
      handleAddToSelected(companyName.trim());
    }
  };

  return (
    <Modal
      title="ブロック企業追加"
      isOpen={isOpen}
      onClose={handleCancel}
      primaryButtonText="保存する"
      onPrimaryAction={handleSave}
      secondaryButtonText="保存せず戻る"
      onSecondaryAction={handleCancel}
      width="680px"
      height="400px"
    >
      <div className="box-border content-stretch flex flex-col md:flex-row gap-4 items-start justify-center p-0 relative shrink-0 w-full">
        <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-start pb-0 pt-0 md:pt-[11px] px-0 relative shrink-0 w-full md:w-auto">
          <div className="font-['Noto_Sans_JP:Bold',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#323232] text-sm md:text-[16px] text-left text-nowrap tracking-[1.2px] md:tracking-[1.6px] font-bold">
            <p className="adjustLetterSpacing block leading-[2] whitespace-pre">企業名</p>
          </div>
        </div>
        <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-full md:w-[400px]">
          <div className="flex gap-2 items-center w-full">
            <div className="flex-1">
              <AutocompleteInput
                value={companyName}
                onChange={setCompanyName}
                placeholder="企業名を入力"
                suggestions={companySuggestions.map(c => ({ 
                  id: c.id, 
                  name: c.name, 
                  category: c.address || ''
                }))}
                loading={companyLoading}
                onSuggestionSelect={(suggestion) => {
                  handleAddToSelected(suggestion.name);
                }}
              />
            </div>
          </div>
          
          {/* 選択された企業のタグ */}
          {selectedCompanies.length > 0 && (
            <div className="box-border content-stretch flex flex-col gap-2 items-start justify-center p-0 relative shrink-0 w-full">
              {selectedCompanies.map((company) => (
                <div
                  key={company.name}
                  className="bg-[#d2f1da] flex items-center justify-between gap-2 px-4 py-2 rounded-[5px] w-full min-w-0"
                >
                  <span className="text-[#0f9058] text-[14px] font-medium leading-[1.6] tracking-[1.4px] truncate min-w-0 flex-1">
                    {company.name}
                  </span>
                  <button
                    onClick={() => handleRemoveFromSelected(company.name)}
                    className="ml-0.5 p-1 rounded hover:bg-[#b6e5c5] transition-colors flex-shrink-0"
                    aria-label="削除"
                  >
                    <X size={18} className="text-[#0f9058]" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

function CompanyTag({ company, onRemove }: CompanyTagProps) {
  return (
    <div className="bg-[#d2f1da] flex items-center justify-between gap-2 px-4 py-2 rounded-[5px] w-full min-w-0">
      <span className="text-[#0f9058] text-[14px] font-medium leading-[1.6] tracking-[1.4px] truncate min-w-0 flex-1">
        {company.name}
      </span>
      <button
        onClick={() => onRemove(company.name)}
        className="ml-0.5 p-1 rounded hover:bg-[#b6e5c5] transition-colors flex-shrink-0"
        aria-label={`${company.name}を削除`}
      >
        <X size={18} className="text-[#0f9058]" />
      </button>
    </div>
  );
}

export default function NgCompanyPage() {
  const { isAuthenticated, candidateUser, loading } = useCandidateAuth();
  const router = useRouter();
  const [blockedCompanies, setBlockedCompanies] = useState<BlockedCompany[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 認証チェック
  useEffect(() => {
    if (loading) return;
    
    if (!isAuthenticated || !candidateUser) {
      router.push('/candidate/auth/login');
    }
  }, [isAuthenticated, candidateUser, loading, router]);

  useEffect(() => {
    const fetchBlockedCompanies = async () => {
      try {
        const settings = await getBlockedCompanies();
        if (settings && settings.company_names) {
          const companies = settings.company_names.map(name => ({ name }));
          setBlockedCompanies(companies);
        }
      } catch (error) {
        console.error('設定の取得に失敗しました:', error);
      }
    };

    fetchBlockedCompanies();
  }, []);

  const handleRemoveCompany = async (companyName: string) => {
    try {
      await removeBlockedCompany(companyName);
      setBlockedCompanies(prev => prev.filter(company => company.name !== companyName));
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

  const handleAddCompany = async (companyName: string) => {
    try {
      await addBlockedCompany(companyName);
      const newCompany: BlockedCompany = {
        name: companyName
      };
      setBlockedCompanies(prev => [...prev, newCompany]);
    } catch (error) {
      console.error('企業の追加に失敗しました:', error);
      // エラーハンドリング
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !candidateUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <SettingsHeader
        breadcrumbs={[
          { label: '各種設定', href: '/candidate/setting' },
          { label: 'ブロック企業変更' }
        ]}
        title="ブロック企業変更"
        icon={<Image src="/images/setting.svg" alt="設定" width={32} height={32} />}
      />
      <div
        className="bg-[#f9f9f9] box-border content-stretch flex flex-col gap-10 items-center justify-start pb-20 pt-10 px-4 md:px-20 relative w-full"
      >
        <div
          className="bg-[#ffffff] box-border content-stretch flex flex-col gap-10 items-start justify-start md:p-[40px] p-[24px] relative rounded-[10px] shrink-0 w-full"
        >
          <div
            className="box-border content-stretch flex flex-col gap-6 items-center justify-start p-0 relative shrink-0 w-full"
          >
            <div
              className="font-['Noto_Sans_JP:Bold',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#323232] text-[16px] text-left tracking-[1.6px] font-bold w-full"
            >
              <p className="block leading-[2]">
              あなたの情報を公開したくない企業を設定することができます。
                <br aria-hidden="true" />
                現職や転職活動状況に登録した企業は自動で反映されますのでご安心ください。 </p>
            </div>
          </div>
          <div
            className="box-border content-stretch flex flex-col md:flex-row gap-4 items-start justify-start p-0 relative shrink-0 w-full"
          >
            <div
              className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-full max-w-[400px] md:w-[400px]"
            >
              <div
                className="box-border content-stretch flex flex-col gap-2 items-start justify-center p-0 relative shrink-0 w-full"
              >
                {blockedCompanies.length > 0 ? (
                  blockedCompanies.map((company) => (
                    <CompanyTag
                      key={company.name}
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
            className="min-w-40 w-full md:w-auto font-bold py-[17px]"
            onClick={handleBack}
          >
            戻る
          </Button>
          <Button
            variant="green-gradient"
            size="figma-square"
            className="min-w-40 rounded-full font-bold py-[17px] md:w-auto w-full"
            onClick={handleAddBlockCompany}
          >
            ブロック企業追加
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

export const dynamic = 'force-dynamic';
