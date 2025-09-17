'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { submitApplication } from './actions';
import { AlignJustify } from 'lucide-react';
import Image from 'next/image';
import { useCandidateAuth } from '@/hooks/useClientAuth';

interface CandidateApplicationClientProps {
  jobId: string;
  jobTitle: string;
  companyName: string;
  requiredDocuments: string[];
}

// useMediaQuery: メディアクエリ判定用カスタムフック
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

export default function CandidateApplicationClient({
  jobId,
  jobTitle,
  companyName,
  requiredDocuments,
}: CandidateApplicationClientProps) {
  const router = useRouter();
  const { isAuthenticated, candidateUser, loading } = useCandidateAuth();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resumeFiles, setResumeFiles] = useState<File[]>([]);
  const [careerFiles, setCareerFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');

  // form ref
  const formRef = useRef<HTMLFormElement>(null);

  // モバイル判定
  const isMobile = useMediaQuery('(max-width: 767px)');

  // 認証チェック
  React.useEffect(() => {
    if (loading) return;

    if (!isAuthenticated || !candidateUser) {
      router.push('/candidate/auth/login');
    }
  }, [isAuthenticated, candidateUser, loading, router]);

  // 必須書類チェック機能
  const isResumeRequired = requiredDocuments.includes('履歴書の提出が必須');
  const isCareerRequired = requiredDocuments.includes('職務経歴書の提出が必須');

  // 必須書類が揃っているかチェック
  const canSubmit = () => {
    if (isResumeRequired && resumeFiles.length === 0) return false;
    if (isCareerRequired && careerFiles.length === 0) return false;
    return true;
  };

  // ファイルバリデーション
  const validateFile = (file: File): { valid: boolean; error?: string } => {
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'ファイルサイズは5MB以下にしてください',
      };
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/gif',
      'text/plain',
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error:
          'PDF、Word、画像ファイル（JPEG/PNG/GIF）、テキストファイルのみアップロード可能です',
      };
    }

    return { valid: true };
  };

  // ファイルアップロード処理
  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      const validFiles: File[] = [];
      const invalidFiles: string[] = [];

      files.forEach(file => {
        const validation = validateFile(file);
        if (validation.valid) {
          validFiles.push(file);
        } else {
          invalidFiles.push(`${file.name}: ${validation.error}`);
        }
      });

      if (invalidFiles.length > 0) {
        setUploadError(`以下のファイルが無効です: ${invalidFiles.join(', ')}`);
      } else {
        setUploadError('');
      }

      if (validFiles.length > 0) {
        setResumeFiles(prev => [...prev, ...validFiles]);
      }

      event.target.value = '';
    }
  };

  const handleCareerUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      const validFiles: File[] = [];
      const invalidFiles: string[] = [];

      files.forEach(file => {
        const validation = validateFile(file);
        if (validation.valid) {
          validFiles.push(file);
        } else {
          invalidFiles.push(`${file.name}: ${validation.error}`);
        }
      });

      if (invalidFiles.length > 0) {
        setUploadError(`以下のファイルが無効です: ${invalidFiles.join(', ')}`);
      } else {
        setUploadError('');
      }

      if (validFiles.length > 0) {
        setCareerFiles(prev => [...prev, ...validFiles]);
      }

      event.target.value = '';
    }
  };

  // ファイル削除機能
  const handleRemoveResume = (index: number) => {
    setResumeFiles(prev => prev.filter((_, i) => i !== index));
    setUploadError('');
    const resumeInput = document.getElementById(
      'resume-upload'
    ) as HTMLInputElement;
    if (resumeInput) {
      resumeInput.value = '';
    }
  };

  const handleRemoveCareer = (index: number) => {
    setCareerFiles(prev => prev.filter((_, i) => i !== index));
    setUploadError('');
    const careerInput = document.getElementById(
      'career-upload'
    ) as HTMLInputElement;
    if (careerInput) {
      careerInput.value = '';
    }
  };

  // 応募処理
  const handleApplication = async () => {
    if (!candidateUser) {
      router.push('/candidate/auth/login');
      return;
    }

    // 必須書類チェック
    if (!canSubmit()) {
      const missingDocs = [];
      if (isResumeRequired && resumeFiles.length === 0)
        missingDocs.push('履歴書');
      if (isCareerRequired && careerFiles.length === 0)
        missingDocs.push('職務経歴書');
      setUploadError(`必須書類が不足しています: ${missingDocs.join('、')}`);
      return;
    }

    setIsUploading(true);
    setUploadError('');

    try {
      // FormDataを作成
      const formData = new FormData();
      formData.append('jobId', jobId);

      // ファイルを追加
      resumeFiles.forEach(file => {
        formData.append('resumeFiles', file);
      });

      careerFiles.forEach(file => {
        formData.append('careerFiles', file);
      });

      // サーバーアクションを呼び出し
      const result = await submitApplication(formData);

      if (!result.success) {
        // 認証が必要な場合はログインページにリダイレクト
        if (result.needsAuth) {
          router.push('/candidate/auth/login');
          return;
        }
        throw new Error(result.error || '応募の送信に失敗しました');
      }

      // 応募完了状態に変更
      setIsSubmitted(true);

      // 応募完了後、メッセージページにリダイレクト
      setTimeout(() => {
        router.push('/candidate/message');
      }, 2000); // 2秒後にリダイレクト
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : '応募の送信に失敗しました'
      );
    } finally {
      setIsUploading(false);
    }
  };

  // ファイル名を切り詰める関数
  const truncateFileName = (fileName: string, maxChars: number = 20) => {
    if (fileName.length <= maxChars) {
      return fileName;
    }
    return fileName.substring(0, maxChars) + '...';
  };

  // 認証されていない場合は何も表示しない（リダイレクト中）
  if (loading || !isAuthenticated || !candidateUser) {
    return null;
  }

  return (
    <div>
      {/* 見出しラッパー */}
      <div
        style={{
          maxHeight: 156,
          padding: isMobile ? '24px 16px 16px 16px' : '40px 80px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #17856F 0%, #229A4E 100%)',
        }}
      >
        {isSubmitted ? (
          <>
            <nav
              aria-label='パンくずリスト'
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                justifyContent: 'flex-start',
                width: '100%',
              }}
            >
              <span
                style={{
                  fontFamily: 'Noto Sans JP',
                  fontWeight: 700,
                  fontSize: isMobile ? 14 : 14,
                  lineHeight: 1.6,
                  letterSpacing: '0.1em',
                  color: '#fff',
                }}
              >
                求人詳細
              </span>
              <span
                style={{
                  color: '#fff',
                  fontSize: isMobile ? 14 : 16,
                  fontWeight: 700,
                }}
              >
                &gt;
              </span>
              <span
                style={{
                  fontFamily: 'Noto Sans JP',
                  fontWeight: 700,
                  fontSize: isMobile ? 14 : 16,
                  lineHeight: 1.6,
                  letterSpacing: '0.1em',
                  color: '#fff',
                }}
              >
                応募完了
              </span>
            </nav>
            <section
              aria-labelledby='complete-heading'
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 16,
                justifyContent: 'flex-start',
                alignSelf: 'stretch',
              }}
            >
              <Image
                src='/images/boad.svg'
                alt='ボードアイコン'
                width={isMobile ? 24 : 32}
                height={isMobile ? 24 : 32}
                style={{ display: 'block' }}
              />
              <h1
                id='complete-heading'
                style={{
                  fontFamily: 'Noto Sans JP',
                  fontWeight: 700,
                  fontSize: isMobile ? 20 : 24,
                  lineHeight: 1.6,
                  letterSpacing: '0.1em',
                  color: '#fff',
                  margin: 0,
                }}
              >
                応募完了
              </h1>
            </section>
          </>
        ) : (
          <>
            <nav
              aria-label='パンくずリスト'
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span
                style={{
                  fontFamily: 'Noto Sans JP',
                  fontWeight: 700,
                  fontSize: isMobile ? 14 : 14,
                  lineHeight: 1.6,
                  letterSpacing: '0.1em',
                  color: '#fff',
                }}
              >
                求人詳細
              </span>
              <svg
                width='8'
                height='8'
                viewBox='0 0 8 8'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                aria-hidden='true'
                focusable='false'
              >
                <path
                  d='M2 1L6 4L2 7'
                  stroke='#fff'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
              <span
                style={{
                  fontFamily: 'Noto Sans JP',
                  fontWeight: 700,
                  fontSize: isMobile ? 14 : 14,
                  lineHeight: 1.6,
                  letterSpacing: '0.1em',
                  color: '#fff',
                }}
              >
                履歴書・職務経歴書アップロード
              </span>
            </nav>
            <section
              aria-labelledby='upload-heading'
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '16px',
                alignSelf: 'stretch',
              }}
            >
              <Image
                src='/images/boad.svg'
                alt='ボードアイコン'
                width={isMobile ? 24 : 32}
                height={isMobile ? 24 : 32}
                style={{ display: 'block' }}
              />
              <h1
                id='upload-heading'
                style={{
                  fontFamily: 'Noto Sans JP',
                  fontWeight: 700,
                  fontSize: isMobile ? 20 : 24,
                  lineHeight: 1.6,
                  letterSpacing: '0.1em',
                  color: '#fff',
                  margin: 0,
                }}
              >
                履歴書・職務経歴書アップロード
              </h1>
            </section>
          </>
        )}
      </div>

      {/* コンテンツラッパー */}
      <div
        style={{
          padding: isMobile ? '24px 16px' : '40px 80px 80px 80px',
          boxSizing: 'border-box',
          background: '#f9f9f9',
        }}
      >
        <div
          style={
            isSubmitted
              ? {
                  background: '#fff',
                  borderRadius: 10,
                  padding: isMobile ? 24 : 80,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 40,
                  boxSizing: 'border-box',
                  width: 800,
                  maxWidth: '100%',
                  margin: '0 auto',
                  alignItems: 'center',
                  justifyContent: 'center',
                }
              : {
                  background: '#fff',
                  borderRadius: 10,
                  padding: isMobile ? 24 : 40,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  boxSizing: 'border-box',
                  height: '100%',
                  width: '100%',
                  justifyContent: 'flex-start',
                  alignItems: 'stretch',
                }
          }
        >
          {isSubmitted ? (
            // 応募完了UI
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 24,
                width: '100%',
                height: '100%',
                justifyContent: 'center',
              }}
            >
              <h2
                style={{
                  fontFamily: 'Noto Sans JP',
                  fontWeight: 700,
                  fontSize: isMobile ? 24 : 32,
                  lineHeight: 1.6,
                  letterSpacing: '0.1em',
                  color: '#0F9058',
                  margin: 0,
                  textAlign: 'center',
                }}
              >
                応募完了
              </h2>
              <div
                style={{
                  width: isMobile ? 160 : 240,
                  height: isMobile ? 160 : 240,
                  padding: isMobile ? '24px 0' : '51px 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                aria-label='応募完了イメージ'
              >
                <Image
                  src='/images/complete.svg'
                  alt='応募完了イメージ'
                  width={isMobile ? 160 : 240}
                  height={isMobile ? 160 : 240}
                  style={{ display: 'block', margin: '0 auto' }}
                />
              </div>
              <p
                style={{
                  fontFamily: 'Noto Sans JP',
                  fontWeight: 700,
                  fontSize: 16,
                  lineHeight: isMobile ? 1.8 : 2,
                  letterSpacing: '0.1em',
                  color: '#323232',
                  margin: 0,
                  textAlign: 'center',
                }}
              >
                求人への応募を完了しました。
                <br />
                企業からの返信をお待ちください。
              </p>
            </div>
          ) : (
            <>
              {/* 説明部分 */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'start',
                  gap: 24,
                  width: '100%',
                }}
              >
                <div>
                  <div>
                    <p
                      style={{
                        fontFamily: 'Noto Sans JP',
                        fontWeight: 700,
                        fontSize: 16,
                        lineHeight: 2,
                        letterSpacing: '0.1em',
                        color: '#323232',
                        margin: 0,
                        textAlign: 'left',
                        width: '100%',
                      }}
                    >
                      本求人に応募する場合は、「応募する」ボタンをクリックしてください。
                      <br />
                      書類の提出が必要な求人に関しては、書類をアップロードした上で応募しましょう。
                    </p>
                  </div>

                  {uploadError && (
                    <div
                      style={{
                        background: '#fee',
                        border: '1px solid #fcc',
                        borderRadius: '4px',
                        padding: '8px 12px',
                        marginTop: '8px',
                        color: '#c33',
                        fontSize: '14px',
                      }}
                    >
                      {uploadError}
                    </div>
                  )}
                </div>
              </div>

              {/* アップロード部分 */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  width: '100%',
                  marginTop: 24,
                }}
              >
                {/* 履歴書アップロード */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    gap: 10,
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      background: '#F9F9F9',
                      borderRadius: 5,
                      height: isMobile ? 'auto' : 176,
                      width: isMobile ? '100%' : 200,
                      padding: isMobile ? '8px 16px' : '0 24px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: isMobile ? 'flex-start' : 'center',
                      alignItems: 'flex-start',
                    }}
                  >
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                    >
                      <span
                        style={{
                          fontFamily: 'Noto Sans JP',
                          fontWeight: 700,
                          fontSize: 16,
                          lineHeight: 2,
                          letterSpacing: '0.1em',
                          color: '#323232',
                        }}
                      >
                        履歴書
                      </span>
                      {isResumeRequired && (
                        <span
                          style={{
                            fontFamily: 'Noto Sans JP',
                            fontWeight: 700,
                            fontSize: 12,
                            lineHeight: 1.5,
                            letterSpacing: '0.1em',
                            color: '#ff4444',
                            background: '#ffe6e6',
                            padding: '2px 6px',
                            borderRadius: '4px',
                          }}
                        >
                          必須
                        </span>
                      )}
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                      justifyContent: 'center',
                      flex: 1,
                      padding: isMobile ? 0 : '24px 0',
                    }}
                  >
                    <div
                      style={{ display: 'flex', flexDirection: 'row', gap: 16 }}
                    >
                      <input
                        type='file'
                        accept='.pdf'
                        multiple
                        onChange={handleResumeUpload}
                        style={{ display: 'none' }}
                        id='resume-upload'
                      />
                      <label
                        htmlFor='resume-upload'
                        className='h-[50px] px-[40px] rounded-[999px] font-bold tracking-[0.1em] border-[1px] border-[#999] text-[16px] text-[#323232] leading-[2] shadow-none cursor-pointer bg-transparent flex items-center justify-center'
                        style={{
                          width: isMobile ? '100%' : undefined,
                          fontFamily: 'Noto Sans JP',
                        }}
                      >
                        履歴書をアップロード
                      </label>
                    </div>
                    {resumeFiles.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className='bg-[#d2f1da] box-border content-stretch flex flex-row gap-2 items-center justify-between px-3 py-1 relative rounded-[5px] shrink-0 mt-2'
                        style={{
                          maxWidth: isMobile ? '140px' : '300px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <div className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#0f9058] flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                          {truncateFileName(file.name, isMobile ? 10 : 20)}
                        </div>
                        <button
                          onClick={() => handleRemoveResume(index)}
                          className='flex-shrink-0 ml-2 text-[#0f9058] hover:text-[#0d7a4e] transition-colors'
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            width: '14px',
                            height: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                          title='ファイルを削除'
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <span
                      style={{
                        fontFamily: 'Noto Sans JP',
                        fontWeight: 500,
                        fontSize: 14,
                        lineHeight: 1.6,
                        letterSpacing: '0.1em',
                        color: '#999',
                      }}
                    >
                      ※5MB内のPDFのみアップロードが可能です。
                    </span>
                  </div>
                </div>

                {/* 職務経歴書アップロード */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    gap: 10,
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      background: '#F9F9F9',
                      borderRadius: 5,
                      height: isMobile ? 'auto' : 176,
                      width: isMobile ? '100%' : 200,
                      padding: isMobile ? '8px 16px' : '0 24px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: isMobile ? 'flex-start' : 'center',
                      alignItems: 'flex-start',
                    }}
                  >
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                    >
                      <span
                        style={{
                          fontFamily: 'Noto Sans JP',
                          fontWeight: 700,
                          fontSize: 16,
                          lineHeight: 2,
                          letterSpacing: '0.1em',
                          color: '#323232',
                        }}
                      >
                        職務経歴書
                      </span>
                      {isCareerRequired && (
                        <span
                          style={{
                            fontFamily: 'Noto Sans JP',
                            fontWeight: 700,
                            fontSize: 12,
                            lineHeight: 1.5,
                            letterSpacing: '0.1em',
                            color: '#ff4444',
                            background: '#ffe6e6',
                            padding: '2px 6px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            borderRadius: '4px',
                          }}
                        >
                          必須
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                      justifyContent: 'center',
                      flex: 1,
                      padding: isMobile ? 0 : '24px 0',
                    }}
                  >
                    <div
                      style={{ display: 'flex', flexDirection: 'row', gap: 16 }}
                    >
                      <input
                        type='file'
                        accept='.pdf'
                        multiple
                        onChange={handleCareerUpload}
                        style={{ display: 'none' }}
                        id='career-upload'
                      />
                      <label
                        htmlFor='career-upload'
                        className='h-[50px] px-[40px] rounded-[999px] font-bold tracking-[0.1em] border-[1px] border-[#999] text-[16px] text-[#323232] leading-[2] shadow-none cursor-pointer bg-transparent flex items-center justify-center'
                        style={{
                          width: isMobile ? '100%' : undefined,
                          padding: '0 40px',
                          fontFamily: 'Noto Sans JP',
                          borderRadius: '999px',
                          border: '1px solid #999',
                          color: '#323232',
                          fontSize: '16px',
                          fontWeight: 700,
                          lineHeight: '2',
                          letterSpacing: '0.1em',
                          height: '50px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'transparent',
                          textAlign: 'center',
                        }}
                      >
                        職務経歴書をアップロード
                      </label>
                    </div>
                    {careerFiles.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className='bg-[#d2f1da] box-border content-stretch flex flex-row gap-2 items-center justify-between px-3 py-1 relative rounded-[5px] shrink-0 mt-2'
                        style={{
                          maxWidth: isMobile ? '140px' : '300px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <div className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#0f9058] flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                          {truncateFileName(file.name, isMobile ? 10 : 20)}
                        </div>
                        <button
                          onClick={() => handleRemoveCareer(index)}
                          className='flex-shrink-0 ml-2 text-[#0f9058] hover:text-[#0d7a4e] transition-colors'
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            width: '14px',
                            height: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                          title='ファイルを削除'
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <span
                      style={{
                        fontFamily: 'Noto Sans JP',
                        fontWeight: 500,
                        fontSize: 14,
                        lineHeight: 1.6,
                        letterSpacing: '0.1em',
                        color: '#999',
                      }}
                    >
                      ※5MB内のPDFのみアップロードが可能です。
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ボタン部分 */}
        <div>
          <div
            style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: 'center',
              gap: 16,
              margin: isMobile ? '24px 0 40px 0' : 40,
            }}
          >
            <Button
              style={{
                width: isMobile ? '100%' : 'auto',
                minWidth: isMobile ? 'auto' : '160px',
                height: 60,
                borderRadius: 32,
                border: '1px solid #0F9058',
                background: 'transparent',
                color: '#0F9058',
                fontFamily: 'Noto Sans JP',
                fontWeight: 700,
                fontSize: 16,
                lineHeight: '2em',
                letterSpacing: '0.1em',
                boxShadow: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 40px',
                transition: 'all 0.2s ease-in-out',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor =
                  'rgba(15, 144, 88, 0.1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              onClick={
                isSubmitted
                  ? () => router.push('/candidate/message')
                  : () => router.back()
              }
            >
              {isSubmitted ? 'メッセージ一覧' : '戻る'}
            </Button>
            <Button
              style={{
                width: isMobile ? '100%' : 'auto',
                minWidth: isMobile ? 'auto' : '160px',
                height: 60,
                borderRadius: 32,
                background: 'linear-gradient(180deg, #198D76 0%, #1CA74F 100%)',
                color: '#fff',
                fontFamily: 'Noto Sans JP',
                fontWeight: 700,
                fontSize: 16,
                lineHeight: '2em',
                letterSpacing: '0.1em',
                boxShadow: '0px 5px 10px 0px rgba(0,0,0,0.15)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 40px',
                transition: 'all 0.2s ease-in-out',
              }}
              onMouseEnter={e => {
                if (!isUploading && (isSubmitted || canSubmit())) {
                  e.currentTarget.style.background =
                    'linear-gradient(180deg, #12614E 0%, #1A8946 100%)';
                }
              }}
              onMouseLeave={e => {
                if (!isUploading && (isSubmitted || canSubmit())) {
                  e.currentTarget.style.background =
                    'linear-gradient(180deg, #198D76 0%, #1CA74F 100%)';
                }
              }}
              onClick={
                isSubmitted
                  ? () => router.push('/candidate/search/setting')
                  : handleApplication
              }
              disabled={isUploading || (!isSubmitted && !canSubmit())}
            >
              {isSubmitted
                ? '求人検索'
                : isUploading
                  ? '応募中...'
                  : '応募する'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
