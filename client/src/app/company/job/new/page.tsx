'use client';

import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { InputField } from '@/components/ui/input-field';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
} from '@/components/ui/form';
import { ImageUpload } from '@/components/ui/ImageUpload';

// 型定義（必要に応じて拡張）
interface JobFormValues {
  title: string;
  images: File[]; // ←複数画像対応
  jobType: string;
  industry: string;
  positionSummary: string;
  jobDescription: string;
  jobAppeal: string;
  requiredSkills: string;
  otherRequirements: string;
  salaryMin: string;
  salaryMax: string;
  salaryNote: string;
  location: string;
  locationNote: string;
  employmentType: string;
  employmentTypeNote: string;
  workingHours: string;
  overtime: string;
  holidays: string;
  selectionProcess: string;
  appealPoints: string[];
  resumeRequired: string[];
  memo: string;
}

const defaultValues: JobFormValues = {
  title: '',
  images: [], // ←複数画像対応
  jobType: '',
  industry: '',
  positionSummary: '',
  jobDescription: '',
  jobAppeal: '',
  requiredSkills: '',
  otherRequirements: '',
  salaryMin: '',
  salaryMax: '',
  salaryNote: '',
  location: '',
  locationNote: '',
  employmentType: '',
  employmentTypeNote: '',
  workingHours: '',
  overtime: '',
  holidays: '',
  selectionProcess: '',
  appealPoints: [],
  resumeRequired: [],
  memo: '',
};

interface CompanyGroup {
  id: string;
  group_name: string;
}

