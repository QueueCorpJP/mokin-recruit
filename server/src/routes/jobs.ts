import { Router } from 'express';

const router = Router();

// 求人一覧取得（公開求人）
router.get('/', (_req, res) => {
  res.json({ message: '求人一覧取得 - 実装予定' });
});

// 求人検索
router.get('/search', (_req, res) => {
  res.json({
    message: '求人検索 - 実装予定',
    data: {
      jobs: [],
      totalCount: 0,
      currentPage: 1,
      totalPages: 1,
    },
  });
});

// 求人詳細取得
router.get('/:id', (req, res) => {
  res.json({ message: `求人詳細取得 ID: ${req.params.id} - 実装予定` });
});

// 求人作成（企業ユーザー）
router.post('/', (_req, res) => {
  res.json({
    message: '求人作成 - 実装予定',
    data: {
      id: 'test-job-id',
      title: 'テスト求人',
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
    },
  });
});

// 求人更新（企業ユーザー）
router.put('/:id', (req, res) => {
  res.json({ message: `求人更新 ID: ${req.params.id} - 実装予定` });
});

// 求人削除（企業ユーザー）
router.delete('/:id', (req, res) => {
  res.json({ message: `求人削除 ID: ${req.params.id} - 実装予定` });
});

// 求人公開申請（企業ユーザー）
router.post('/:id/publish-request', (req, res) => {
  res.json({ message: `求人公開申請 ID: ${req.params.id} - 実装予定` });
});

// 求人公開停止（企業ユーザー）
router.post('/:id/unpublish', (req, res) => {
  res.json({ message: `求人公開停止 ID: ${req.params.id} - 実装予定` });
});

// 求人応募者一覧（企業ユーザー）
router.get('/:id/applications', (req, res) => {
  res.json({ message: `求人応募者一覧 ID: ${req.params.id} - 実装予定` });
});

// おすすめ求人（候補者向け）
router.get('/recommendations/for-me', (_req, res) => {
  res.json({ message: 'おすすめ求人 - 実装予定' });
});

// 求人統計情報（企業ユーザー）
router.get('/:id/stats', (req, res) => {
  res.json({ message: `求人統計情報 ID: ${req.params.id} - 実装予定` });
});

// 類似求人（候補者向け）
router.get('/:id/similar', (req, res) => {
  res.json({ message: `類似求人 ID: ${req.params.id} - 実装予定` });
});

export default router; 