
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

const industryCategories = [
    { name: '業種カテゴリテキスト', industries: ['業種名テキストが入ります', '業種名テキストが入ります', '業種名テキストが入ります', '業種名テキストが入ります', '業種名テキストが入ります', '業種名テキストが入ります', '業種名テキストが入ります', '業種名テキストが入ります', '業種名テキストが入ります', '業種名テキストが入ります', '業種名テキストが入ります', '業種名テキストが入ります', '業種名テキストが入ります', '業種名テキストが入ります', '業種名テキストが入ります'] },
    // 他の業種カテゴリがあればここに追加
];

const CustomCheckbox: React.FC<{ label: string; isChecked: boolean; onChange: () => void; }> = ({ label, isChecked, onChange }) => (
    <label className="flex items-center cursor-pointer text-sm text-gray-800">
        <input type="checkbox" className="hidden" checked={isChecked} onChange={onChange} />
        <div className={`w-5 h-5 flex items-center justify-center mr-3 rounded border flex-shrink-0 ${isChecked ? 'bg-white border-green-500' : 'bg-gray-100 border-gray-300'}`}>
            {isChecked && (
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 1L5 8L2 5" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            )}
        </div>
        <span className="text-sm text-gray-800">{label}</span>
    </label>
);

type IndustryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedIndustries: string[];
  setSelectedIndustries: (industries: string[]) => void;
};

const IndustryModal: React.FC<IndustryModalProps> = ({ isOpen, onClose, selectedIndustries, setSelectedIndustries }) => {
    const MAX_SELECTIONS = 3;

    if (!isOpen) {
        return null;
    }

    const handleCheckboxChange = (industry: string) => {
        const isSelected = selectedIndustries.includes(industry);
        if (isSelected) {
            setSelectedIndustries(selectedIndustries.filter((i) => i !== industry));
        } else if (selectedIndustries.length < MAX_SELECTIONS) {
            setSelectedIndustries([...selectedIndustries, industry]);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] shadow-lg flex flex-col">
                <div className="flex justify-between items-center p-6 border-b flex-shrink-0">
                    <h2 className="text-lg font-semibold">業種を選択</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    {industryCategories.map(cat => (
                        <div key={cat.name} className="mb-6">
                            <h3 className="font-semibold mb-4 text-gray-800">{cat.name}</h3>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                                {cat.industries.map((industry, index) => (
                                    <CustomCheckbox 
                                        key={index} 
                                        label={industry} 
                                        isChecked={selectedIndustries.includes(industry)} 
                                        onChange={() => handleCheckboxChange(industry)} 
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col items-center p-6 border-t flex-shrink-0">
                    <span className="text-sm text-gray-600 mb-4">{selectedIndustries.length}/{MAX_SELECTIONS} 選択中</span>
                    <Button 
                        onClick={onClose} 
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
                            border: 'none'
                        }}
                    >
                        決定
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default IndustryModal; 