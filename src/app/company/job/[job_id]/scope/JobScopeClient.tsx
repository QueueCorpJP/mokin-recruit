'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/mo-dal';
import { updateJob } from '../../actions';
import AttentionBanner from '@/components/ui/AttentionBanner';

interface JobData {
  id: string;
  title: string;
  jobDescription: string;
  positionSummary: string;
  requiredSkills: string;
  preferredSkills: string;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryNote: string;
  employmentType: string;
  workLocation: string[];
  locationNote: string;
  employmentTypeNote: string;
  workingHours: string;
  overtimeInfo: string;
  holidays: string;
  remoteWorkAvailable: boolean;
  jobType: string[];
  industry: string[];
  selectionProcess: string;
  appealPoints: string[];
  smokingPolicy: string;
  smokingPolicyNote: string;
  requiredDocuments: string[];
  internalMemo: string;
  publicationType: string;
  imageUrls: string[];
  groupName: string;
  groupId: string;
  status: string;
  applicationDeadline: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

interface JobScopeClientProps {
  jobData: JobData;
  jobId: string;
}

export default function JobScopeClient({ jobData, jobId }: JobScopeClientProps) {
  const router = useRouter();
  const [editData, setEditData] = useState<any>(null);
  const [publicationType, setPublicationType] = useState(jobData.publicationType || 'public');
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    // クライアントサイドでのみ実行
    if (typeof window === 'undefined' || !jobId) {
      return;
    }
    
    // sessionStorageから編集データを取得
    try {
      const savedEditData = sessionStorage.getItem(`editData-${jobId}`);
      if (savedEditData) {
        const parsedEditData = JSON.parse(savedEditData);
        setEditData(parsedEditData);
        // 編集データから公開設定を取得
        if (parsedEditData.publication_type) {
          setPublicationType(parsedEditData.publication_type);
        }
      } else {
        // データがない場合は編集画面に戻る
        router.push(`/company/job/${jobId}/edit`);
        return;
      }
    } catch (error) {
      console.error('Failed to load edit data:', error);
      router.push(`/company/job/${jobId}/edit`);
      return;
    }
    setLoading(false);
  }, [jobId, router]);

  const handlePublicationTypeChange = async () => {
    if (!editData) return;
    
    setIsLoading(true);
    try {
      // 編集データに公開設定を更新
      const updatedEditData = {
        ...editData,
        publication_type: publicationType
      };

      const result = await updateJob(jobId, updatedEditData);
      
      if (result.success) {
        // sessionStorageのデータをクリア
        sessionStorage.removeItem(`editData-${jobId}`);
        // 求人詳細ページに遷移
        router.push(`/company/job/${jobId}`);
      } else {
        setModalMessage(result.error || '更新に失敗しました');
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error updating job:', error);
      setModalMessage('更新に失敗しました');
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || !editData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>データを読み込んでいます...</div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#f9f9f9]">
        {/* ヘッダー部分 */}
        <div
          className="bg-gradient-to-t from-[#17856f] to-[#229a4e] px-20 py-10"
          style={{
            background: 'linear-gradient(to top, #17856f, #229a4e)',
          }}
        >
          <div className="w-full max-w-[1280px] mx-auto">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <Link href="/company/job" className="hover:underline">
                      <span
                        className="text-white text-[16px] font-medium tracking-[1.6px] cursor-pointer"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        求人一覧
                      </span>
                    </Link>
                    <svg 
                      width="6" 
                      height="8" 
                      viewBox="0 0 6 8" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      className="mx-1"
                    >
                      <path 
                        d="M5.11804 3.59656C5.34118 3.8197 5.34118 4.18208 5.11804 4.40522L1.69061 7.83264C1.46747 8.05579 1.10509 8.05579 0.881954 7.83264C0.658815 7.60951 0.658815 7.24713 0.881954 7.02399L3.90594 4L0.883739 0.976012C0.6606 0.752873 0.6606 0.390494 0.883739 0.167355C1.10688 -0.0557849 1.46926 -0.0557849 1.6924 0.167355L5.11982 3.59478L5.11804 3.59656Z" 
                        fill="white"
                      />
                    </svg>
                    <Link href={`/company/job/${jobId}`} className="hover:underline">
                      <span
                        className="text-white text-[16px] font-medium tracking-[1.6px] cursor-pointer"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        求人詳細
                      </span>
                    </Link>
                     <svg 
                      width="6" 
                      height="8" 
                      viewBox="0 0 6 8" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      className="mx-1"
                    >
                     <path 
                        d="M5.11804 3.59656C5.34118 3.8197 5.34118 4.18208 5.11804 4.40522L1.69061 7.83264C1.46747 8.05579 1.10509 8.05579 0.881954 7.83264C0.658815 7.60951 0.658815 7.24713 0.881954 7.02399L3.90594 4L0.883739 0.976012C0.6606 0.752873 0.6606 0.390494 0.883739 0.167355C1.10688 -0.0557849 1.46926 -0.0557849 1.6924 0.167355L5.11982 3.59478L5.11804 3.59656Z" 
                        fill="white"
                      />
                    </svg>
                    <span
                      className="text-white text-[16px] font-medium tracking-[1.6px]"
                      style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                    >
                      求人の公開設定変更
                    </span>
                  </div>
                  <h1
                    className="text-white text-[24px] font-bold tracking-[2.4px]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    求人の公開設定変更
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="px-20 pt-10 pb-20">
          <div className='w-full max-w-[1280px] mx-auto mb-10'>
            <AttentionBanner 
              title='求人の公開設定の変更についてのご注意'
              content='求人を非公開にすると、すでにスカウト済み・応募受付みの候補者も閲覧できなくなります。 選考中の求人に関しては「限定公開」への変更をご検討ください。'
            />
          </div>
          <div className="w-full max-w-[1280px] mx-auto">
            <div className="">
              {/* 公開範囲選択セクション */}
              <div className="w-full">
                <div className="border-2 border-[#0f9058] border-solid rounded-[10px] bg-white p-[40px]">
                  <div className="flex flex-col gap-6 items-start justify-start w-full">
                    {/* タイトル */}
                    <div className="font-['Noto_Sans_JP'] font-bold text-[20px] leading-[1.6] tracking-[2px] text-[#0f9058] w-full">
                      求人内容を確認の上、公開範囲を選択してください。
                    </div>

                    {/* 一般公開 */}
                    <div className="flex flex-row gap-6 items-center justify-start w-full">
                      <div className="flex flex-row gap-2 items-center justify-start w-[140px]">
                        <div className="relative w-5 h-5">
                          <input
                            type="radio"
                            name="publicationType"
                            value="public"
                            checked={publicationType === 'public'}
                            onChange={e => setPublicationType(e.target.value)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              publicationType === 'public'
                                ? 'border-[#0f9058]'
                                : 'border-[#dcdcdc]'
                            }`}
                          >
                            {publicationType === 'public' && (
                              <div className="w-3 h-3 rounded-full bg-[#0f9058]"></div>
                            )}
                          </div>
                        </div>
                        <label
                          htmlFor="public"
                          className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] cursor-pointer mx-[10px]"
                        >
                          一般公開
                        </label>
                      </div>
                      <div className="flex-1 font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                        すべての候補者（サービス未登録者含む）に求人票が公開され、求人検索からも閲覧可能になります。
                        <br />
                        より幅広い層からの応募を募りたい場合におすすめです。
                      </div>
                    </div>

                    {/* 登録会員限定 */}
                    <div className="flex flex-row gap-6 items-center justify-start w-full">
                      <div className="flex flex-row gap-2 items-center justify-start w-[140px]">
                        <div className="relative w-5 h-5">
                          <input
                            type="radio"
                            name="publicationType"
                            value="members"
                            checked={publicationType === 'members'}
                            onChange={e => setPublicationType(e.target.value)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              publicationType === 'members'
                                ? 'border-[#0f9058]'
                                : 'border-[#dcdcdc]'
                            }`}
                          >
                            {publicationType === 'members' && (
                              <div className="w-3 h-3 rounded-full bg-[#0f9058]"></div>
                            )}
                          </div>
                        </div>
                        <label
                          htmlFor="members"
                          className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] cursor-pointer"
                        >
                          登録会員限定
                        </label>
                      </div>
                      <div className="flex-1 font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                        サービスに登録している候補者にのみ求人票が表示され、会員向けの求人検索からも閲覧可能になります。
                        <br />
                        登録済みの信頼できるユーザーのみに求人を届けたい場合におすすめです。
                      </div>
                    </div>

                    {/* スカウト限定 */}
                    <div className="flex flex-row gap-6 items-center justify-start w-full">
                      <div className="flex flex-row gap-2 items-center justify-start w-[140px]">
                        <div className="relative w-5 h-5">
                          <input
                            type="radio"
                            name="publicationType"
                            value="scout"
                            checked={publicationType === 'scout'}
                            onChange={e => setPublicationType(e.target.value)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              publicationType === 'scout'
                                ? 'border-[#0f9058]'
                                : 'border-[#dcdcdc]'
                            }`}
                          >
                            {publicationType === 'scout' && (
                              <div className="w-3 h-3 rounded-full bg-[#0f9058]"></div>
                            )}
                          </div>
                        </div>
                        <label
                          htmlFor="scout"
                          className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] cursor-pointer"
                        >
                          スカウト限定
                        </label>
                      </div>
                      <div className="flex-1 font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                        貴社からのスカウトを受け取った候補者のみに求人票が表示されます。
                        <br />
                        特定のターゲット人材にのみ求人内容を見せたい場合におすすめです。
                      </div>
                    </div>

                    {/* 公開停止 */}
                    <div className="flex flex-row gap-6 items-center justify-start w-full">
                      <div className="flex flex-row gap-2 items-center justify-start w-[140px]">
                        <div className="relative w-5 h-5">
                          <input
                            type="radio"
                            name="publicationType"
                            value="stopped"
                            checked={publicationType === 'stopped'}
                            onChange={e => setPublicationType(e.target.value)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              publicationType === 'stopped'
                                ? 'border-[#0f9058]'
                                : 'border-[#dcdcdc]'
                            }`}
                          >
                            {publicationType === 'stopped' && (
                              <div className="w-3 h-3 rounded-full bg-[#0f9058]"></div>
                            )}
                          </div>
                        </div>
                        <label
                          htmlFor="stopped"
                          className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] cursor-pointer"
                        >
                          公開停止
                        </label>
                      </div>
                      <div className="flex-1 font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                        求人票がすべての候補者に対して非表示となり、求人検索やスカウト画面にも表示されなくなります。
                        <br />
                        募集を終了し、掲載を停止したい場合にご利用ください。
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ボタン */}
            <div className="flex justify-center mt-8">
              <Button
                variant="green-gradient"
                size="figma-default"
                onClick={handlePublicationTypeChange}
                disabled={isLoading}
                className="min-w-[200px]"
              >
                {isLoading ? '更新中...' : '公開設定を変更'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* エラーモーダル */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="エラー"
      >
        <div className="p-4">
          <p className="text-gray-700">{modalMessage}</p>
          <div className="mt-4 text-right">
            <Button
              variant="primary"
              onClick={() => setShowModal(false)}
            >
              閉じる
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}