import { Router } from 'express';

const router = Router();

// 候補者プロフィール取得
router.get('/profile', (_req, res) => {
  res.json({ message: '候補者プロフィール取得 - 実装予定' });
});

// 候補者プロフィール更新
router.put('/profile', (_req, res) => {
  res.json({ message: '候補者プロフィール更新 - 実装予定' });
});

// 求人検索
router.get('/jobs/search', (_req, res) => {
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
router.get('/jobs/:id', (req, res) => {
  res.json({ message: `求人詳細取得 ID: ${req.params.id} - 実装予定` });
});

// 求人応募
router.post('/jobs/:id/apply', (req, res) => {
  res.json({ message: `求人応募 ID: ${req.params.id} - 実装予定` });
});

// お気に入り求人一覧
router.get('/favorites', (_req, res) => {
  res.json({
    message: 'お気に入り求人一覧 - 実装予定',
    data: {
      favorites: [],
      totalCount: 0,
    },
  });
});

// お気に入り追加
router.post('/favorites/:jobId', (req, res) => {
  res.json({ message: `お気に入り追加 Job ID: ${req.params.jobId} - 実装予定` });
});

// お気に入り削除
router.delete('/favorites/:jobId', (req, res) => {
  res.json({ message: `お気に入り削除 Job ID: ${req.params.jobId} - 実装予定` });
});

// 応募履歴
router.get('/applications', (_req, res) => {
  res.json({ message: '応募履歴 - 実装予定' });
});

// スカウト一覧
router.get('/scouts', (_req, res) => {
  res.json({ message: 'スカウト一覧 - 実装予定' });
});

// スカウト返信
router.post('/scouts/:id/reply', (req, res) => {
  res.json({ message: `スカウト返信 ID: ${req.params.id} - 実装予定` });
});

export default router; 