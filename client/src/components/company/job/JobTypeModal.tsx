
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

type JobCategory = {
  name: string;
  jobs: string[];
};

const jobCategories: JobCategory[] = [
    { name: 'コンサルタント', jobs: ['戦略コンサルタント', 'ITコンサルタント', '組織人事コンサルタント', 'M&Aコンサルタント', '業務改善コンサルタント', 'リスクコンサルタント', 'SCMコンサルタント', '会計コンサルタント'] },
    { name: 'ITコンサルタント', jobs: ['ITストラテジスト', 'システムコンサルタント', 'ERPコンサルタント'] },
    { name: '経営', jobs: ['CEO', 'COO', 'CFO', 'プロダクトマネジャー', '新規事業開発'] },
    { name: 'プロジェクト管理', jobs: ['PM', 'PjM', 'PMO'] },
    { name: '専門職', jobs: ['弁護士', '公認会計士', '税理士'] },
    { name: '管理', jobs: ['経理', '財務', '人事'] },
    { name: '人事', jobs: ['採用', '労務', '制度企画'] },
    { name: 'マーケティング', jobs: ['マーケティングリサーチ', 'プロダクトマーケティング', 'ブランドマーケティング'] },
    { name: 'デジタルマーケティング', jobs: ['SEO/SEM', 'SNSマーケティング', 'Webアナリスト'] },
    { name: '広告', jobs: ['アカウントプランナー', 'メディアプランナー', 'クリエイティブディレクター'] },
    { name: '営業', jobs: ['法人営業', '個人営業', 'インサイドセールス'] },
    { name: '金融', jobs: ['M&A', 'PE', 'VC'] },
    { name: 'サービス', jobs: ['カスタマーサクセス', 'カスタマーサポート'] },
    { name: 'Webサービス・制作', jobs: ['Webディレクター', 'Webプロデューサー'] },
    { name: 'IT技術職', jobs: ['フロントエンドエンジニア', 'バックエンドエンジニア', 'フルスタックエンジニア', 'SRE'] },
    { name: 'デザイン', jobs: ['UIデザイナー', 'UXデザイナー', 'グラフィックデザイナー'] },
    { name: '不動産', jobs: ['アセットマネジメント', 'プロパティマネジメント'] },
    { name: '建築・土木', jobs: ['設計', '施工管理'] },
    { name: '施工管理', jobs: ['建築施工管理', '土木施工管理'] },
    { name: '医療営業', jobs: ['MR', '医療機器営業'] },
    { name: '学術・PMS・薬事', jobs: ['学術', 'PMS', '薬事'] },
    { name: '医療・看護・薬剤', jobs: ['医師', '看護師', '薬剤師'] },
    { name: '生産管理・品質管理', jobs: ['生産管理', '品質管理'] },
    { name: '品質保証', jobs: ['品質保証'] },
    { name: '研究・臨床開発・治験', jobs: ['研究', '臨床開発', '治験'] },
    { name: '化学', jobs: ['化学研究', '化学プラント'] },
    { name: '素材', jobs: ['素材開発', '素材研究'] },
    { name: '食品', jobs: ['商品開発', '品質管理'] },
    { name: '化粧品', jobs: ['商品企画', '研究開発'] },
    { name: '日用品', jobs: ['プロダクトマネージャー', 'マーケティング'] },
    { name: '電気・電子', jobs: ['回路設計', '半導体設計'] },
    { name: '機械', jobs: ['機械設計', '生産技術'] },
    { name: '半導体', jobs: ['プロセスエンジニア', 'デバイスエンジニア'] },
    { name: 'ゲーム', jobs: ['ゲームプログラマー', 'ゲームプランナー'] },
    { name: 'テレビ・放送・映像・音響', jobs: ['プロデューサー', 'ディレクター'] },
    { name: '新聞・出版', jobs: ['編集者', '記者'] },
];

