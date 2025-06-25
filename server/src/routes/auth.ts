import { Router } from 'express';
import { AuthController } from '@/controllers/AuthController';
import { resolve } from '@/container';

const router = Router();

// DIコンテナからAuthControllerを解決するヘルパー関数
const getAuthController = (): AuthController => {
  try {
    return resolve<AuthController>('AuthController');
  } catch (error) {
    // DIコンテナが初期化されていない場合のエラー
    throw new Error(
      'AuthController is not available. DI container may not be initialized.'
    );
  }
};

/**
 * @swagger
 * /api/auth/register/candidate:
 *   post:
 *     tags: [Authentication]
 *     summary: 候補者の新規登録
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - lastName
 *               - firstName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               lastName:
 *                 type: string
 *               firstName:
 *                 type: string
 *     responses:
 *       201:
 *         description: 登録成功
 *       400:
 *         description: バリデーションエラー
 *       409:
 *         description: メールアドレス重複
 */
router.post('/register/candidate', (req, res) =>
  getAuthController().registerCandidate(req, res)
);

/**
 * @swagger
 * /api/auth/register/company:
 *   post:
 *     tags: [Authentication]
 *     summary: 企業ユーザーの新規登録
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - fullName
 *               - companyAccountId
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               fullName:
 *                 type: string
 *               companyAccountId:
 *                 type: string
 *     responses:
 *       201:
 *         description: 登録成功
 *       400:
 *         description: バリデーションエラー
 *       409:
 *         description: メールアドレス重複
 */
router.post('/register/company', (req, res) =>
  getAuthController().registerCompanyUser(req, res)
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: ログイン
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: ログイン成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: 認証失敗
 */
router.post('/login', (req, res) => getAuthController().login(req, res));

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags: [Authentication]
 *     summary: ログアウト
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ログアウト成功
 */
router.post('/logout', (req, res) => getAuthController().logout(req, res));

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     tags: [Authentication]
 *     summary: トークンリフレッシュ
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: リフレッシュ成功
 *       401:
 *         description: 無効なトークン
 */
router.post('/refresh', (req, res) =>
  getAuthController().refreshToken(req, res)
);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     tags: [Authentication]
 *     summary: パスワードリセット要求
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: リセットメール送信
 *       404:
 *         description: ユーザーが見つからない
 */
router.post('/forgot-password', (req, res) =>
  getAuthController().forgotPassword(req, res)
);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     tags: [Authentication]
 *     summary: パスワードリセット
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: パスワードリセット成功
 *       400:
 *         description: 無効なトークン
 */
router.post('/reset-password', (req, res) =>
  getAuthController().resetPassword(req, res)
);

// メール認証は現在Supabase Authで自動処理されるため、エンドポイントは削除
// 必要に応じてSupabase Auth Webhookを使用してメール認証完了を処理

export default router;
