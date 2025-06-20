import { Router } from 'express';
import { authMiddleware, requireRole } from '@/middleware/auth';

const router = Router();

// ダッシュボード統計
router.get('/dashboard', (_req, res) => {
  res.json({
    message: '管理者ダッシュボード - 実装予定',
  });
});

// ユーザー管理 - 候補者一覧
router.get('/candidates', (_req, res) => {
  res.json({
    message: '候補者管理 - 実装予定',
    data: {
      totalCandidates: 0,
      activeCandidates: 0,
      newThisMonth: 0,
      candidates: [],
    },
  });
});

// ユーザー管理 - 候補者詳細
router.get('/candidates/:id', (req, res) => {
  res.json({ message: `候補者詳細管理 ID: ${req.params.id} - 実装予定` });
});

// ユーザー管理 - 候補者ステータス変更
router.put('/candidates/:id/status', (req, res) => {
  res.json({ message: `候補者ステータス変更 ID: ${req.params.id} - 実装予定` });
});

// ユーザー管理 - 企業一覧
router.get('/companies', (_req, res) => {
  res.json({
    message: '企業管理 - 実装予定',
    data: {
      totalCompanies: 0,
      activeCompanies: 0,
      newThisMonth: 0,
      companies: [],
    },
  });
});

// ユーザー管理 - 企業詳細
router.get('/companies/:id', (req, res) => {
  res.json({ message: `企業詳細管理 ID: ${req.params.id} - 実装予定` });
});

// ユーザー管理 - 企業ステータス変更
router.put('/companies/:id/status', (req, res) => {
  res.json({ message: `企業ステータス変更 ID: ${req.params.id} - 実装予定` });
});

// 求人管理 - 承認待ち求人一覧
router.get('/jobs/pending', (_req, res) => {
  res.json({
    message: '求人承認待ち - 実装予定',
    data: {
      pendingJobs: [],
      totalPending: 0,
    },
  });
});

// 求人管理 - 求人承認
router.post('/jobs/:id/approve', (req, res) => {
  res.json({ message: `求人承認 ID: ${req.params.id} - 実装予定` });
});

// 求人管理 - 求人却下
router.post('/jobs/:id/reject', (req, res) => {
  res.json({ message: `求人却下 ID: ${req.params.id} - 実装予定` });
});

// 求人管理 - 全求人一覧
router.get('/jobs', (_req, res) => {
  res.json({ message: '求人管理 - 実装予定' });
});

// NGワード管理 - 一覧取得
router.get('/ng-keywords', (_req, res) => {
  res.json({ message: 'NGキーワード管理 - 実装予定' });
});

// NGワード管理 - 追加
router.post('/ng-keywords', (_req, res) => {
  res.json({
    message: 'NGキーワード追加 - 実装予定',
    data: {
      id: 'test-id',
      keyword: 'test-keyword',
      createdAt: new Date().toISOString(),
    },
  });
});

// NGワード管理 - 更新
router.put('/ng-keywords/:id', (req, res) => {
  res.json({ message: `NGワード更新 ID: ${req.params.id} - 実装予定` });
});

// NGワード管理 - 削除
router.delete('/ng-keywords/:id', (req, res) => {
  res.json({ message: `NGワード削除 ID: ${req.params.id} - 実装予定` });
});

// メッセージ監視 - 要確認メッセージ一覧
router.get('/messages/flagged', (_req, res) => {
  res.json({
    message: 'フラグ付きメッセージ - 実装予定',
    data: {
      flaggedMessages: [],
      totalFlagged: 0,
    },
  });
});

// メッセージ監視 - メッセージ承認
router.post('/messages/:id/approve', (req, res) => {
  res.json({ message: `メッセージ承認 ID: ${req.params.id} - 実装予定` });
});

// メッセージ監視 - メッセージ却下
router.post('/messages/:id/reject', (req, res) => {
  res.json({ message: `メッセージ却下 ID: ${req.params.id} - 実装予定` });
});

// お知らせ管理 - 一覧取得
router.get('/announcements', (_req, res) => {
  res.json({ message: 'お知らせ管理 - 実装予定' });
});

// お知らせ管理 - 作成
router.post('/announcements', (_req, res) => {
  res.json({
    message: 'お知らせ作成 - 実装予定',
    data: {
      id: 'test-id',
      title: 'テストお知らせ',
      createdAt: new Date().toISOString(),
    },
  });
});

// お知らせ管理 - 更新
router.put('/announcements/:id', (req, res) => {
  res.json({ message: `お知らせ更新 ID: ${req.params.id} - 実装予定` });
});

// お知らせ管理 - 削除
router.delete('/announcements/:id', (req, res) => {
  res.json({ message: `お知らせ削除 ID: ${req.params.id} - 実装予定` });
});

// システム統計 - レポート取得
router.get('/reports', (_req, res) => {
  res.json({ message: 'レポート - 実装予定' });
});

// システム統計 - 利用状況分析
router.get('/analytics', (_req, res) => {
  res.json({ message: 'アナリティクス - 実装予定' });
});

// メディア記事管理 - 一覧取得
router.get('/articles', (_req, res) => {
  res.json({ message: '記事管理 - 実装予定' });
});

// メディア記事管理 - 作成
router.post('/articles', (_req, res) => {
  res.json({
    message: '記事作成 - 実装予定',
    data: {
      id: 'test-id',
      title: 'テスト記事',
      createdAt: new Date().toISOString(),
    },
  });
});

// メディア記事管理 - 更新
router.put('/articles/:id', (req, res) => {
  res.json({ message: `メディア記事更新 ID: ${req.params.id} - 実装予定` });
});

// メディア記事管理 - 削除
router.delete('/articles/:id', (req, res) => {
  res.json({ message: `メディア記事削除 ID: ${req.params.id} - 実装予定` });
});

// すべてのルートに認証と管理者権限を適用
router.use(authMiddleware);
router.use(requireRole(['ADMIN']));

export default router; 