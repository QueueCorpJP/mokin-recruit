import type { JobCardData } from '@/types/candidate';

// Convert various job posting shapes to JobCardData used by UI cards
// This function intentionally accepts 'any' to allow non-breaking gradual adoption.
export function toJobCardData(job: any): JobCardData {
  const imageUrl: string = Array.isArray(job?.image_urls)
    ? (job.image_urls[0] ?? '/company.jpg')
    : (job?.image_urls ?? '/company.jpg');

  const companyName: string =
    job?.company_accounts?.company_name ?? job?.company_name ?? '企業名';

  const rawLocation = job?.work_location ?? job?.location;
  const location: string | string[] = Array.isArray(rawLocation)
    ? rawLocation
    : rawLocation
      ? [rawLocation]
      : ['勤務地未設定'];

  const salary: string =
    job?.salary_min &&
    job?.salary_max &&
    job.salary_min > 0 &&
    job.salary_max > 0
      ? `${job.salary_min}万〜${job.salary_max}万`
      : job?.salary_note || '給与応相談';

  const tags: string[] = Array.isArray(job?.job_type)
    ? job.job_type.slice(0, 3)
    : [job?.job_type].filter(Boolean);

  const apell: string[] = Array.isArray(job?.company_attractions)
    ? job.company_attractions
    : job?.apell && Array.isArray(job.apell)
      ? job.apell
      : ['アピールポイントなし'];

  return {
    id: String(job?.id ?? ''),
    imageUrl,
    imageAlt: companyName || 'company',
    title: job?.title ?? 'タイトル未設定',
    tags,
    companyName,
    location,
    salary,
    apell,
    starred: Boolean(job?.starred),
  };
}

// Helper for favorite list rows that come as { job_postings: {...}, id: favoriteId }
export function toJobCardDataFromFavoriteRow(favoriteRow: any): JobCardData {
  const job =
    favoriteRow?.job_postings ?? favoriteRow?.job_posting ?? favoriteRow?.job;
  return toJobCardData(job);
}
