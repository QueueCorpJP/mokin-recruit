import { Router } from 'express';

const router = Router();

// メッセージ一覧
router.get('/', (_req, res) => {
  res.json({
    message: 'メッセージ一覧 - 実装予定',
    data: {
      messages: [],
      totalCount: 0,
    },
  });
});

// メッセージ詳細取得
router.get('/:id', (req, res) => {
  res.json({ message: `メッセージ詳細取得 ID: ${req.params.id} - 実装予定` });
});

// メッセージ送信
router.post('/', (_req, res) => {
  res.json({
    message: 'メッセージ送信 - 実装予定',
    data: {
      id: 'test-message-id',
      content: 'テストメッセージ',
      sentAt: new Date().toISOString(),
    },
  });
});

// メッセージ返信
router.post('/:id/reply', (req, res) => {
  res.json({ message: `メッセージ返信 ID: ${req.params.id} - 実装予定` });
});

// メッセージ既読
router.put('/:id/read', (req, res) => {
  res.json({ message: `メッセージ既読 ID: ${req.params.id} - 実装予定` });
});

// メッセージ削除
router.delete('/:id', (req, res) => {
  res.json({ message: `メッセージ削除 ID: ${req.params.id} - 実装予定` });
});

// スカウト一覧
router.get('/scouts', (_req, res) => {
  res.json({ message: 'スカウト一覧 - 実装予定' });
});

// スカウト送信
router.post('/scouts', (_req, res) => {
  res.json({
    message: 'スカウト送信 - 実装予定',
    data: {
      id: 'test-scout-id',
      candidateId: 'test-candidate-id',
      sentAt: new Date().toISOString(),
    },
  });
});

// スカウト承諾
router.post('/scouts/:id/accept', (req, res) => {
  res.json({ message: `スカウト承諾 ID: ${req.params.id} - 実装予定` });
});

// スカウト辞退
router.post('/scouts/:id/decline', (req, res) => {
  res.json({ message: `スカウト辞退 ID: ${req.params.id} - 実装予定` });
});

// 未読メッセージ数
router.get('/unread/count', (_req, res) => {
  res.json({ message: '未読メッセージ数 - 実装予定' });
});

// メッセージテンプレート一覧
router.get('/templates', (_req, res) => {
  res.json({ message: 'メッセージテンプレート一覧 - 実装予定' });
});

// メッセージテンプレート作成
router.post('/templates', (_req, res) => {
  res.json({
    message: 'メッセージテンプレート作成 - 実装予定',
    data: {
      id: 'test-template-id',
      title: 'テストテンプレート',
      createdAt: new Date().toISOString(),
    },
  });
});

// メッセージテンプレート更新
router.put('/templates/:id', (req, res) => {
  res.json({ message: `メッセージテンプレート更新 ID: ${req.params.id} - 実装予定` });
});

// メッセージテンプレート削除
router.delete('/templates/:id', (req, res) => {
  res.json({ message: `メッセージテンプレート削除 ID: ${req.params.id} - 実装予定` });
});

export default router; 