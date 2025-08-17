'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

interface SkillsFormData {
  englishLevel: string;
  otherLanguages: Array<{ language: string; level: string }>;
  skills: string[];
  qualifications?: string;
}

export async function saveSkillsData(formData: SkillsFormData) {
  console.log('=== Start saveSkillsData ===');
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          async get(name: string) {
            const cookieStore = await cookies();
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const { data: uuidData, error: uuidError } = await supabase.rpc('gen_random_uuid');
    const candidateId = uuidData || crypto.randomUUID();

    console.log('Candidate ID for skills data:', candidateId);

    // Save skills data
    const { data: skillsData, error: skillsError } = await supabase
      .from('skills')
      .upsert({
        candidate_id: candidateId,
        english_level: formData.englishLevel,
        other_languages: JSON.stringify(formData.otherLanguages),
        skills_list: formData.skills,
        qualifications: formData.qualifications || null,
      }, {
        onConflict: 'candidate_id'
      });

    if (skillsError) {
      throw new Error(`Skills data save failed: ${skillsError.message}`);
    }

    console.log('Skills data saved successfully');
    redirect('/signup/expectation');

  } catch (error) {
    console.error('Skills data save error:', error);
    throw error;
  }
}