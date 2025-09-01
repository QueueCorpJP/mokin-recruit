'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { CandidateData } from '@/components/company/CandidateCard';

export default function SearchClientDebug() {
  const searchParams = useSearchParams();
  const [candidates, setCandidates] = useState<CandidateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        console.log('SearchParams:', searchParams.toString());
        
        const supabase = createClient();
        
        // 簡単なクエリでデータベース接続をテスト
        const { data: testData, error: testError } = await supabase
          .from('candidates')
          .select('id, last_name, first_name')
          .limit(5);
          
        console.log('Test query result:', { testData, testError });
        
        if (testError) {
          setError(`Database error: ${testError.message}`);
          setDebugInfo({ testError });
          return;
        }

        // SearchClientと同じ複雑なクエリをテスト
        const { data: complexData, error: complexError } = await supabase
          .from('candidates')
          .select(`
            id,
            last_name,
            first_name,
            current_company,
            current_position,
            prefecture,
            birth_date,
            gender,
            current_income,
            recent_job_company_name,
            recent_job_department_position,
            has_career_change,
            education!left(
              final_education,
              school_name,
              department,
              graduation_year,
              graduation_month
            ),
            skills!left(
              english_level,
              qualifications,
              skills_list
            ),
            work_experience!left(
              industry_id,
              industry_name,
              experience_years
            ),
            job_type_experience!left(
              job_type_id,
              job_type_name,
              experience_years
            )
          `)
          .limit(5);
          
        console.log('Complex query result:', { complexData, complexError });
        
        if (complexError) {
          setError(`Complex query error: ${complexError.message}`);
          setDebugInfo({ testError, complexError });
          return;
        }

        // 元の内部結合クエリもテスト（比較用）
        const { data: innerData, error: innerError } = await supabase
          .from('candidates')
          .select(`
            id,
            last_name,
            first_name,
            education(final_education)
          `)
          .limit(5);
          
        console.log('Inner join query result:', { innerData, innerError });
        
        // モックデータを表示（とりあえず）
        const mockCandidates: CandidateData[] = [
          {
            id: '1',
            isPickup: false,
            isHidden: false,
            isAttention: true,
            badgeType: 'change',
            badgeText: 'キャリアチェンジ志向',
            lastLogin: '1時間前',
            companyName: 'テスト企業',
            department: 'エンジニアリング部',
            position: 'データサイエンティスト',
            location: '東京都',
            age: '28歳',
            gender: '男性',
            salary: '800万円',
            university: '東京大学',
            degree: '修士',
            language: '英語',
            languageLevel: 'ビジネス',
            experienceJobs: ['データサイエンティスト', '機械学習エンジニア'],
            experienceIndustries: ['IT', 'AI'],
            careerHistory: [
              {
                period: '2020/04〜現在',
                company: 'テスト企業',
                role: 'データサイエンティスト',
              }
            ],
            selectionCompanies: []
          }
        ];
        
        // データベースのテストデータをCandidateData形式にマップ
        const realCandidates: CandidateData[] = (complexData || []).map((candidate: any): CandidateData => ({
          id: candidate.id,
          isPickup: false,
          isHidden: false,
          isAttention: Math.random() > 0.5,
          badgeType: candidate.has_career_change ? 'change' : 'professional',
          badgeText: candidate.has_career_change ? 'キャリアチェンジ志向' : '専門性追求志向',
          lastLogin: '1時間前',
          companyName: candidate.recent_job_company_name || candidate.current_company || '企業名未設定',
          department: candidate.recent_job_department_position || '部署名未設定',
          position: candidate.current_position || '役職名未設定',
          location: candidate.prefecture || '未設定',
          age: candidate.birth_date ? `${new Date().getFullYear() - new Date(candidate.birth_date).getFullYear()}歳` : '年齢未設定',
          gender: candidate.gender === 'male' ? '男性' : candidate.gender === 'female' ? '女性' : '未設定',
          salary: candidate.current_income ? `${candidate.current_income}万円` : '年収未設定',
          university: candidate.education?.school_name || '学校名未設定',
          degree: candidate.education?.final_education || '学歴未設定',
          language: candidate.skills?.english_level !== 'none' ? '英語' : '言語スキルなし',
          languageLevel: candidate.skills?.english_level || 'なし',
          experienceJobs: candidate.job_type_experience?.map((exp: any) => exp.job_type_name) || ['職種未設定'],
          experienceIndustries: candidate.work_experience?.map((exp: any) => exp.industry_name) || ['業界未設定'],
          careerHistory: [],
          selectionCompanies: []
        }));

        setCandidates(realCandidates.length > 0 ? realCandidates : mockCandidates);
        setDebugInfo({ 
          searchParams: searchParams.toString(),
          testDataCount: testData?.length || 0,
          complexDataCount: complexData?.length || 0,
          innerDataCount: innerData?.length || 0,
          candidatesSet: mockCandidates.length,
          testSample: testData?.[0] || null,
          complexSample: complexData?.[0] || null,
          innerSample: innerData?.[0] || null
        });
        
      } catch (err) {
        console.error('Load error:', err);
        setError(`Load error: ${err}`);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">データを読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <h2 className="text-2xl font-bold">SearchClient Debug</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          エラー: {error}
        </div>
      )}
      
      <div className="bg-blue-50 p-4 rounded">
        <h3 className="font-bold mb-2">デバッグ情報:</h3>
        <pre className="text-sm">{JSON.stringify(debugInfo, null, 2)}</pre>
      </div>
      
      <div className="bg-green-50 p-4 rounded">
        <h3 className="font-bold mb-2">候補者数: {candidates.length}</h3>
        {candidates.map((candidate, index) => (
          <div key={candidate.id} className="bg-white p-4 rounded shadow mb-2">
            <p><strong>名前:</strong> {candidate.companyName}</p>
            <p><strong>職種:</strong> {candidate.experienceJobs.join(', ')}</p>
            <p><strong>場所:</strong> {candidate.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
}