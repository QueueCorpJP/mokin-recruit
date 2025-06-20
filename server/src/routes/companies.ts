import { Router } from 'express';

const router = Router();

// プロフィール取得
router.get('/profile', (_req, res) => {
  res.json({ message: '企業プロフィール取得 - 実装予定' });
});

// プロフィール更新
router.put('/profile', (_req, res) => {
  res.json({ message: '企業プロフィール更新 - 実装予定' });
});

// グループ一覧
router.get('/groups', (_req, res) => {
  res.json({ message: 'グループ一覧 - 実装予定' });
});

// グループ作成
router.post('/groups', (_req, res) => {
  res.json({ message: 'グループ作成 - 実装予定' });
});

// ユーザー招待
router.post('/users/invite', (_req, res) => {
  res.json({ message: 'ユーザー招待 - 実装予定' });
});

// ユーザー一覧
router.get('/users', (_req, res) => {
  res.json({
    message: 'ユーザー一覧 - 実装予定',
    data: {
      users: [],
      totalCount: 0,
    },
  });
});

// 権限管理
router.put('/users/:userId/permissions', (req, res) => {
  res.json({ message: `権限管理 User ID: ${req.params.userId} - 実装予定` });
});

// 候補者検索
router.get('/candidates/search', (_req, res) => {
  res.json({
    message: '候補者検索 - 実装予定',
    data: {
      candidates: [],
      totalCount: 0,
      currentPage: 1,
      totalPages: 1,
    },
  });
});

// 候補者詳細取得
router.get('/candidates/:id', (req, res) => {
  res.json({ message: `候補者詳細取得 ID: ${req.params.id} - 実装予定` });
});

// スカウト送信
router.post('/candidates/:id/scout', (req, res) => {
  res.json({ message: `スカウト送信 ID: ${req.params.id} - 実装予定` });
});

// スカウトチケット一覧
router.get('/scout-tickets', (_req, res) => {
  res.json({ message: 'スカウトチケット一覧 - 実装予定' });
});

// 応募者一覧
router.get('/applications', (_req, res) => {
  res.json({ message: '応募者一覧 - 実装予定' });
});

// 採用進捗更新
router.put('/applications/:id', (req, res) => {
  res.json({ message: `採用進捗更新 ID: ${req.params.id} - 実装予定` });
});

// 面接日程作成
router.post('/applications/:id/interviews', (req, res) => {
  res.json({ message: `面接日程作成 Application ID: ${req.params.id} - 実装予定` });
});

export default router; 