export default function JobNewPage() {
  // 各項目の状態
  const [group, setGroup] = useState('');
  const [companyGroups, setCompanyGroups] = useState<CompanyGroup[]>([]);
  const [title, setTitle] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [jobTypes, setJobTypes] = useState<string[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [jobDescription, setJobDescription] = useState('');
  const [positionSummary, setPositionSummary] = useState('');
  const [skills, setSkills] = useState('');
  const [otherRequirements, setOtherRequirements] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [salaryNote, setSalaryNote] = useState('');
  const [locations, setLocations] = useState<string[]>([]);
  const [locationNote, setLocationNote] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [employmentTypeNote, setEmploymentTypeNote] = useState('');
  const [workingHours, setWorkingHours] = useState('');
  const [overtime, setOvertime] = useState('');
  const [remarks, setRemarks] = useState('');
  const [holidays, setHolidays] = useState('');
  const [selectionProcess, setSelectionProcess] = useState('');
  const [appealPoints, setAppealPoints] = useState<string[]>([]);
  const [smoke, setSmoke] = useState('');
  const [smokeNote, setSmokeNote] = useState('');
  const [resumeRequired, setResumeRequired] = useState<string[]>([]);
  const [memo, setMemo] = useState('');
  
  // バリデーション状態
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showErrors, setShowErrors] = useState(false);

  // 企業グループ情報を取得
  useEffect(() => {
    const fetchCompanyGroups = async () => {
      try {
        const token = localStorage.getItem('auth-token');
        const response = await fetch('/api/company/groups', {
          headers: {
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        });
        const result = await response.json();
        
        if (result.success) {
          setCompanyGroups(result.data);
          // ユーザーのグループが1つの場合は自動選択
          if (result.data.length === 1) {
            setGroup(result.data[0].id);
          }
        } else {
          console.error('Failed to fetch company groups:', result.error);
        }
      } catch (error) {
        console.error('Error fetching company groups:', error);
      }
    };

    fetchCompanyGroups();
  }, []);

  // 選択肢追加・削除の例（職種・業種・勤務地）
  const addJobType = (val: string) => setJobTypes([...jobTypes, val]);
  const removeJobType = (val: string) => setJobTypes(jobTypes.filter(v => v !== val));
  const addIndustry = (val: string) => setIndustries([...industries, val]);
  const removeIndustry = (val: string) => setIndustries(industries.filter(v => v !== val));
  const addLocation = (val: string) => setLocations([...locations, val]);
  const removeLocation = (val: string) => setLocations(locations.filter(v => v !== val));

  // チェックボックス（アピールポイント・レジュメ提出）
  const toggleAppealPoint = (val: string) => setAppealPoints(ap => ap.includes(val) ? ap.filter(v => v !== val) : ap.length < 6 ? [...ap, val] : ap);
  const toggleResumeRequired = (val: string) => setResumeRequired(rq => rq.includes(val) ? rq.filter(v => v !== val) : [...rq, val]);

  // バリデーション関数
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!group) newErrors.group = 'グループを選択してください';
    if (!title.trim()) newErrors.title = '求人タイトルを入力してください';
    if (!jobDescription.trim()) newErrors.jobDescription = '仕事内容を入力してください';
    if (!employmentType) newErrors.employmentType = '雇用形態を選択してください';
    if (locations.length === 0) newErrors.locations = '勤務地を選択してください';
    if (jobTypes.length === 0) newErrors.jobTypes = '職種を選択してください';
    if (industries.length === 0) newErrors.industries = '業種を選択してください';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 送信処理
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const data = {
      company_group_id: group,
      title: title || '未設定',
      job_type: jobTypes[0] || '未設定',
      industry: industries[0] || '未設定', 
      job_description: jobDescription || '未設定',
      required_skills: skills || '',
      preferred_skills: otherRequirements || '',
      salary_min: salaryMin ? parseInt(salaryMin) : null,
      salary_max: salaryMax ? parseInt(salaryMax) : null,
      employment_type: employmentType || '未設定',
      work_location: locations[0] || '未設定',
      remote_work_available: false,
      status: 'DRAFT',
      application_deadline: null,
      published_at: null
    };
    
    // 認証トークンを取得
    const token = localStorage.getItem('auth-token');
    
    console.log('Sending data to API:', data);
    
    try {
      const res = await fetch('/api/job/new', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      
      console.log('API Response:', result);
      console.log('Status Code:', res.status);
      
      if (result.success) {
        alert('求人が正常に作成されました！');
        // フォームリセット
        setGroup('');
        setTitle('');
        setImages([]);
        setJobTypes([]);
        setIndustries([]);
        setJobDescription('');
        setEmploymentType('');
        setLocations([]);
        setErrors({});
      } else {
        console.error('API Error:', result);
        alert(`エラー: ${result.error}`);
      }
    } catch (error) {
      console.error('Request Error:', error);
      alert('通信エラーが発生しました');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-700 to-green-500 py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-5xl space-y-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 space-y-8">
          {/* グループ */}
          <div className="flex flex-col gap-2">
            <label className="font-bold">グループ <span className="text-red-500">*</span></label>
            <select className={`border rounded px-3 py-2 w-60 ${showErrors && errors.group ? 'border-red-500 bg-red-50' : ''}`} value={group} onChange={e => setGroup(e.target.value)}>
              <option value="">未選択</option>
              {companyGroups.map(group => (
                <option key={group.id} value={group.id}>{group.group_name}</option>
              ))}
            </select>
            {showErrors && errors.group && <span className="text-red-500 text-sm">{errors.group}</span>}
          </div>
                  {/* 求人タイトル */}
          <div className="flex flex-col gap-2">
            <label className="font-bold">求人タイトル <span className="text-red-500">*</span></label>
            <input className={`border rounded px-3 py-2 ${showErrors && errors.title ? 'border-red-500 bg-red-50' : ''}`} placeholder="求人タイトルを入力" value={title} onChange={e => setTitle(e.target.value)} />
            {showErrors && errors.title && <span className="text-red-500 text-sm">{errors.title}</span>}
          </div>
          {/* イメージ画像 */}
          <div className="flex flex-col gap-2">
            <label className="font-bold">イメージ画像</label>
            <ImageUpload 
              images={images} 
              onChange={setImages}
              maxImages={5}
            />
          </div>
          {/* 職種 */}
          <div className="flex flex-col gap-2">
            <label className="font-bold">職種 <span className="text-red-500">*</span></label>
            <button type="button" className={`border rounded px-3 py-2 w-60 ${showErrors && errors.jobTypes ? 'border-red-500 bg-red-50' : ''}`} onClick={() => addJobType('新しい職種')}>職種を選択</button>
            <div className="flex gap-2 mt-2 flex-wrap">
              {jobTypes.map(type => (
                <span key={type} className="bg-green-100 text-green-800 rounded px-2 py-1 cursor-pointer" onClick={() => removeJobType(type)}>{type} ×</span>
              ))}
            </div>
            {showErrors && errors.jobTypes && <span className="text-red-500 text-sm">{errors.jobTypes}</span>}
          </div>
          {/* 業種 */}
          <div className="flex flex-col gap-2">
            <label className="font-bold">業種 <span className="text-red-500">*</span></label>
            <button type="button" className={`border rounded px-3 py-2 w-60 ${showErrors && errors.industries ? 'border-red-500 bg-red-50' : ''}`} onClick={() => addIndustry('新しい業種')}>業種を選択</button>
            <div className="flex gap-2 mt-2 flex-wrap">
              {industries.map(type => (
                <span key={type} className="bg-green-100 text-green-800 rounded px-2 py-1 cursor-pointer" onClick={() => removeIndustry(type)}>{type} ×</span>
              ))}
            </div>
            {showErrors && errors.industries && <span className="text-red-500 text-sm">{errors.industries}</span>}
          </div>
          {/* 業務内容 */}
          <div className="flex flex-col gap-2">
            <label className="font-bold">業務内容 <span className="text-red-500">*</span></label>
            <textarea className={`border rounded px-3 py-2 min-h-[100px] ${showErrors && errors.jobDescription ? 'border-red-500 bg-red-50' : ''}`} placeholder="具体的な業務内容・期待する役割/成果・募集背景などを入力してください。" value={jobDescription} onChange={e => setJobDescription(e.target.value)} />
            {showErrors && errors.jobDescription && <span className="text-red-500 text-sm">{errors.jobDescription}</span>}
                  </div>
                  {/* ポジション概要 */}
          <div className="flex flex-col gap-2">
            <label className="font-bold">ポジション概要</label>
            <textarea className="border rounded px-3 py-2 min-h-[100px]" placeholder="当ポジションの魅力を入力してください。" value={positionSummary} onChange={e => setPositionSummary(e.target.value)} />
          </div>
          {/* スキル・経験 */}
          <div className="flex flex-col gap-2">
            <label className="font-bold">スキル・経験</label>
            <textarea className="border rounded px-3 py-2 min-h-[80px]" placeholder="必要または歓迎するスキル・経験について入力してください。" value={skills} onChange={e => setSkills(e.target.value)} />
          </div>
          {/* その他・求める人物像など */}
          <div className="flex flex-col gap-2">
            <label className="font-bold">その他・求める人物像など</label>
            <textarea className="border rounded px-3 py-2 min-h-[80px]" placeholder="スキル以外に求める人物像や価値観などを入力してください。" value={otherRequirements} onChange={e => setOtherRequirements(e.target.value)} />
          </div>
          {/* 想定年収 */}
          <div className="flex flex-col gap-2">
            <label className="font-bold">想定年収</label>
            <div className="flex gap-2 items-center">
              <select className="border rounded px-3 py-2 w-32" value={salaryMin} onChange={e => setSalaryMin(e.target.value)}>
                <option value="">未選択</option>
              </select>
              <span>〜</span>
              <select className="border rounded px-3 py-2 w-32" value={salaryMax} onChange={e => setSalaryMax(e.target.value)}>
                <option value="">未選択</option>
              </select>
            </div>
            <input className="border rounded px-3 py-2 mt-2" placeholder="ストックオプションなどについてはこちらに入力してください。" value={salaryNote} onChange={e => setSalaryNote(e.target.value)} />
          </div>
          {/* 勤務地 */}
          <div className="flex flex-col gap-2">
            <label className="font-bold">勤務地 <span className="text-red-500">*</span></label>
            <button type="button" className={`border rounded px-3 py-2 w-60 ${showErrors && errors.locations ? 'border-red-500 bg-red-50' : ''}`} onClick={() => addLocation('新しい勤務地')}>勤務地を選択</button>
            <div className="flex gap-2 mt-2 flex-wrap">
              {locations.map(loc => (
                <span key={loc} className="bg-green-100 text-green-800 rounded px-2 py-1 cursor-pointer" onClick={() => removeLocation(loc)}>{loc} ×</span>
              ))}
            </div>
            {showErrors && errors.locations && <span className="text-red-500 text-sm">{errors.locations}</span>}
            <input className="border rounded px-3 py-2 mt-2" placeholder="転勤有無・リモート可否・手当の有無など、勤務地に関する補足情報を入力してください。" value={locationNote} onChange={e => setLocationNote(e.target.value)} />
                  </div>
          {/* 雇用形態 */}
          <div className="flex flex-col gap-2">
            <label className="font-bold">雇用形態 <span className="text-red-500">*</span></label>
            <select className={`border rounded px-3 py-2 w-60 ${showErrors && errors.employmentType ? 'border-red-500 bg-red-50' : ''}`} value={employmentType} onChange={e => setEmploymentType(e.target.value)}>
              <option value="">選択してください</option>
              <option value="正社員">正社員</option>
              <option value="契約社員">契約社員</option>
              <option value="アルバイト">アルバイト</option>
            </select>
            {showErrors && errors.employmentType && <span className="text-red-500 text-sm">{errors.employmentType}</span>}
            <input className="border rounded px-3 py-2 mt-2" placeholder="契約期間・試用期間など" value={employmentTypeNote} onChange={e => setEmploymentTypeNote(e.target.value)} />
                  </div>
          {/* 就業時間 */}
          <div className="flex flex-col gap-2">
            <label className="font-bold">就業時間</label>
            <textarea className="border rounded px-3 py-2 min-h-[80px]" placeholder="9:00～18:00（所定労働時間8時間）\n休憩：60分\nフレックス制：有" value={workingHours} onChange={e => setWorkingHours(e.target.value)} />
                    </div>
          {/* 所定外労働の有無 */}
          <div className="flex flex-col gap-2">
            <label className="font-bold">所定外労働の有無</label>
            <div className="flex gap-4 items-center">
              <label className="flex items-center gap-1"><input type="radio" name="overtime" value="あり" checked={overtime === 'あり'} onChange={e => setOvertime(e.target.value)} />あり</label>
              <label className="flex items-center gap-1"><input type="radio" name="overtime" value="なし" checked={overtime === 'なし'} onChange={e => setOvertime(e.target.value)} />なし</label>
                  </div>
                  </div>
          {/* 備考 */}
          <div className="flex flex-col gap-2">
            <label className="font-bold">備考</label>
            <textarea className="border rounded px-3 py-2 min-h-[60px]" placeholder="月平均20時間程度／固定残業代45時間分を含む" value={remarks} onChange={e => setRemarks(e.target.value)} />
                  </div>
          {/* 休日・休暇 */}
          <div className="flex flex-col gap-2">
            <label className="font-bold">休日・休暇</label>
            <textarea className="border rounded px-3 py-2 min-h-[60px]" placeholder="完全週休2日制（土・日）、祝日\n年間休日：120日\n有給休暇：初年度10日\nその他休暇：年末年始休暇" value={holidays} onChange={e => setHolidays(e.target.value)} />
                  </div>
                  {/* 選考情報 */}
          <div className="flex flex-col gap-2">
            <label className="font-bold">選考情報</label>
            <textarea className="border rounded px-3 py-2 min-h-[60px]" placeholder="選考フローや面接回数などの情報を入力してください。" value={selectionProcess} onChange={e => setSelectionProcess(e.target.value)} />
          </div>
          {/* アピールポイント */}
          <div className="flex flex-col gap-2">
            <label className="font-bold">アピールポイント <span className="text-xs text-gray-400">最大6つまで選択可能</span></label>
            <div className="flex flex-wrap gap-2">
              {[
                'CxO候補','新規事業立ち上げ','経営戦略に関与','裁量が大きい','スピード感がある','グローバル事業に関与','成長フェーズ','上場準備中','社会課題に貢献','少数精鋭','代表と距離が近い','20~30代中心','フラットな組織','多様な人材が活躍','フレックス制度','リモートあり','副業OK','残業少なめ','育児/介護と両立しやすい'
              ].map(val => (
                <label key={val} className="flex items-center gap-1">
                  <input type="checkbox" checked={appealPoints.includes(val)} onChange={() => toggleAppealPoint(val)} disabled={!appealPoints.includes(val) && appealPoints.length >= 6} />{val}
                </label>
              ))}
            </div>
          </div>
          {/* 受動喫煙防止措置 */}
          <div className="flex flex-col gap-2">
            <label className="font-bold">受動喫煙防止措置</label>
            <div className="flex gap-4 items-center flex-wrap">
              {['屋内禁煙','喫煙室設置','対策なし','その他'].map(val => (
                <label key={val} className="flex items-center gap-1">
                  <input type="radio" name="smoke" value={val} checked={smoke === val} onChange={e => setSmoke(e.target.value)} />{val}
                </label>
              ))}
            </div>
            <input className="border rounded px-3 py-2 mt-2" placeholder="就業場所が異なる、就業場所によって対策内容が異なる、対策内容を断言できないなどの場合は、「その他」を選択し、面談・面接時に候補者にお伝えください。" value={smokeNote} onChange={e => setSmokeNote(e.target.value)} />
          </div>
          {/* 応募時のレジュメ提出 */}
          <div className="flex flex-col gap-2">
            <label className="font-bold">応募時のレジュメ提出</label>
            {['履歴書の提出が必須','職務経歴書の提出が必須'].map(val => (
              <label key={val} className="flex items-center gap-1">
                <input type="checkbox" checked={resumeRequired.includes(val)} onChange={() => toggleResumeRequired(val)} />{val}
              </label>
            ))}
            <div className="text-xs text-gray-400">応募後に別途提出を依頼することも可能です。</div>
          </div>
                  {/* 社内メモ */}
          <div className="flex flex-col gap-2">
            <label className="font-bold">社内メモ</label>
            <textarea className="border rounded px-3 py-2 min-h-[60px]" placeholder="この求人に関して、社内で共有しておきたい事項などがあれば、こちらを活用してください。" value={memo} onChange={e => setMemo(e.target.value)} />
            <div className="text-xs text-gray-400">社内メモは候補者に共有されません。</div>
                </div>
                {/* ボタンエリア */}
          <div className="flex justify-end gap-4 mt-8">
            <Button type="button" variant="green-outline">下書き保存</Button>
            <Button type="submit" variant="green-gradient">確認する</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
