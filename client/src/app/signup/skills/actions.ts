'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getOrCreateCandidateId } from '@/lib/signup/candidateId';

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

    // Get or create candidate ID using the centralized function
    const candidateId = await getOrCreateCandidateId();
    console.log('Using candidate ID for skills data:', candidateId);

    // Save skills data - use insert with manual conflict handling since no unique constraint on candidate_id
    const { data: existingSkills } = await supabase
      .from('skills')
      .select('id')
      .eq('candidate_id', candidateId)
      .single();

    let skillsError;
    if (existingSkills) {
      // Update existing record
      const { error } = await supabase
        .from('skills')
        .update({
          english_level: formData.englishLevel,
          other_languages: JSON.stringify(formData.otherLanguages),
          skills_list: formData.skills,
          qualifications: formData.qualifications || null,
          updated_at: new Date().toISOString(),
        })
        .eq('candidate_id', candidateId);
      skillsError = error;
    } else {
      // Insert new record
      const { error } = await supabase
        .from('skills')
        .insert({
          candidate_id: candidateId,
          english_level: formData.englishLevel,
          other_languages: JSON.stringify(formData.otherLanguages),
          skills_list: formData.skills,
          qualifications: formData.qualifications || null,
        });
      skillsError = error;
    }

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