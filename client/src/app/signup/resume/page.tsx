'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { uploadResumeFiles } from './actions';

// ファイルアップロード用の定数
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPE = 'application/pdf';

interface ResumeUploadFormData {
  resumeFile: File | null;
  careerSummaryFile: File | null;
  agreement: boolean;
}

export default function SignupResumePage() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const careerInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<ResumeUploadFormData>({
    resumeFile: null,
    careerSummaryFile: null,
    agreement: false,
  });

  // File validation function
  const validateFile = (file: File | null, fieldName: string): string | null => {
    if (!file) return null;
    
    if (file.size > MAX_FILE_SIZE) {
      return 'ファイルサイズは5MB以内にしてください';
    }
    if (file.type !== ACCEPTED_FILE_TYPE) {
      return 'PDFファイルのみアップロード可能です';
    }
    return null;
  };

  // ファイル選択処理
  const handleFileSelect = (type: 'resume' | 'career', file: File | null) => {
    console.log('File selected:', type, file?.name, file?.size);
    
    const errorKey = type === 'resume' ? 'resumeFile' : 'careerSummaryFile';
    const error = validateFile(file, errorKey);
    
    setErrors(prev => ({
      ...prev,
      [errorKey]: error || ''
    }));
    
    if (type === 'resume') {
      setFormData(prev => ({ ...prev, resumeFile: file }));
      console.log('Resume file set:', file?.name);
    } else {
      setFormData(prev => ({ ...prev, careerSummaryFile: file }));
      console.log('Career file set:', file?.name);
    }
  };

  // ファイル削除処理
  const handleFileRemove = (type: 'resume' | 'career') => {
    const errorKey = type === 'resume' ? 'resumeFile' : 'careerSummaryFile';
    
    setErrors(prev => ({
      ...prev,
      [errorKey]: ''
    }));
    
    if (type === 'resume') {
      setFormData(prev => ({ ...prev, resumeFile: null }));
      if (resumeInputRef.current) {
        resumeInputRef.current.value = '';
      }
    } else {
      setFormData(prev => ({ ...prev, careerSummaryFile: null }));
      if (careerInputRef.current) {
        careerInputRef.current.value = '';
      }
    }
  };

  // 「入力を続ける」ボタンクリック
  const handleContinueInput = () => {
    router.push('/signup/education');
  };

  // Form validation
  const validateForm = (): { isValid: boolean; errors: {[key: string]: string} } => {
    const newErrors: {[key: string]: string} = {};
    
    // If files are uploaded, agreement is required
    if ((formData.resumeFile || formData.careerSummaryFile)) {
      if (!formData.agreement) {
        newErrors.agreement = 'アップロードには同意が必要です';
      }
      
      // Validate files
      const resumeError = validateFile(formData.resumeFile, 'resumeFile');
      if (resumeError) newErrors.resumeFile = resumeError;
      
      const careerError = validateFile(formData.careerSummaryFile, 'careerSummaryFile');
      if (careerError) newErrors.careerSummaryFile = careerError;
    }
    
    return {
      isValid: Object.keys(newErrors).length === 0,
      errors: newErrors
    };
  };

  // 「アップした書類で登録する」ボタンクリック
  const handleUploadSubmit = async () => {
    if (!formData.resumeFile && !formData.careerSummaryFile) {
      setUploadError('少なくとも1つのファイルをアップロードしてください');
      return;
    }

    const validation = validateForm();
    setErrors(validation.errors);
    
    if (!validation.isValid) {
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const uploadFormData = new FormData();
      
      if (formData.resumeFile) {
        uploadFormData.append('resumeFile', formData.resumeFile);
      }
      
      if (formData.careerSummaryFile) {
        uploadFormData.append('careerSummaryFile', formData.careerSummaryFile);
      }
      
      uploadFormData.append('agreement', formData.agreement.toString());
      
      await uploadResumeFiles(uploadFormData);
      // 成功時はactions.tsでリダイレクトされる
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'アップロードに失敗しました');
    } finally {
      setIsUploading(false);
    }
  };

  // アップロードボタンが有効かどうか
  const isUploadButtonEnabled =
    (formData.resumeFile || formData.careerSummaryFile) && formData.agreement && !isUploading;

  return (
    <>
      {/* 条件レンダリング - PC Version */}
      <div className="hidden lg:block">
        <main
          className="hidden lg:flex relative py-20 flex-col items-center justify-start"
          style={{
            backgroundImage: "url('/background-pc.svg')",
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
        >
          {/* Container */}
          <div className="bg-white rounded-[40px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] p-20 w-[1000px] flex flex-col gap-10 items-center">
            {/* Title and Description */}
            <div className="flex flex-col gap-6 items-center w-full">
              <h1 className="text-[#0f9058] text-[32px] font-bold tracking-[3.2px] text-center">
                登録方法選択
              </h1>
              <div className="text-[#323232] text-[16px] leading-8 tracking-[1.6px] text-center font-bold">
                <p>登録方法をお選びください。</p>
                <p>
                  ご自身で情報を入力するか、履歴書・職務経歴書をアップロードして
                </p>
                <p>運営に入力をおまかせすることもできます（無料）。</p>
              </div>
            </div>

            {/* Manual Input Section */}
            <div className="relative flex flex-col items-center pb-5 w-full">
              <div className="bg-white px-6 relative z-10 mb-[-20px]">
                <h2 className="text-[#0f9058] text-[24px] font-bold tracking-[2.4px]">
                  自分で入力する
                </h2>
              </div>
              <div className="border-2 border-[#efefef] rounded-3xl pt-[60px] pb-10 px-10 w-full flex flex-col gap-10 items-center">
                <div className="bg-[#f9f9f9] p-6 rounded-3xl w-full">
                  <p className="text-[#323232] text-[16px] font-medium tracking-[1.6px] text-center leading-8">
                    書類を用意していない方や、自分で整理して入力したい方はこちら
                  </p>
                </div>
                <button
                  onClick={handleContinueInput}
                  className="px-10 py-[18px] bg-gradient-to-b from-[#229a4e] to-[#17856f] rounded-[32px] shadow-[0px_5px_10px_0px_rgba(0,0,0,0.15)] text-white text-[16px] font-bold tracking-[1.6px] min-w-[160px]"
                >
                  入力を続ける
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center justify-center w-full">
              <span className="text-[#323232] text-[18px] font-bold tracking-[1.8px]">
                もしくは
              </span>
            </div>

            {/* Resume Upload Section */}
            <div className="relative flex flex-col items-center pb-5 w-full">
              <div className="bg-white px-6 relative z-10 mb-[-20px]">
                <h2 className="text-[#0f9058] text-[24px] font-bold tracking-[2.4px]">
                  レジュメでかんたん登録
                </h2>
              </div>
              <div className="border-[3px] border-[#efefef] rounded-3xl pt-[60px] pb-10 px-10 w-full flex flex-col gap-10 items-center">
                <div className="bg-[#f9f9f9] p-6 rounded-3xl w-full flex flex-col gap-2.5 items-center">
                  <p className="text-[#323232] text-[16px] font-bold tracking-[1.6px] text-center leading-8">
                    アップロードいただいた書類をもとに運営が入力代行します。
                  </p>
                  <div className="text-[#323232] text-[14px] font-bold tracking-[1.4px] text-left w-fit">
                    <p>
                      【留意事項】
                      <br />
                      ●以下の情報が含まれる場合は削除したうえでアップロードしてください
                      <br />
                      ・マイナンバー・病歴などの登録に不要な機微情報
                      <br />
                      ・機密情報や社外秘の内容
                      <br />
                      ●運営では転記のみ行います。翻訳・添削・追記等は行いません。
                    </p>
                  </div>
                </div>

                {/* File Upload Fields */}
                <div className="flex flex-col gap-6 w-fit items-end">
                  {/* Resume Upload */}
                  <div className="flex flex-row gap-4 items-start w-full justify-end">
                    <div className="pt-[11px] text-right">
                      <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                        履歴書
                      </label>
                    </div>
                    <div className="flex flex-col gap-2 w-[400px]">
                      <input
                        ref={resumeInputRef}
                        type="file"
                        accept=".pdf"
                        onChange={(e) =>
                          handleFileSelect(
                            'resume',
                            e.target.files?.[0] || null,
                          )
                        }
                        className="hidden"
                        id="resume-upload-pc"
                      />
                      <label
                        htmlFor="resume-upload-pc"
                        className="w-[260px] px-10 py-[11px] bg-white border border-[#999999] rounded-[32px] text-[16px] text-[#323232] font-bold tracking-[1.6px] cursor-pointer text-center inline-block"
                      >
                        履歴書をアップロード
                      </label>
                      {formData.resumeFile && (
                        <div className="flex flex-wrap gap-2">
                          <div className="bg-[#d2f1da] px-6 py-[10px] rounded-[10px] flex items-center gap-2.5">
                            <span className="text-[#0f9058] text-[14px] font-medium tracking-[1.4px]">
                              {formData.resumeFile.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleFileRemove('resume')}
                              className="w-3 h-3"
                            >
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 12 12"
                                fill="none"
                              >
                                <path
                                  d="M1 1L11 11M1 11L11 1"
                                  stroke="#0f9058"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      )}
                      <p className="text-[#999999] text-[14px] font-medium tracking-[1.4px]">
                        ※5MB内のPDFのみアップロードが可能です。
                      </p>
                      {errors.resumeFile && (
                        <p className="text-red-500 text-[14px] font-medium">
                          {errors.resumeFile}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Career Summary Upload */}
                  <div className="flex flex-row gap-4 items-start justify-end">
                    <div className="pt-[11px] text-right">
                      <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                        職務経歴書
                      </label>
                    </div>
                    <div className="flex flex-col gap-2 w-[400px]">
                      <input
                        ref={careerInputRef}
                        type="file"
                        accept=".pdf"
                        onChange={(e) =>
                          handleFileSelect(
                            'career',
                            e.target.files?.[0] || null,
                          )
                        }
                        className="hidden"
                        id="career-upload-pc"
                      />
                      <label
                        htmlFor="career-upload-pc"
                        className="w-[300px] px-10 py-[11px] bg-white border border-[#999999] rounded-[32px] text-[16px] text-[#323232] font-bold tracking-[1.6px] cursor-pointer text-center inline-block"
                      >
                        職務経歴書をアップロード
                      </label>
                      {formData.careerSummaryFile && (
                        <div className="flex flex-wrap gap-2">
                          <div className="bg-[#d2f1da] px-6 py-[10px] rounded-[10px] flex items-center gap-2.5">
                            <span className="text-[#0f9058] text-[14px] font-medium tracking-[1.4px]">
                              {formData.careerSummaryFile.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleFileRemove('career')}
                              className="w-3 h-3"
                            >
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 12 12"
                                fill="none"
                              >
                                <path
                                  d="M1 1L11 11M1 11L11 1"
                                  stroke="#0f9058"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      )}
                      <p className="text-[#999999] text-[14px] font-medium tracking-[1.4px]">
                        ※5MB内のPDFのみアップロードが可能です。
                      </p>
                      {errors.careerSummaryFile && (
                        <p className="text-red-500 text-[14px] font-medium">
                          {errors.careerSummaryFile}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Agreement Checkbox */}
                <div className="flex flex-row gap-2 items-center w-fit">
                  <div
                    className="w-5 h-5 cursor-pointer"
                    onClick={() => setFormData(prev => ({ ...prev, agreement: !prev.agreement }))}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2.85714 0C1.28125 0 0 1.28125 0 2.85714V17.1429C0 18.7188 1.28125 20 2.85714 20H17.1429C18.7188 20 20 18.7188 20 17.1429V2.85714C20 1.28125 18.7188 0 17.1429 0H2.85714ZM15.0446 7.90179L9.33036 13.6161C8.91071 14.0357 8.23214 14.0357 7.81696 13.6161L4.95982 10.7589C4.54018 10.3393 4.54018 9.66071 4.95982 9.24554C5.37946 8.83036 6.05804 8.82589 6.47321 9.24554L8.57143 11.3438L13.5268 6.38393C13.9464 5.96429 14.625 5.96429 15.0402 6.38393C15.4554 6.80357 15.4598 7.48214 15.0402 7.89732L15.0446 7.90179Z"
                        fill={formData.agreement ? '#0F9058' : '#DCDCDC'}
                      />
                    </svg>
                  </div>
                  <label
                    className="text-[#323232] text-[14px] font-bold tracking-[1.4px] cursor-pointer"
                    onClick={() => setFormData(prev => ({ ...prev, agreement: !prev.agreement }))}
                  >
                    上記の留意事項を理解したうえで、職務経歴書・履歴書のアップロードに同意します。
                  </label>
                </div>
                {errors.agreement && (
                  <p className="text-red-500 text-[14px] font-medium text-center">
                    {errors.agreement}
                  </p>
                )}
                
                {uploadError && (
                  <p className="text-red-500 text-[14px] font-medium text-center">
                    {uploadError}
                  </p>
                )}

                {/* Submit Button */}
                <button
                  onClick={handleUploadSubmit}
                  disabled={!isUploadButtonEnabled}
                  className={`px-10 py-3.5 rounded-[32px] shadow-[0px_5px_10px_0px_rgba(0,0,0,0.15)] text-[16px] font-bold tracking-[1.6px] min-w-[160px] ${
                    isUploadButtonEnabled
                      ? 'bg-gradient-to-b from-[#229a4e] to-[#17856f] text-white'
                      : 'bg-[#dcdcdc] text-[#999999] cursor-not-allowed'
                  }`}
                >
                  {isUploading ? 'アップロード中...' : 'アップした書類で登録する'}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
      <div className="lg:hidden">
        /* SP (Mobile) Version */
        <main
          className="lg:hidden flex relative pt-6 pb-20 flex-col items-center px-4"
          style={{
            backgroundImage: "url('/background-sp.svg')",
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
        >
          {/* Container */}
          <div className="bg-white rounded-3xl shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] px-6 py-10 mx-4 w-full flex flex-col gap-10 items-center">
            {/* Title and Description */}
            <div className="flex flex-col gap-2 items-center w-full">
              <h1 className="text-[#0f9058] text-[24px] font-bold tracking-[2.4px] text-center">
                登録方法選択
              </h1>
              <div className="text-[#323232] text-[16px] leading-8 tracking-[1.6px] text-center font-bold">
                <p>登録方法をお選びください。</p>
                <p>ご自身で情報を入力するか、</p>
                <p>履歴書・職務経歴書をアップロードして</p>
                <p>運営に入力をおまかせすることもできます（無料）。</p>
              </div>
            </div>

            {/* Manual Input Section */}
            <div className="relative flex flex-col items-center pb-5 w-full">
              <div className="bg-white px-4 relative z-10 mb-[-20px]">
                <h2 className="text-[#0f9058] text-[20px] font-bold tracking-[2px]">
                  自分で入力する
                </h2>
              </div>
              <div className="border-2 border-[#efefef] rounded-[10px] pt-8 pb-6 px-6 w-full flex flex-col gap-10 items-center">
                <div className="bg-[#f9f9f9] p-6 rounded-[10px] w-full">
                  <div className="text-[#323232] text-[16px] font-medium tracking-[1.6px] text-center leading-8">
                    <p>書類を用意していない方や、</p>
                    <p>自分で整理して入力したい方はこちら</p>
                  </div>
                </div>
                <button
                  onClick={handleContinueInput}
                  className="w-full px-10 py-[18px] bg-gradient-to-b from-[#229a4e] to-[#17856f] rounded-[32px] shadow-[0px_5px_10px_0px_rgba(0,0,0,0.15)] text-white text-[16px] font-bold tracking-[1.6px]"
                >
                  入力を続ける
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center justify-center w-full">
              <span className="text-[#323232] text-[18px] font-bold tracking-[1.8px]">
                もしくは
              </span>
            </div>

            {/* Resume Upload Section */}
            <div className="relative flex flex-col items-center pb-5 w-full">
              <div className="bg-white px-4 relative z-10 mb-[-20px]">
                <h2 className="text-[#0f9058] text-[20px] font-bold tracking-[2px]">
                  レジュメでかんたん登録
                </h2>
              </div>
              <div className="border-[3px] border-[#efefef] rounded-[10px] pt-[60px] pb-6 px-6 w-full flex flex-col gap-10 items-center">
                <div className="bg-[#f9f9f9] p-6 rounded-[10px] w-full flex flex-col gap-2.5 items-center">
                  <p className="text-[#323232] text-[16px] font-bold tracking-[1.6px] text-center leading-8">
                    アップロードいただいた書類をもとに運営が入力代行します。
                  </p>
                  <div className="text-[#323232] text-[14px] font-bold tracking-[1.4px] text-left w-full">
                    <p>
                      【留意事項】
                      <br />
                      ●以下の情報が含まれる場合は削除したうえでアップロードしてください
                      <br />
                      ・マイナンバー
                      <br />
                      ・病歴などの登録に不要な機微情報
                      <br />
                      ・機密情報や社外秘の内容
                      <br />
                      ●運営では転記のみ行います。
                      <br />
                      翻訳・添削・追記等は行いません。
                    </p>
                  </div>
                </div>

                {/* File Upload Fields */}
                <div className="flex flex-col gap-6 w-full">
                  {/* Resume Upload */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                      履歴書
                    </label>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) =>
                        handleFileSelect('resume', e.target.files?.[0] || null)
                      }
                      className="hidden"
                      id="resume-upload-sp"
                    />
                    <label
                      htmlFor="resume-upload-sp"
                      className="w-full px-0 py-[11px] bg-white border border-[#999999] rounded-[32px] text-[16px] text-[#323232] font-bold tracking-[1.6px] cursor-pointer text-center block"
                    >
                      履歴書をアップロード
                    </label>
                    {formData.resumeFile && (
                      <div className="flex flex-wrap gap-2">
                        <div className="bg-[#d2f1da] px-6 py-[10px] rounded-[10px] flex items-center gap-2.5 flex-1 justify-center">
                          <span className="text-[#0f9058] text-[14px] font-medium tracking-[1.4px]">
                            {formData.resumeFile.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleFileRemove('resume')}
                            className="w-3 h-3 flex-shrink-0"
                          >
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 12 12"
                              fill="none"
                            >
                              <path
                                d="M1 1L11 11M1 11L11 1"
                                stroke="#0f9058"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                    <p className="text-[#999999] text-[14px] font-medium tracking-[1.4px]">
                      ※5MB内のPDFのみアップロードが可能です。
                    </p>
                    {errors.resumeFile && (
                      <p className="text-red-500 text-[14px] font-medium">
                        {errors.resumeFile}
                      </p>
                    )}
                  </div>

                  {/* Career Summary Upload */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                      職務経歴書
                    </label>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) =>
                        handleFileSelect('career', e.target.files?.[0] || null)
                      }
                      className="hidden"
                      id="career-upload-sp"
                    />
                    <label
                      htmlFor="career-upload-sp"
                      className="w-full px-0 py-[11px] bg-white border border-[#999999] rounded-[32px] text-[16px] text-[#323232] font-bold tracking-[1.6px] cursor-pointer text-center block"
                    >
                      職務経歴書をアップロード
                    </label>
                    {formData.careerSummaryFile && (
                      <div className="flex flex-wrap gap-2">
                        <div className="bg-[#d2f1da] px-6 py-[10px] rounded-[10px] flex items-center gap-2.5 flex-1 justify-center">
                          <span className="text-[#0f9058] text-[14px] font-medium tracking-[1.4px]">
                            {formData.careerSummaryFile.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleFileRemove('career')}
                            className="w-3 h-3 flex-shrink-0"
                          >
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 12 12"
                              fill="none"
                            >
                              <path
                                d="M1 1L11 11M1 11L11 1"
                                stroke="#0f9058"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                    <p className="text-[#999999] text-[14px] font-medium tracking-[1.4px]">
                      ※5MB内のPDFのみアップロードが可能です。
                    </p>
                    {errors.careerSummaryFile && (
                      <p className="text-red-500 text-[14px] font-medium">
                        {errors.careerSummaryFile}
                      </p>
                    )}
                  </div>
                </div>

                {/* Agreement Checkbox */}
                <div className="flex flex-row gap-2 items-center w-full">
                  <div
                    className="w-5 h-5 cursor-pointer flex-shrink-0"
                    onClick={() => setFormData(prev => ({ ...prev, agreement: !prev.agreement }))}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2.85714 0C1.28125 0 0 1.28125 0 2.85714V17.1429C0 18.7188 1.28125 20 2.85714 20H17.1429C18.7188 20 20 18.7188 20 17.1429V2.85714C20 1.28125 18.7188 0 17.1429 0H2.85714ZM15.0446 7.90179L9.33036 13.6161C8.91071 14.0357 8.23214 14.0357 7.81696 13.6161L4.95982 10.7589C4.54018 10.3393 4.54018 9.66071 4.95982 9.24554C5.37946 8.83036 6.05804 8.82589 6.47321 9.24554L8.57143 11.3438L13.5268 6.38393C13.9464 5.96429 14.625 5.96429 15.0402 6.38393C15.4554 6.80357 15.4598 7.48214 15.0402 7.89732L15.0446 7.90179Z"
                        fill={formData.agreement ? '#0F9058' : '#DCDCDC'}
                      />
                    </svg>
                  </div>
                  <label
                    className="text-[#323232] text-[14px] font-medium tracking-[1.4px] flex-1 cursor-pointer"
                    onClick={() => setFormData(prev => ({ ...prev, agreement: !prev.agreement }))}
                  >
                    上記の留意事項を理解したうえで、職務経歴書・履歴書のアップロードに同意します。
                  </label>
                </div>
                {errors.agreement && (
                  <p className="text-red-500 text-[14px] font-medium text-center">
                    {errors.agreement}
                  </p>
                )}
                
                {uploadError && (
                  <p className="text-red-500 text-[14px] font-medium text-center">
                    {uploadError}
                  </p>
                )}

                {/* Submit Button */}
                <button
                  onClick={handleUploadSubmit}
                  disabled={!isUploadButtonEnabled}
                  className={`w-full px-0 py-[18px] rounded-[32px] shadow-[0px_5px_10px_0px_rgba(0,0,0,0.15)] text-[16px] font-bold tracking-[1.6px] ${
                    isUploadButtonEnabled
                      ? 'bg-gradient-to-b from-[#229a4e] to-[#17856f] text-white'
                      : 'bg-[#dcdcdc] text-[#999999]'
                  }`}
                >
                  {isUploading ? 'アップロード中...' : 'アップした書類で登録する'}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
