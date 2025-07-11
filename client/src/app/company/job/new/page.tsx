'use client';

import React from 'react';
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

// 型定義（必要に応じて拡張）
interface JobFormValues {
  title: string;
  image: File | null;
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
  image: null,
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

export default function JobNewPage() {
  const methods = useForm<JobFormValues>({ defaultValues });
  const { handleSubmit, formState } = methods;

  const onSubmit = (data: JobFormValues) => {
    // TODO: サーバー送信処理
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-green-700 to-green-500 py-10 px-4 flex flex-col items-center'>
      <div className='w-full max-w-5xl space-y-8'>
        <Card>
          <CardHeader>
            <CardTitle className='text-2xl font-bold'>新規求人作成</CardTitle>
          </CardHeader>
          <CardContent>
            <FormProvider {...methods}>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <div className='space-y-8'>
                  {/* 求人タイトル */}
                  <FormField
                    name='title'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>求人タイトル</FormLabel>
                        <FormControl>
                          <InputField
                            {...field}
                            required
                            layout='vertical'
                            placeholder='求人タイトルを入力'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* イメージ画像（仮実装） */}
                  <FormField
                    name='image'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>イメージ画像</FormLabel>
                        <FormControl>
                          <input
                            type='file'
                            accept='image/*'
                            onChange={e =>
                              field.onChange(e.target.files?.[0] || null)
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          求人に関連するイメージ画像をアップロードしてください。
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 職種・業種 */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                    <FormField
                      name='jobType'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>職種</FormLabel>
                          <FormControl>
                            <InputField
                              {...field}
                              required
                              layout='vertical'
                              placeholder='職種を選択'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name='industry'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>業種</FormLabel>
                          <FormControl>
                            <InputField
                              {...field}
                              required
                              layout='vertical'
                              placeholder='業種を選択'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* ポジション概要 */}
                  <FormField
                    name='positionSummary'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ポジション概要</FormLabel>
                        <FormControl>
                          <InputField
                            {...field}
                            required
                            layout='vertical'
                            placeholder='ポジション概要を入力'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 業務内容・魅力 */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                    <FormField
                      name='jobDescription'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>業務内容</FormLabel>
                          <FormControl>
                            <textarea
                              {...field}
                              required
                              className='w-full min-h-[120px] rounded-md border px-3 py-2'
                              placeholder='具体的な業務内容・期待する役割/成果・募集背景などを入力してください。'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name='jobAppeal'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>当ポジションの魅力</FormLabel>
                          <FormControl>
                            <textarea
                              {...field}
                              required
                              className='w-full min-h-[120px] rounded-md border px-3 py-2'
                              placeholder='当ポジションの魅力を入力してください。'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* 求める人物像・スキル */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                    <FormField
                      name='requiredSkills'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>スキル・経験</FormLabel>
                          <FormControl>
                            <textarea
                              {...field}
                              required
                              className='w-full min-h-[100px] rounded-md border px-3 py-2'
                              placeholder='必要または歓迎するスキル・経験について入力してください。'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name='otherRequirements'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>その他・求める人物像など</FormLabel>
                          <FormControl>
                            <textarea
                              {...field}
                              className='w-full min-h-[100px] rounded-md border px-3 py-2'
                              placeholder='スキル以外に求める人物像や価値観などを入力してください。'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* 条件・待遇 */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                    <div className='flex gap-4'>
                      <FormField
                        name='salaryMin'
                        render={({ field }) => (
                          <FormItem className='flex-1'>
                            <FormLabel>想定年収（下限）</FormLabel>
                            <FormControl>
                              <InputField
                                {...field}
                                required
                                layout='vertical'
                                placeholder='下限'
                                inputType='text'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <span className='self-end pb-4'>〜</span>
                      <FormField
                        name='salaryMax'
                        render={({ field }) => (
                          <FormItem className='flex-1'>
                            <FormLabel>想定年収（上限）</FormLabel>
                            <FormControl>
                              <InputField
                                {...field}
                                required
                                layout='vertical'
                                placeholder='上限'
                                inputType='text'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      name='salaryNote'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>年収補足</FormLabel>
                          <FormControl>
                            <InputField
                              {...field}
                              layout='vertical'
                              placeholder='ストックオプションなどについてはこちらに入力してください。'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* 勤務地・雇用形態 */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                    <FormField
                      name='location'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>勤務地</FormLabel>
                          <FormControl>
                            <InputField
                              {...field}
                              required
                              layout='vertical'
                              placeholder='勤務地を選択'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name='locationNote'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>勤務地補足</FormLabel>
                          <FormControl>
                            <InputField
                              {...field}
                              layout='vertical'
                              placeholder='転勤有無・リモート可否・手当の有無など、勤務地に関する補足情報を入力してください。'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                    <FormField
                      name='employmentType'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>雇用形態</FormLabel>
                          <FormControl>
                            <InputField
                              {...field}
                              required
                              layout='vertical'
                              placeholder='雇用形態を選択'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name='employmentTypeNote'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>雇用形態補足</FormLabel>
                          <FormControl>
                            <InputField
                              {...field}
                              layout='vertical'
                              placeholder='契約期間・試用期間など'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* 就業時間・所定外労働・休日 */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                    <FormField
                      name='workingHours'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>就業時間</FormLabel>
                          <FormControl>
                            <InputField
                              {...field}
                              required
                              layout='vertical'
                              placeholder='9:00～18:00（所定労働時間8時間）'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name='overtime'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>所定外労働の有無</FormLabel>
                          <FormControl>
                            <InputField
                              {...field}
                              required
                              layout='vertical'
                              placeholder='あり／なし'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    name='holidays'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>休日・休暇</FormLabel>
                        <FormControl>
                          <InputField
                            {...field}
                            required
                            layout='vertical'
                            placeholder='完全週休2日制（土・日）、祝日など'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 選考情報 */}
                  <FormField
                    name='selectionProcess'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>選考情報</FormLabel>
                        <FormControl>
                          <InputField
                            {...field}
                            layout='vertical'
                            placeholder='選考フローや面接回数などの情報を入力してください。'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* アピールポイント（仮：テキスト入力） */}
                  <FormField
                    name='appealPoints'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>アピールポイント</FormLabel>
                        <FormControl>
                          <InputField
                            {...field}
                            layout='vertical'
                            placeholder='最大6つまで選択可能（カンマ区切りで入力）'
                          />
                        </FormControl>
                        <FormDescription>最大6つまで選択可能</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 応募時のレジュメ提出（仮：テキスト入力） */}
                  <FormField
                    name='resumeRequired'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>応募時のレジュメ提出</FormLabel>
                        <FormControl>
                          <InputField
                            {...field}
                            layout='vertical'
                            placeholder='履歴書の提出が必須、職務経歴書の提出が必須 など'
                          />
                        </FormControl>
                        <FormDescription>
                          応募後に別途提出を依頼することも可能です。
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 社内メモ */}
                  <FormField
                    name='memo'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>社内メモ</FormLabel>
                        <FormControl>
                          <textarea
                            {...field}
                            className='w-full min-h-[80px] rounded-md border px-3 py-2'
                            placeholder='この求人に関して、社内で共有しておきたい事項などがあれば、こちらを活用してください。'
                          />
                        </FormControl>
                        <FormDescription>
                          社内メモは候補者に共有されません。
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* ボタンエリア */}
                <CardFooter className='flex justify-end gap-4 mt-8'>
                  <Button
                    type='button'
                    variant='green-outline'
                    size='figma-outline'
                  >
                    下書き保存
                  </Button>
                  <Button
                    type='submit'
                    variant='green-gradient'
                    size='figma-default'
                  >
                    確認する
                  </Button>
                </CardFooter>
              </Form>
            </FormProvider>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
