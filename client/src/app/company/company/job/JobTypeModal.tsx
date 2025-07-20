
import React, { useState } from 'react';
import { jobCategories } from './types';
import { Checkbox } from '@/components/ui/checkbox';

interface JobTypeModalProps {
  selectedJobTypes: string[];
  setSelectedJobTypes: (jobTypes: string[]) => void;
}

export const JobTypeModal: React.FC<JobTypeModalProps> = ({ selectedJobTypes, setSelectedJobTypes }) => {
  const [selectedCategory, setSelectedCategory] = useState(jobCategories[0].name);

  const handleCheckboxChange = (job: string) => {
    setSelectedJobTypes(
      selectedJobTypes.includes(job)
        ? selectedJobTypes.filter((j) => j !== job)
        : [...selectedJobTypes, job]
    );
  };

  const selectedCategoryData = jobCategories.find((category) => category.name === selectedCategory)!;

  return (
    <div className="space-y-6">
      {/* 全カテゴリータグ（複数行対応・境界線共有デザイン） */}
      <div className="mb-4">
        <div className="flex flex-wrap items-center">
          {jobCategories.map((category, index) => (
            <React.Fragment key={category.name}>
              <button
                className={`py-2 px-2 transition-colors ${
                  selectedCategory === category.name
                    ? 'text-[#0F9058] font-medium'
                    : 'text-[var(--3,#999)] hover:text-[#0F9058]'
                }`}
                style={{
                  fontFamily: '"Noto Sans JP"',
                  fontSize: '14px',
                  fontWeight: selectedCategory === category.name ? 600 : 500,
                  lineHeight: '160%',
                  letterSpacing: '1.4px',
                }}
                onClick={() => setSelectedCategory(category.name)}
              >
                {category.name}
              </button>
              {index < jobCategories.length - 1 && (
                <div className="mx-2">
                  <svg 
                    width="2" 
                    height="24" 
                    viewBox="0 0 2 24" 
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      d="M1 1V23" 
                      stroke="var(--3,#999)" 
                      strokeLinecap="round"
                      strokeWidth="1"
                    />
                  </svg>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 選択中のカテゴリー名 */}
      <div>
        <h3 className="font-['Noto_Sans_JP'] font-bold text-[20px] leading-[1.6] tracking-[0.05em] text-[#323232] border-b-2 border-[#E5E7EB] pb-3">
          {selectedCategoryData.name}
        </h3>
        
        {/* 職種チェックボックスリスト（2列グリッド） */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-4  mt-6">
          {selectedCategoryData.jobs.map((job) => (
            <div key={job} className="flex items-center">
              <Checkbox 
                label={job} 
                checked={selectedJobTypes.includes(job)} 
                onChange={() => handleCheckboxChange(job)} 
              />
            </div>
          ))}
        </div>

        {/* 選択数表示（左下） */}
        {/* 削除：この部分は共通モーダルコンポーネントに移動 */}
      </div>
    </div>
  );
}; 