'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { requireCompanyAuthForAction } from '@/lib/auth/server'

export interface SavedSearchData {
  searchGroup: string
  keyword: string
  experienceJobTypes: Array<{ id: string; name: string; experienceYears?: string }>
  experienceIndustries: Array<{ id: string; name: string; experienceYears?: string }>
  jobTypeAndSearch: boolean
  industryAndSearch: boolean
  currentSalaryMin: string
  currentSalaryMax: string
  currentCompany: string
  education: string
  englishLevel: string
  otherLanguage: string
  otherLanguageLevel: string
  qualifications: string
  ageMin: string
  ageMax: string
  desiredJobTypes: Array<{ id: string; name: string }>
  desiredIndustries: Array<{ id: string; name: string }>
  desiredSalaryMin: string
  desiredSalaryMax: string
  desiredLocations: Array<{ id: string; name: string }>
  transferTime: string
  workStyles: Array<{ id: string; name: string }>
  selectionStatus: string
  similarCompanyIndustry: string
  similarCompanyLocation: string
  lastLoginMin: string
}

export async function saveSearchConditions(
  companyId: string,
  groupId: string,
  searchName: string,
  searchData: SavedSearchData
) {
  try {
    const supabase = await createClient()
    
    const { error } = await supabase
      .from('saved_searches')
      .insert({
        company_id: companyId,
        group_id: groupId,
        search_name: searchName,
        search_data: searchData
      })

    if (error) {
      console.error('Error saving search conditions:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/company/search')
    return { success: true }
  } catch (error) {
    console.error('Unexpected error saving search conditions:', error)
    return { success: false, error: 'Failed to save search conditions' }
  }
}

export async function getSavedSearches(companyId: string, groupId: string) {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('saved_searches')
      .select('*')
      .eq('company_id', companyId)
      .eq('group_id', groupId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching saved searches:', error)
      return { success: false, error: error.message, data: [] }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    console.error('Unexpected error fetching saved searches:', error)
    return { success: false, error: 'Failed to fetch saved searches', data: [] }
  }
}

export async function deleteSavedSearch(searchId: string, companyId: string) {
  try {
    const supabase = await createClient()
    
    const { error } = await supabase
      .from('saved_searches')
      .delete()
      .eq('id', searchId)
      .eq('company_id', companyId)

    if (error) {
      console.error('Error deleting saved search:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/company/search')
    return { success: true }
  } catch (error) {
    console.error('Unexpected error deleting saved search:', error)
    return { success: false, error: 'Failed to delete saved search' }
  }
}

export async function loadSearchConditions(searchId: string, companyId: string) {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('saved_searches')
      .select('search_data')
      .eq('id', searchId)
      .eq('company_id', companyId)
      .single()

    if (error) {
      console.error('Error loading search conditions:', error)
      return { success: false, error: error.message, data: null }
    }

    return { success: true, data: data.search_data }
  } catch (error) {
    console.error('Unexpected error loading search conditions:', error)
    return { success: false, error: 'Failed to load search conditions', data: null }
  }
}