const CustomCheckbox: React.FC<{ label: string; isChecked: boolean; onChange: () => void; disabled?: boolean; }> = ({ label, isChecked, onChange, disabled = false }) => (
    <div className={`flex items-start gap-2 ${disabled ? 'cursor-default' : 'cursor-pointer'}`} onClick={disabled ? undefined : onChange}>
        <div className="pt-1">
            <div className={`w-5 h-5 rounded border flex items-center justify-center ${isChecked ? 'bg-[#0F9058] border-[#0F9058]' : 'bg-[#DCDCDC] border-[#DCDCDC]'}`}>
                {isChecked && (
                    <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                        <path d="M10.5 1.5L4.5 7.5L1.5 4.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                )}
            </div>
        </div>
        <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
            {label}
        </div>
    </div>
);

type JobTypeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedJobTypes: string[];
  setSelectedJobTypes: (jobTypes: string[]) => void;
};

const JobTypeModal: React.FC<JobTypeModalProps> = ({ isOpen, onClose, selectedJobTypes, setSelectedJobTypes }) => {
    const MAX_SELECTIONS = 3;
    const [selectedCategory, setSelectedCategory] = useState(jobCategories[0].name);
    const [isConfirmMode, setIsConfirmMode] = useState(false);

    if (!isOpen) {
        return null;
    }

    const handleCheckboxChange = (job: string) => {
        if (isConfirmMode) return;
        
        const isSelected = selectedJobTypes.includes(job);
        if (isSelected) {
            setSelectedJobTypes(selectedJobTypes.filter((j) => j !== job));
        } else if (selectedJobTypes.length < MAX_SELECTIONS) {
            setSelectedJobTypes([...selectedJobTypes, job]);
        }
    };

    const handleConfirm = () => {
        setIsConfirmMode(true);
    };

    const handleBack = () => {
        setIsConfirmMode(false);
    };

    const handleFinalConfirm = () => {
        setIsConfirmMode(false);
        onClose();
    };

    const selectedCategoryData = jobCategories.find(cat => cat.name === selectedCategory) || jobCategories[0];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[10px] w-[800px] max-h-[90vh] shadow-lg flex flex-col overflow-hidden">
                {/* ヘッダー */}
                <div className="bg-white flex items-center justify-between px-10 py-6 border-b border-[#EFEFEF]">
                    <h2 className="font-['Noto_Sans_JP'] font-bold text-[24px] leading-[1.6] tracking-[2.4px] text-[#323232]">
                        {isConfirmMode ? '選択内容の確認' : '職種を選択'}
                    </h2>
                    <button onClick={onClose} className="text-[#999999] hover:text-[#323232]">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M0.415039 0.413086C0.966397 -0.138036 1.85985 -0.138158 2.41113 0.413086L12.001 10.0029L21.5898 0.414063C22.1412 -0.137098 23.0346 -0.137176 23.5859 0.414063C24.1373 0.96542 24.1373 1.85978 23.5859 2.41113L13.9971 11.999L23.5879 21.5898L23.6377 21.6426C24.1381 22.1967 24.1217 23.0519 23.5879 23.5859C23.0538 24.1201 22.1978 24.1365 21.6436 23.6357L21.5908 23.5859L12.001 13.9961L2.41016 23.5869L2.35742 23.6377C1.80321 24.1384 0.947178 24.121 0.413086 23.5869C-0.120675 23.0528 -0.137244 22.1977 0.363281 21.6436L0.413086 21.5908L10.0039 11.999L0.415039 2.41016C-0.136312 1.8588 -0.136312 0.964437 0.415039 0.413086Z" fill="currentColor"/>
                        </svg>
                    </button>
                </div>

                {/* コンテンツエリア */}
                <div className="flex flex-1 overflow-hidden">
                    {/* メインコンテンツ */}
                    <div className="flex-1 bg-[#F9F9F9] p-10 overflow-y-auto">
                        {isConfirmMode ? (
                            /* 確認モード */
                            <div className="space-y-6">
                                <div className="border-b border-[#DCDCDC] pb-2">
                                    <h3 className="font-['Noto_Sans_JP'] font-bold text-[20px] leading-[1.6] tracking-[2px] text-[#323232]">
                                        選択した職種
                                    </h3>
                                </div>
                                
                                <div className="flex flex-wrap gap-6">
                                    {selectedJobTypes.map((job) => (
                                        <div key={job} className="flex-shrink-0">
                                            <CustomCheckbox 
                                                label={job} 
                                                isChecked={true} 
                                                onChange={() => {}} 
                                                disabled={true}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            /* 選択モード */
                            <>
                                {/* カテゴリータブ */}
                                <div className="flex flex-wrap gap-2 mb-10">
                                    {jobCategories.map((category) => (
                                        <button
                                            key={category.name}
                                            onClick={() => setSelectedCategory(category.name)}
                                            className={`font-['Noto_Sans_JP'] font-bold text-[14px] leading-[1.6] tracking-[1.4px] px-2 py-1 whitespace-nowrap ${
                                                selectedCategory === category.name 
                                                    ? 'text-[#0F9058]' 
                                                    : 'text-[#999999]'
                                            }`}
                                        >
                                            {category.name}
                                        </button>
                                    ))}
                                </div>

                                {/* 職種セクション */}
                                <div className="space-y-6">
                                    <div className="border-b border-[#DCDCDC] pb-2">
                                        <h3 className="font-['Noto_Sans_JP'] font-bold text-[20px] leading-[1.6] tracking-[2px] text-[#323232]">
                                            {selectedCategoryData.name}
                                        </h3>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-6">
                                        {selectedCategoryData.jobs.map((job) => (
                                            <div key={job} className="flex-shrink-0">
                                                <CustomCheckbox 
                                                    label={job} 
                                                    isChecked={selectedJobTypes.includes(job)} 
                                                    onChange={() => handleCheckboxChange(job)} 
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* スクロールバー */}
                    <div className="bg-white w-4 py-2 flex justify-center">
                        <div className="bg-[#DCDCDC] w-3 h-20 rounded-xl"></div>
                    </div>
                </div>

                {/* フッター */}
                <div className="bg-white border-t border-[#EFEFEF] px-10 py-6 flex items-center justify-between">
                    <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                        {selectedJobTypes.length}/{MAX_SELECTIONS} 選択中
                    </div>
                    <div className="flex gap-4">
                        {isConfirmMode ? (
                            <>
                                <Button 
                                    onClick={handleBack}
                                    style={{
                                        borderRadius: '32px',
                                        background: '#FFFFFF',
                                        border: '1px solid #DCDCDC',
                                        display: 'flex',
                                        minWidth: '160px',
                                        padding: '10px 40px',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        gap: '10px',
                                        color: '#323232',
                                        fontWeight: 'bold',
                                        fontSize: '16px',
                                        lineHeight: '2',
                                        letterSpacing: '1.6px',
                                        fontFamily: 'Noto Sans JP'
                                    }}
                                >
                                    戻る
                                </Button>
                                <Button 
                                    onClick={handleFinalConfirm}
                                    style={{
                                        borderRadius: '32px',
                                        background: 'linear-gradient(83deg, #198D76 0%, #1CA74F 100%)',
                                        boxShadow: '0px 5px 10px 0px rgba(0, 0, 0, 0.15)',
                                        display: 'flex',
                                        minWidth: '160px',
                                        padding: '10px 40px',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        gap: '10px',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        border: 'none',
                                        fontSize: '16px',
                                        lineHeight: '2',
                                        letterSpacing: '1.6px',
                                        fontFamily: 'Noto Sans JP'
                                    }}
                                >
                                    決定
                                </Button>
                            </>
                        ) : (
                            <Button 
                                onClick={handleConfirm}
                                disabled={selectedJobTypes.length === 0}
                                style={{
                                    borderRadius: '32px',
                                    background: selectedJobTypes.length === 0 ? '#DCDCDC' : 'linear-gradient(83deg, #198D76 0%, #1CA74F 100%)',
                                    boxShadow: selectedJobTypes.length === 0 ? 'none' : '0px 5px 10px 0px rgba(0, 0, 0, 0.15)',
                                    display: 'flex',
                                    minWidth: '160px',
                                    padding: '10px 40px',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '10px',
                                    color: selectedJobTypes.length === 0 ? '#999999' : 'white',
                                    fontWeight: 'bold',
                                    border: 'none',
                                    fontSize: '16px',
                                    lineHeight: '2',
                                    letterSpacing: '1.6px',
                                    fontFamily: 'Noto Sans JP'
                                }}
                            >
                                確認する
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobTypeModal; 