// 'use client'

// import { useState } from 'react'
// import { useSearchStore } from '@/stores/searchStore'
// import { deleteSavedSearch, loadSearchConditions } from './actions'

// interface SavedSearch {
//   id: string
//   search_name: string
//   search_data: any
//   created_at: string
// }

// interface SavedSearchesListProps {
//   companyId: string
//   savedSearches: SavedSearch[]
// }

// export const SavedSearchesList: React.FC<SavedSearchesListProps> = ({ 
//   companyId, 
//   savedSearches 
// }) => {
//   const [isLoading, setIsLoading] = useState<string | null>(null)
//   const searchStore = useSearchStore()

//   const handleLoad = async (searchId: string) => {
//     setIsLoading(searchId)
    
//     try {
//       const result = await loadSearchConditions(searchId, companyId)
      
//       if (result.success && result.data) {
//         const data = result.data
        
//         // Update all search store fields
//         searchStore.setSearchGroup(data.searchGroup || '')
//         searchStore.setKeyword(data.keyword || '')
//         searchStore.setExperienceJobTypes(data.experienceJobTypes || [])
//         searchStore.setExperienceIndustries(data.experienceIndustries || [])
//         searchStore.setJobTypeAndSearch(data.jobTypeAndSearch || false)
//         searchStore.setIndustryAndSearch(data.industryAndSearch || false)
//         searchStore.setCurrentSalaryMin(data.currentSalaryMin || '')
//         searchStore.setCurrentSalaryMax(data.currentSalaryMax || '')
//         searchStore.setCurrentCompany(data.currentCompany || '')
//         searchStore.setEducation(data.education || '')
//         searchStore.setEnglishLevel(data.englishLevel || '')
//         searchStore.setOtherLanguage(data.otherLanguage || '')
//         searchStore.setOtherLanguageLevel(data.otherLanguageLevel || '')
//         searchStore.setQualifications(data.qualifications || '')
//         searchStore.setAgeMin(data.ageMin || '')
//         searchStore.setAgeMax(data.ageMax || '')
//         searchStore.setDesiredJobTypes(data.desiredJobTypes || [])
//         searchStore.setDesiredIndustries(data.desiredIndustries || [])
//         searchStore.setDesiredSalaryMin(data.desiredSalaryMin || '')
//         searchStore.setDesiredSalaryMax(data.desiredSalaryMax || '')
//         searchStore.setDesiredLocations(data.desiredLocations || [])
//         searchStore.setTransferTime(data.transferTime || '')
//         searchStore.setWorkStyles(data.workStyles || [])
//         searchStore.setSelectionStatus(data.selectionStatus || '')
//         searchStore.setSimilarCompanyIndustry(data.similarCompanyIndustry || '')
//         searchStore.setSimilarCompanyLocation(data.similarCompanyLocation || '')
//         searchStore.setLastLoginMin(data.lastLoginMin || '')
        
//         alert('検索条件を読み込みました')
//       } else {
//         alert('検索条件の読み込みに失敗しました')
//       }
//     } catch (error) {
//       console.error('Load error:', error)
//       alert('検索条件の読み込みに失敗しました')
//     } finally {
//       setIsLoading(null)
//     }
//   }

//   const handleDelete = async (searchId: string, searchName: string) => {
//     if (!confirm(`「${searchName}」を削除しますか？`)) {
//       return
//     }

//     try {
//       const result = await deleteSavedSearch(searchId, companyId)
      
//       if (result.success) {
//         alert('検索条件を削除しました')
//         window.location.reload()
//       } else {
//         alert('削除に失敗しました')
//       }
//     } catch (error) {
//       console.error('Delete error:', error)
//       alert('削除に失敗しました')
//     }
//   }

//   return (
//     <div className="mt-6">
//       <h3 className="text-lg font-bold mb-4">保存された検索条件</h3>
//       <div className="space-y-3">
//         {savedSearches.map((search) => (
//           <div 
//             key={search.id} 
//             className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between"
//           >
//             <div>
//               <h4 className="font-medium">{search.search_name}</h4>
//               <p className="text-sm text-gray-600">
//                 保存日時: {new Date(search.created_at).toLocaleString('ja-JP')}
//               </p>
//             </div>
//             <div className="flex gap-2">
//               <button
//                 onClick={() => handleLoad(search.id)}
//                 disabled={isLoading === search.id}
//                 className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//               >
//                 {isLoading === search.id ? '読込中...' : '読込'}
//               </button>
//               <button
//                 onClick={() => handleDelete(search.id, search.search_name)}
//                 className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
//               >
//                 削除
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }