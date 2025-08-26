# 求人削除API

## 基本情報
- **エンドポイント**: `DELETE /api/company/job/delete`
- **目的**: 企業が投稿した求人の削除
- **認証**: 必要（企業ユーザーのJWTトークン）

## 機能概要
このAPIは、認証された企業ユーザーが自社で投稿した求人を削除します。削除された求人は完全にデータベースから除去され、復元できません。

## リクエスト

### HTTPメソッド
`DELETE`

### リクエストヘッダー
```
Content-Type: application/json
Authorization: Bearer <jwt_token> (optional)
Cookie: supabase-auth-token=<jwt_token> (optional)
```

### リクエストボディ
```json
{
  "id": "string (required)"
}
```

#### パラメータ詳細
- **id**: 削除したい求人のID
  - 必須
  - 自社で作成した求人のIDのみ有効

### リクエスト例
```json
{
  "id": "job-12345"
}
```

## レスポンス

### 成功時（200 OK）
```json
{
  "success": true,
  "message": "求人情報が削除されました"
}
```

### エラー時（400 Bad Request）
```json
{
  "success": false,
  "error": "idが必要です"
}
```

### エラー時（401 Unauthorized）
```json
{
  "success": false,
  "error": "認証トークンがありません"
}
```

### エラー時（404 Not Found）
```json
{
  "success": false,
  "error": "求人情報が見つかりません"
}
```

### エラー時（403 Forbidden）
```json
{
  "success": false,
  "error": "この求人を削除する権限がありません"
}
```

### エラー時（500 Internal Server Error）
```json
{
  "success": false,
  "error": "サーバーエラーが発生しました"
}
```

## フロントエンドでの使用方法

### 期待される処理フロー
1. 企業ユーザーのログイン状態を確認
2. 削除したい求人のIDを特定
3. ユーザーに削除確認ダイアログを表示
4. 確認後、APIにDELETEリクエストを送信
5. 成功時は求人一覧を更新または該当画面から退出

### 基本的な実装例（JavaScript/TypeScript）
```typescript
const deleteJob = async (jobId: string) => {
  try {
    const token = localStorage.getItem('authToken');

    const response = await fetch('/api/company/job/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ id: jobId }),
    });

    const data = await response.json();

    if (data.success) {
      return {
        success: true,
        message: data.message,
      };
    } else {
      return {
        success: false,
        error: data.error,
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'ネットワークエラーが発生しました',
    };
  }
};
```

### React Hookの実装例
```typescript
const useJobDelete = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  const deleteJobById = useCallback(async (jobId: string) => {
    setIsDeleting(true);
    setError('');

    const result = await deleteJob(jobId);

    if (result.success) {
      setIsDeleting(false);
      return { success: true, message: result.message };
    } else {
      setError(result.error || '求人の削除に失敗しました');
      setIsDeleting(false);
      return { success: false };
    }
  }, []);

  return {
    deleteJobById,
    isDeleting,
    error,
  };
};
```

### 削除確認ダイアログ付きコンポーネント例
```typescript
const JobDeleteButton = ({ jobId, jobTitle, onDeleted }) => {
  const { deleteJobById, isDeleting, error } = useJobDelete();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    const result = await deleteJobById(jobId);
    
    if (result.success) {
      alert('求人が削除されました');
      setShowConfirm(false);
      if (onDeleted) {
        onDeleted(jobId);
      }
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  return (
    <>
      <button 
        onClick={handleDeleteClick}
        disabled={isDeleting}
        className="delete-button"
      >
        {isDeleting ? '削除中...' : '削除'}
      </button>

      {showConfirm && (
        <div className="modal-overlay">
          <div className="confirm-dialog">
            <h3>求人削除の確認</h3>
            <p>以下の求人を削除しますか？</p>
            <p className="job-title">「{jobTitle}」</p>
            <p className="warning">
              ⚠️ 削除した求人は復元できません。
            </p>
            
            <div className="dialog-buttons">
              <button 
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="confirm-button"
              >
                {isDeleting ? '削除中...' : '削除する'}
              </button>
              <button 
                onClick={handleCancel}
                disabled={isDeleting}
                className="cancel-button"
              >
                キャンセル
              </button>
            </div>
            
            {error && <div className="error-message">{error}</div>}
          </div>
        </div>
      )}
    </>
  );
};
```

