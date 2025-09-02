'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { CompanyEditData } from './edit/page';

interface CompanyDetailClientProps {
  company: CompanyEditData;
}

export default function CompanyDetailClient({ company }: CompanyDetailClientProps) {
  const router = useRouter();
  const [memoText, setMemoText] = useState('自由にメモを記入できます。\n同一グループ内の方が閲覧可能です。');

  const handleEdit = () => {
    router.push(`/admin/company/${company.id}/edit`);
  };

  const handleDelete = () => {
    if (confirm('本当にこの企業を削除しますか？')) {
      // TODO: 実際の削除処理を実装
      console.log('Deleting company:', company.id);
      // 削除完了ページに遷移
      router.push('/admin/company/delete');
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* ヘッダーボタン */}
      <div className="flex justify-end gap-4 p-6 pb-0">
        <button
          onClick={handleEdit}
          className="px-8 py-3 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-colors"
        >
          企業情報を編集
        </button>
        <button
          onClick={handleDelete}
          className="px-8 py-3 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-colors"
        >
          企業を削除
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {/* プラン情報 */}
        <div className="flex items-center gap-6 py-3">
          <label className="block text-base font-bold text-black w-40">プラン</label>
          <div className="text-base text-black">
            {company.contract_plan?.plan_name || 'プラン名が入ります'}
          </div>
        </div>

        <hr className="border-gray-300" />

        {/* 企業分析セクション */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-black">企業分析</h2>
          
          {/* 分析テーブル */}
          <div className="border border-gray-300 rounded">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-black border-r border-gray-300"></th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-black border-r border-gray-300">スカウト送信数</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-black border-r border-gray-300">開封数（開封率）</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-black border-r border-gray-300">返信数（返信率）</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-black">応募数（応募率）</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-300">
                  <td className="px-3 py-2 text-xs text-black border-r border-gray-300">過去7日合計</td>
                  <td className="px-3 py-2 text-xs text-black border-r border-gray-300">0</td>
                  <td className="px-3 py-2 text-xs text-black border-r border-gray-300">0</td>
                  <td className="px-3 py-2 text-xs text-black border-r border-gray-300">0</td>
                  <td className="px-3 py-2 text-xs text-black">0</td>
                </tr>
                <tr className="border-t border-gray-300">
                  <td className="px-3 py-2 text-xs text-black border-r border-gray-300">過去30日間合計</td>
                  <td className="px-3 py-2 text-xs text-black border-r border-gray-300">0</td>
                  <td className="px-3 py-2 text-xs text-black border-r border-gray-300">0</td>
                  <td className="px-3 py-2 text-xs text-black border-r border-gray-300">0</td>
                  <td className="px-3 py-2 text-xs text-black">0</td>
                </tr>
                <tr className="border-t border-gray-300">
                  <td className="px-3 py-2 text-xs text-black border-r border-gray-300">累計</td>
                  <td className="px-3 py-2 text-xs text-black border-r border-gray-300">0</td>
                  <td className="px-3 py-2 text-xs text-black border-r border-gray-300">0</td>
                  <td className="px-3 py-2 text-xs text-black border-r border-gray-300">0</td>
                  <td className="px-3 py-2 text-xs text-black">0</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 運営メモ */}
          <div className="mt-8">
            <label className="block text-base font-bold text-black mb-2">運営メモ</label>
            <textarea
              value={memoText}
              onChange={(e) => setMemoText(e.target.value)}
              className="w-full h-32 p-3 border border-gray-300 rounded resize-none text-sm text-gray-600"
              placeholder="自由にメモを記入できます。同一グループ内の方が閲覧可能です。"
            />
          </div>
        </div>

        <hr className="border-black border-t-2" />

        {/* 企業情報セクション */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-black">企業情報</h2>
          
          {/* 企業ID */}
          <div className="flex items-center gap-6 py-3">
            <label className="block text-base font-bold text-black w-40">企業ID</label>
            <div className="flex-1 px-3 py-3 bg-white border border-gray-300 text-base">
              {company.id}
            </div>
          </div>

          <hr className="border-gray-300" />

          {/* 企業名 */}
          <div className="flex items-center gap-6 py-3">
            <label className="block text-base font-bold text-black w-40">企業名</label>
            <div className="flex-1 px-3 py-3 bg-white border border-gray-300 text-base">
              {company.company_name}
            </div>
          </div>

          <hr className="border-gray-300" />

          {/* URL */}
          <div className="flex items-start gap-6 py-3">
            <label className="block text-base font-bold text-black w-40 mt-2">URL</label>
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-4">
                <div className="text-base text-black">タイトルテキストが入ります</div>
                <div className="text-base text-black">https://---------</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-base text-black">タイトルテキストが入ります</div>
                <div className="text-base text-black">https://---------</div>
              </div>
            </div>
          </div>

          <hr className="border-gray-300" />

          {/* アイコン画像 */}
          <div className="flex items-center gap-6 py-3">
            <label className="block text-base font-bold text-black w-40">アイコン画像</label>
            <div className="w-32 h-32 bg-gray-400 rounded-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-sm font-bold text-white">画像を</div>
                <div className="text-sm font-bold text-white">変更</div>
              </div>
            </div>
          </div>

          <hr className="border-gray-300" />

          {/* 代表者 */}
          <div className="flex items-center gap-6 py-3">
            <label className="block text-base font-bold text-black w-40">代表者</label>
            <div className="flex-1 px-3 py-3 bg-white border border-gray-300 text-base">
              {company.representative_name || '山田 太郎'}
            </div>
          </div>

          <hr className="border-gray-300" />

          {/* 設立 */}
          <div className="flex items-center gap-6 py-3">
            <label className="block text-base font-bold text-black w-40">設立</label>
            <div className="flex items-center gap-2">
              <div className="w-24 px-3 py-3 bg-white border border-gray-300 text-base text-center">
                2020
              </div>
              <span className="text-base text-black">年</span>
            </div>
          </div>

          <hr className="border-gray-300" />

          {/* 資本金 */}
          <div className="flex items-center gap-6 py-3">
            <label className="block text-base font-bold text-black w-40">資本金</label>
            <div className="flex items-center gap-2">
              <div className="w-24 px-3 py-3 bg-white border border-gray-300 text-base text-center">
                100
              </div>
              <span className="text-base text-black">万円</span>
            </div>
          </div>

          <hr className="border-gray-300" />

          {/* 従業員数 */}
          <div className="flex items-center gap-6 py-3">
            <label className="block text-base font-bold text-black w-40">従業員数</label>
            <div className="flex items-center gap-2">
              <div className="w-24 px-3 py-3 bg-white border border-gray-300 text-base text-center">
                500
              </div>
              <span className="text-base text-black">人</span>
            </div>
          </div>

          <hr className="border-gray-300" />

          {/* 業種 */}
          <div className="flex items-start gap-6 py-3">
            <label className="block text-base font-bold text-black w-40 mt-2">業種</label>
            <div className="flex-1 px-3 py-3 bg-white border border-gray-300 text-base">
              テキストが入ります。
            </div>
          </div>

          <hr className="border-gray-300" />

          {/* 事業内容 */}
          <div className="flex items-start gap-6 py-3">
            <label className="block text-base font-bold text-black w-40 mt-2">事業内容</label>
            <div className="flex-1 px-3 py-3 bg-white border border-gray-300 text-base whitespace-pre-wrap">
              テキストが入ります。
              テキストが入ります。
              テキストが入ります。
            </div>
          </div>

          <hr className="border-gray-300" />

          {/* 所在地 */}
          <div className="flex items-start gap-6 py-3">
            <label className="block text-base font-bold text-black w-40 mt-2">所在地</label>
            <div className="flex-1 px-3 py-3 bg-white border border-gray-300 text-base whitespace-pre-wrap">
              東京都
              千代田区〜〜〜〜〜〜
            </div>
          </div>

          <hr className="border-gray-300" />

          {/* 企業フェーズ */}
          <div className="flex items-center gap-6 py-3">
            <label className="block text-base font-bold text-black w-40">企業フェーズ</label>
            <div className="flex-1 px-3 py-3 bg-white border border-gray-300 text-base">
              上場企業
            </div>
          </div>

          <hr className="border-gray-300" />

          {/* イメージ画像 */}
          <div className="flex items-start gap-6 py-3">
            <label className="block text-base font-bold text-black w-40 mt-2">イメージ画像</label>
            <div className="flex gap-4">
              {[0, 1, 2].map(index => (
                <div key={index} className="w-48 h-32 bg-gray-400 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-sm font-bold text-white">画像を</div>
                    <div className="text-sm font-bold text-white">変更</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-gray-300" />

          {/* 企業の魅力 */}
          <div className="flex items-start gap-6 py-3">
            <label className="block text-base font-bold text-black w-40 mt-2">企業の魅力</label>
            <div className="flex-1 space-y-6">
              {[0, 1, 2].map(index => (
                <div key={index} className="space-y-4">
                  <div className="text-xl font-bold text-black">
                    企業の魅力テキストが入ります
                  </div>
                  <div className="text-base text-black">
                    企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <hr className="border-black border-t-2" />

        {/* 企業グループセクション */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-black">企業グループ</h2>
            <button className="px-6 py-3 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-colors">
              新規グループ追加
            </button>
          </div>

          {/* グループ1 */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-black">グループ名テキスト</h3>
              <div className="flex gap-6">
                <button className="px-6 py-3 border border-black rounded-full font-bold hover:bg-gray-50 transition-colors">
                  メンバー追加
                </button>
                <button className="px-6 py-3 border border-black rounded-full font-bold hover:bg-gray-50 transition-colors">
                  グループ名編集
                </button>
                <button 
                  onClick={() => {
                    if (confirm('本当にこのグループを削除しますか？')) {
                      // TODO: 実際のグループ削除処理を実装
                      console.log('Deleting group');
                      // グループ削除完了ページに遷移
                      router.push('/admin/company/group');
                    }
                  }}
                  className="px-6 py-3 border border-black rounded-full font-bold hover:bg-gray-50 transition-colors"
                >
                  グループを削除
                </button>
              </div>
            </div>

            <hr className="border-gray-300" />

            {/* メンバーリスト */}
            <div className="space-y-4">
              {['管理者', '管理者', 'スカウト担当者', 'スカウト担当者', ''].map((role, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center py-2">
                    <div className="text-base font-bold">名前 名前</div>
                    <div className="flex items-center gap-4">
                      {role && (
                        <div className="text-base font-bold">{role} ▼</div>
                      )}
                      <button className="text-base font-bold text-black hover:text-gray-600">
                        削除
                      </button>
                    </div>
                  </div>
                  {index < 4 && <hr className="border-gray-300" />}
                </div>
              ))}
            </div>
          </div>

          {/* グループ2（同様の構造） */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-black">グループ名テキスト</h3>
              <div className="flex gap-6">
                <button className="px-6 py-3 border border-black rounded-full font-bold hover:bg-gray-50 transition-colors">
                  メンバー追加
                </button>
                <button className="px-6 py-3 border border-black rounded-full font-bold hover:bg-gray-50 transition-colors">
                  グループ名編集
                </button>
                <button className="px-6 py-3 border border-black rounded-full font-bold hover:bg-gray-50 transition-colors">
                  グループを削除
                </button>
              </div>
            </div>

            <hr className="border-gray-300" />

            {/* メンバーリスト */}
            <div className="space-y-4">
              {['管理者', '管理者', 'スカウト担当者', 'スカウト担当者', ''].map((role, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center py-2">
                    <div className="text-base font-bold">名前 名前</div>
                    <div className="flex items-center gap-4">
                      {role && (
                        <div className="text-base font-bold">{role} ▼</div>
                      )}
                      <button className="text-base font-bold text-black hover:text-gray-600">
                        削除
                      </button>
                    </div>
                  </div>
                  {index < 4 && <hr className="border-gray-300" />}
                </div>
              ))}
            </div>
          </div>

          {/* グループチケットログ1 */}
          <div className="bg-gray-300 rounded-lg p-6">
            <h3 className="text-xl font-bold text-black text-center mb-6">グループチケットログ</h3>
            
            <div className="bg-white rounded-lg p-6 space-y-4">
              <div className="space-y-2">
                <div className="text-base">yyyy/mm/dd：ログ表示テキストが入ります</div>
                <div className="text-base">yyyy/mm/dd：ログ表示テキストが入ります</div>
                <div className="text-base">yyyy/mm/dd：ログ表示テキストが入ります</div>
                <div className="text-base">yyyy/mm/dd：ログ表示テキストが入ります</div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="border-l border-gray-300 h-20"></div>
                <div className="text-right">
                  <div className="text-base">グループ内月次消化枚数</div>
                  <div className="text-2xl font-bold">100枚</div>
                </div>
              </div>
            </div>
          </div>

          {/* アクションボタン群 */}
          <div className="flex gap-6 justify-center">
            <button className="px-6 py-3 border border-black rounded-full font-bold hover:bg-gray-50 transition-colors">
              スカウト上限数変更
            </button>
            <button className="px-6 py-3 border border-black rounded-full font-bold hover:bg-gray-50 transition-colors">
              プラン変更
            </button>
            <button className="px-6 py-3 border border-black rounded-full font-bold hover:bg-gray-50 transition-colors">
              休会
            </button>
            <button 
              onClick={() => {
                if (confirm('本当にこの企業を退会させますか？')) {
                  // TODO: 実際の退会処理を実装
                  console.log('Withdrawing company:', company.id);
                  // 退会完了ページに遷移
                  router.push('/admin/company/withdraw');
                }
              }}
              className="px-6 py-3 border border-black rounded-full font-bold hover:bg-gray-50 transition-colors"
            >
              退会
            </button>
          </div>

          {/* チケット管理セクション */}
          <div className="bg-gray-700 rounded-lg p-6 text-white">
            <h3 className="text-xl font-bold text-center mb-6">チケット管理</h3>
            
            <div className="bg-white rounded-lg p-6 text-black space-y-4">
              <div className="space-y-2">
                <div className="text-base">yyyy/mm/dd：ログ表示テキストが入ります</div>
                <div className="text-base">yyyy/mm/dd：ログ表示テキストが入ります</div>
                <div className="text-base">yyyy/mm/dd：ログ表示テキストが入ります</div>
                <div className="text-base">yyyy/mm/dd：ログ表示テキストが入ります</div>
                <div className="text-base">yyyy/mm/dd：ログ表示テキストが入ります</div>
                <div className="text-base">yyyy/mm/dd：ログ表示テキストが入ります</div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="border-l border-gray-300 h-24"></div>
                <div className="text-right">
                  <div className="text-base">現在の残チケット枚数</div>
                  <div className="text-2xl font-bold">100枚</div>
                </div>
              </div>
              
              <div className="text-sm text-red-500 text-center">
                期間は6ヶ月分をログとして記載する
              </div>
            </div>
          </div>

          {/* グループチケットログ2 */}
          <div className="bg-gray-300 rounded-lg p-6">
            <h3 className="text-xl font-bold text-black text-center mb-6">グループチケットログ</h3>
            
            <div className="bg-white rounded-lg p-6 space-y-4">
              <div className="space-y-2">
                <div className="text-base">yyyy/mm/dd：ログ表示テキストが入ります</div>
                <div className="text-base">yyyy/mm/dd：ログ表示テキストが入ります</div>
                <div className="text-base">yyyy/mm/dd：ログ表示テキストが入ります</div>
                <div className="text-base">yyyy/mm/dd：ログ表示テキストが入ります</div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="border-l border-gray-300 h-20"></div>
                <div className="text-right">
                  <div className="text-base">グループ内月次消化枚数</div>
                  <div className="text-2xl font-bold">100枚</div>
                </div>
              </div>
              
              <div className="text-sm text-red-500 text-center">
                期間は6ヶ月分をログとして記載する
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}