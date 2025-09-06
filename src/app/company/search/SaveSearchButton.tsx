'use client'

import { useState } from 'react'
import { useSearchStore } from '@/stores/searchStore'
import { saveSearchConditions } from './actions'

interface SaveSearchButtonProps {
  companyId: string
}

export const SaveSearchButton: React.FC<SaveSearchButtonProps> = ({ companyId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchName, setSearchName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const searchStore = useSearchStore()

  const handleSave = async () => {
    if (!searchName.trim()) {
      setError('検索条件名を入力してください')
      return
    }

    if (!searchStore.searchGroup || searchStore.searchGroup === '') {
      setError('グループを選択してください')
      return
    }

    setIsLoading(true)
    setError('')

    const searchData = {
      searchGroup: searchStore.searchGroup,
      keyword: searchStore.keyword,
      experienceJobTypes: searchStore.experienceJobTypes,
      experienceIndustries: searchStore.experienceIndustries,
      jobTypeAndSearch: searchStore.jobTypeAndSearch,
      industryAndSearch: searchStore.industryAndSearch,
      currentSalaryMin: searchStore.currentSalaryMin,
      currentSalaryMax: searchStore.currentSalaryMax,
      currentCompany: searchStore.currentCompany,
      education: searchStore.education,
      englishLevel: searchStore.englishLevel,
      otherLanguage: searchStore.otherLanguage,
      otherLanguageLevel: searchStore.otherLanguageLevel,
      qualifications: searchStore.qualifications,
      ageMin: searchStore.ageMin,
      ageMax: searchStore.ageMax,
      desiredJobTypes: searchStore.desiredJobTypes,
      desiredIndustries: searchStore.desiredIndustries,
      desiredSalaryMin: searchStore.desiredSalaryMin,
      desiredSalaryMax: searchStore.desiredSalaryMax,
      desiredLocations: searchStore.desiredLocations,
      transferTime: searchStore.transferTime,
      workStyles: searchStore.workStyles,
      selectionStatus: searchStore.selectionStatus,
      similarCompanyIndustry: searchStore.similarCompanyIndustry,
      similarCompanyLocation: searchStore.similarCompanyLocation,
      lastLoginMin: searchStore.lastLoginMin,
    }

    try {
      const result = await saveSearchConditions(
        companyId,
        searchStore.searchGroup,
        searchName.trim(),
        searchData
      )

      if (result.success) {
        setIsModalOpen(false)
        setSearchName('')
        alert('検索条件を保存しました')
      } else {
        setError(result.error || '保存に失敗しました')
      }
    } catch (error) {
      setError('保存に失敗しました')
      console.error('Save error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        保存
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-bold mb-4">検索条件を保存</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                検索条件名
              </label>
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="検索条件名を入力"
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="mb-4 text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? '保存中...' : '保存'}
              </button>
              <button
                onClick={() => {
                  setIsModalOpen(false)
                  setSearchName('')
                  setError('')
                }}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}