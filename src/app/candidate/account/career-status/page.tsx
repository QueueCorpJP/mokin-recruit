import { redirect } from 'next/navigation';
import { getCachedCandidateUser } from '@/lib/auth/server';
import { getCandidateData } from '@/lib/server/candidate/candidateData';
import { getSupabaseServerClient } from '@/lib/supabase/server-client';
import PageLayout from '@/components/candidate/account/PageLayout';
import EditButton from '@/components/candidate/account/EditButton';
import {
  CURRENT_ACTIVITY_STATUS_OPTIONS,
  DECLINE_REASON_OPTIONS,
  JOB_CHANGE_TIMING_OPTIONS,
  PROGRESS_STATUS_OPTIONS,
} from '@/constants/career-status';
import Section from '@/components/education/common/Section';
import SectionCard from '@/components/education/common/SectionCard';
import FormRow from '@/components/education/common/FormRow';

// 選考状況データを取得
async function getCareerStatusEntries(candidateId: string) {
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
      .from('career_status_entries')
      .select('*')
      .eq('candidate_id', candidateId)
      .order('created_at', { ascending: false });

    if (error) {
      globalThis.console.error('Career status entries fetch error:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    globalThis.console.error('Career status entries fetch failed:', error);
    return [];
  }
}

// value→label変換関数
function getLabel(options: any[], value: string) {
  const found = options.find((opt: any) => opt.value === value);
  return found ? found.label : value || '未設定';
}

// 候補者_転職活動状況確認ページ
export default async function CandidateCareerStatusPage() {
  // 認証チェック
  const user = await getCachedCandidateUser();
  if (!user) {
    redirect('/candidate/auth/login');
  }

  // 候補者データを取得
  const candidateData = await getCandidateData(user.id);
  if (!candidateData) {
    redirect('/candidate/auth/login');
  }

  // 選考状況データを取得
  const careerStatusEntries = await getCareerStatusEntries(user.id);

  return (
    <PageLayout breadcrumb='転職活動状況' title='転職活動状況'>
      <SectionCard>
        <Section title='転職活動状況'>
          <FormRow label='転職希望時期'>
            <div className='text-[16px] text-[#323232] font-medium tracking-[1.6px]'>
              {getLabel(
                JOB_CHANGE_TIMING_OPTIONS as unknown as {
                  value: string;
                  label: string;
                }[],
                candidateData.job_change_timing || ''
              )}
            </div>
          </FormRow>
          <FormRow label='現在の活動状況'>
            <div className='text-[16px] text-[#323232] font-medium tracking-[1.6px]'>
              {getLabel(
                CURRENT_ACTIVITY_STATUS_OPTIONS as unknown as {
                  value: string;
                  label: string;
                }[],
                candidateData.current_activity_status || ''
              )}
            </div>
          </FormRow>
        </Section>
        <Section title='選考状況'>
          {careerStatusEntries && careerStatusEntries.length > 0 ? (
            <div className='space-y-6'>
              {careerStatusEntries.map((entry: any) => (
                <div
                  key={entry.id}
                  className='border-b border-[#f0f0f0] pb-6 last:border-b-0 last:pb-0'
                >
                  <div className='space-y-6 lg:space-y-2'>
                    <FormRow label='公開設定'>
                      <div className='text-[16px] text-[#323232] font-medium tracking-[1.6px] leading-[2]'>
                        {entry.is_private ? '非公開' : '公開'}
                      </div>
                    </FormRow>
                    <FormRow label='業種'>
                      {entry.industries &&
                      Array.isArray(entry.industries) &&
                      entry.industries.length > 0 ? (
                        <div className='flex flex-wrap gap-2'>
                          {entry.industries.map((industry: string) => (
                            <span
                              key={industry}
                              className='bg-[#d2f1da] px-3 py-1.5 rounded-[5px] text-[#0f9058] text-[14px] font-medium tracking-[1.4px]'
                            >
                              {industry}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div className='text-[16px] text-[#323232] font-medium tracking-[1.6px] leading-[2]'>
                          未設定
                        </div>
                      )}
                    </FormRow>
                    <FormRow label='企業名'>
                      <div className='text-[16px] text-[#323232] font-medium tracking-[1.6px] leading-[2]'>
                        {entry.company_name || '未設定'}
                      </div>
                    </FormRow>
                    <FormRow label='部署名・役職名'>
                      <div className='text-[16px] text-[#323232] font-medium tracking-[1.6px] leading-[2]'>
                        {entry.department || '未設定'}
                      </div>
                    </FormRow>
                    <FormRow label='進捗状況'>
                      <div className='text-[16px] text-[#323232] font-medium tracking-[1.6px] leading-[2]'>
                        {getLabel(
                          PROGRESS_STATUS_OPTIONS as unknown as {
                            value: string;
                            label: string;
                          }[],
                          entry.progress_status || ''
                        )}
                      </div>
                    </FormRow>
                    {(entry.progress_status === '辞退' ||
                      entry.progress_status === '不合格') && (
                      <FormRow label='辞退理由'>
                        <div className='text-[16px] text-[#323232] font-medium tracking-[1.6px] leading-[2]'>
                          {getLabel(
                            DECLINE_REASON_OPTIONS as unknown as {
                              value: string;
                              label: string;
                            }[],
                            entry.decline_reason || ''
                          )}
                        </div>
                      </FormRow>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='text-center py-8'>
              <div className='text-[16px] text-[#999999] font-medium tracking-[1.6px]'>
                選考状況はまだ登録されていません
              </div>
            </div>
          )}
        </Section>
      </SectionCard>
      <EditButton editPath='/candidate/account/career-status/edit' />
    </PageLayout>
  );
}

export const dynamic = 'force-dynamic';