### 求人一覧での削除機能例
```typescript
const JobListWithDelete = () => {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const { deleteJobById, isDeleting } = useJobDelete();

  const handleJobDeleted = (deletedJobId: string) => {
    // 削除された求人を一覧から除去
    setJobs(prevJobs => prevJobs.filter(job => job.id !== deletedJobId));
  };

  const handleBulkDelete = async (jobIds: string[]) => {
    if (!confirm(`${jobIds.length}件の求人を削除しますか？`)) {
      return;
    }

    for (const jobId of jobIds) {
      const result = await deleteJobById(jobId);
      if (result.success) {
        handleJobDeleted(jobId);
      }
    }
  };

  return (
    <div className="job-list">
      {jobs.map((job) => (
        <div key={job.id} className="job-card">
          <h3>{job.title}</h3>
          <p>{job.position_summary}</p>
          <div className="job-actions">
            <button onClick={() => editJob(job.id)}>編集</button>
            <JobDeleteButton
              jobId={job.id}
              jobTitle={job.title}
              onDeleted={handleJobDeleted}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
```

### 一括削除機能の実装例
```typescript
const BulkJobActions = ({ selectedJobIds, onBulkDeleted }) => {
  const { deleteJobById, isDeleting } = useJobDelete();
  const [deletingCount, setDeletingCount] = useState(0);

  const handleBulkDelete = async () => {
    if (selectedJobIds.length === 0) {
      alert('削除する求人を選択してください');
      return;
    }

    if (!confirm(`${selectedJobIds.length}件の求人を削除しますか？\n削除した求人は復元できません。`)) {
      return;
    }

    setDeletingCount(0);
    const deletedIds: string[] = [];

    for (let i = 0; i < selectedJobIds.length; i++) {
      const jobId = selectedJobIds[i];
      setDeletingCount(i + 1);
      
      const result = await deleteJobById(jobId);
      if (result.success) {
        deletedIds.push(jobId);
      }
    }

    if (onBulkDeleted) {
      onBulkDeleted(deletedIds);
    }

    alert(`${deletedIds.length}件の求人を削除しました`);
    setDeletingCount(0);
  };

  return (
    <div className="bulk-actions">
      <button 
        onClick={handleBulkDelete}
        disabled={isDeleting || selectedJobIds.length === 0}
        className="bulk-delete-button"
      >
        {isDeleting 
          ? `削除中... (${deletingCount}/${selectedJobIds.length})`
          : `選択した${selectedJobIds.length}件を削除`
        }
      </button>
    </div>
  );
};
```

## エラーハンドリング
- 求人IDが未指定の場合は400エラー
- 認証トークンが無効または未提供の場合は401エラー
- 存在しない求人IDの場合は404エラー
- 他社の求人を削除しようとした場合は403エラー
- サーバーエラーは500ステータス
- フロントエンドでは適切にエラーメッセージを表示すること

## セキュリティ考慮事項
- 認証されたユーザーは自社の求人のみ削除可能
- 求人の所有権を確認してから削除を実行
- 削除操作は不可逆的なため、確認ダイアログを推奨
- HTTPS必須

## UX考慮事項
- 削除前に必ず確認ダイアログを表示
- 削除が不可逆的であることをユーザーに明示
- 削除中はローディング状態を表示
- 削除成功後は適切なフィードバックを提供
- 一括削除機能がある場合は進捗表示を検討

## パフォーマンス考慮事項
- 単一の削除操作は軽量
- 一括削除の場合は適切な進捗表示とエラーハンドリング
- 削除後は関連するキャッシュをクリア

## 使用シナリオ
1. **個別削除**: 求人詳細画面や一覧から単一求人を削除
2. **一括削除**: 求人管理画面で複数求人を一度に削除
3. **整理・清掃**: 古い求人や不要な求人の削除
4. **誤投稿の修正**: 間違って投稿した求人の削除

## 注意事項
- 削除された求人は完全に除去され、復元不可能
- 削除確認は必須（UIレベルで実装）
- 応募者がいる求人の削除は慎重に検討すること
- 削除ログの記録を検討（監査目的）
- 関連する画像ファイルなどのクリーンアップも考慮 