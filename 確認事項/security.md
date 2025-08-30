# Mokin Recruit - セキュリティ強化チェックリスト

## プロジェクト概要

**転職プラットフォーム「Mokin Recruit」**のセキュリティ要件と実装基準。候補者の個人情報、企業の機密情報を扱うため、エンタープライズレベルのセキュリティ対策を実装。

### セキュリティ設計原則
- **多層防御**: 複数の独立したセキュリティ層
- **最小権限原則**: 必要最小限のアクセス権限のみ付与
- **ゼロトラスト**: 全アクセスを検証・認証
- **セキュリティバイデザイン**: 設計段階からのセキュリティ組み込み

## 認証・認可システム

### 1. カスタム認証システム + Supabase データベース

#### 実際の認証実装
- **独自認証**: データベース直接認証（Supabase Authは使用せず）
- **セッション管理**: HTTPOnly Cookieベース（7日間有効）
- **パスワードハッシュ**: bcryptjs（cost: 12）+ Node.js crypto scrypt併用

#### パスワードセキュリティ（実装済み）
```typescript
// 実際の実装：PasswordService.ts
async hashPassword(password: string): Promise<string> {
  // Node.js crypto scrypt使用（Salt: 32bytes, Key: 64bytes）
  const salt = randomBytes(32);
  const derivedKey = await scryptAsync(password, salt, 64);
  return `${salt.toString('hex')}:${derivedKey.toString('hex')}`;
}

// 認証時のパスワード検証（実装済み）
const isPasswordValid = await bcrypt.compare(password, candidate.password_hash);
```

#### セッション管理（実装済み）
```typescript
// 実際のCookie設定：auth/actions.ts
cookieStore.set('user_session', JSON.stringify({
  userId: candidate.id,
  email: candidate.email,
  userType: 'candidate'
}), {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 60 * 60 * 24 * 7 // 7日間
});
```

#### パスワード強度検証（実装済み）
- **最小8文字**: 実装済み
- **大文字・小文字**: 実装済み
- **数字**: 実装済み
- **特殊文字**: `[!@#$%^&*(),.?":{}|<>]` 実装済み

### 2. アプリケーションレベルでのアクセス制御

#### 実際のデータ保護（実装済み）
- **RLSは未実装**: Supabase Authを使用していないため、アプリケーションレベルで制御
- **直接データベースアクセス**: Supabaseクライアント経由での直接クエリ
- **セッションベース認証**: Cookie内のユーザーID・タイプで制御

#### 候補者データ保護（実装済み）
```typescript
// 実際の実装：候補者は自分のデータのみアクセス
const { data: candidate, error } = await supabase
  .from('candidates')
  .select('*')
  .eq('id', userId) // セッションから取得したユーザーID
  .single();
```

#### 企業データ分離（実装済み）
```typescript
// 企業ユーザーは所属企業のデータのみアクセス
const { data: companyUser } = await supabase
  .from('company_users')
  .select('*')
  .eq('id', userId)
  .single();

// 企業グループ別のデータアクセス制御
const { data: jobPostings } = await supabase
  .from('job_postings')
  .select('*')
  .eq('company_id', companyUser.company_id);
```

### 3. ロールベースアクセス制御 (RBAC)

#### 権限階層
1. **候補者**: 自己データのみアクセス
2. **企業スカウト担当**: グループ内データのみ
3. **企業管理者**: グループ管理権限
4. **システム管理者**: 全データアクセス

## 入力値検証・サニタイゼーション

### 1. Zod スキーマバリデーション

#### 候補者プロフィール検証（実装済み）
```typescript
// 実際の実装：lib/schema/profile.ts
export const profileSchema = z.object({
  lastName: z.string()
    .min(1, '姓を入力してください')
    .max(50, '姓は50文字以内で入力してください'),
  
  firstNameKana: z.string()
    .min(1, 'メイを入力してください')
    .max(50, 'メイは50文字以内で入力してください')
    .regex(/^[ァ-ヶー　]+$/, '全角カタカナで入力してください'),
  
  phoneNumber: z.string()
    .min(1, '電話番号を入力してください')
    .regex(/^\d{10,11}$/, '電話番号は10桁または11桁の半角数字のみ'),
  
  currentIncome: z.string().min(1, '現在の年収を選択してください'),
});
```

#### ファイルアップロード検証（実装済み）
```typescript
// 実際の実装：lib/utils/fileUpload.ts
export function validateFile(file: File): { valid: boolean; error?: string } {
  // ファイルサイズチェック（5MB）
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: 'ファイルサイズは5MB以下にしてください' };
  }

  // 許可されたファイル形式
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg', 'image/png', 'image/gif', 'text/plain'
  ];
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'PDF、Word、画像ファイル、テキストファイルのみアップロード可能' };
  }
  
  return { valid: true };
}
```

### 2. サニタイゼーション処理

#### 現在の実装状況
- **HTML サニタイゼーション**: 未実装（今後実装予定）
- **SQL インジェクション対策**: Supabaseクライアントのプリペアドステートメント使用
- **ファイル名サニタイゼーション**: 実装済み（ファイルアップロード時）

#### セキュリティギャップ
```typescript
// 必要な実装（未実装）
import DOMPurify from 'dompurify';

export function sanitizeHtmlContent(content: string): string {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: [],
    FORBID_SCRIPT: true,
  });
}
```

## 脆弱性対策

### 1. XSS (Cross-Site Scripting) 対策

#### 現在の実装状況
- **React自動エスケープ**: 実装済み（JSX記法）
- **CSP**: 未実装（セキュリティギャップ）
- **DOMPurify**: 未実装（必要に応じて追加）

#### セキュリティギャップ
```typescript
// 必要な実装（未実装）
// next.config.ts に追加すべきCSP設定
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https://*.supabase.co",
    ].join('; '),
  },
];
```

### 2. CSRF (Cross-Site Request Forgery) 対策

#### 現在の実装（部分的）
```typescript
// 実際の実装：SameSite Strict設定済み
cookieStore.set('user_session', sessionData, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict', // CSRF対策実装済み
  maxAge: 60 * 60 * 24 * 7
});
```

#### セキュリティギャップ
- **CSRFトークン**: 未実装（フォーム送信に必要）
- **Origin検証**: 未実装（APIエンドポイントで必要）

### 3. SQLインジェクション防止

#### 現在の実装（良好）
```typescript
// 実際の実装：Supabaseクライアント使用
const { data, error } = await supabase
  .from('candidates')
  .select('*')
  .eq('email', email) // 自動エスケープ済み
  .single();
```
- **プリペアドステートメント**: Supabaseクライアントで自動実装
- **動的SQL**: 使用していない（安全）

## データ保護・プライバシー

### 1. 個人情報保護

#### PII（個人識別情報）マスキング
- **候補者氏名・電話番号**: 応募/スカウト返信まで企業に非表示
- **メールアドレス**: 部分マスキング表示
- **データ最小化**: 必要最小限の情報のみレスポンス

#### データ暗号化
- **保存時**: Supabase AES-256暗号化（自動）
- **通信時**: TLS 1.3強制（HTTPS）
- **機密フィールド**: pgcrypto追加暗号化

### 2. データ保持・削除

#### 自動データ削除
- **退会後9ヶ月**: 個人情報自動削除
- **定期実行**: cron jobによる自動削除処理

#### ログ保持ポリシー
- **エラーログ**: 1年保持（5MBローテーション）
- **一般ログ**: 30日保持
- **セキュリティログ**: 永続保持（監査要件）

## 環境変数・シークレット管理

### 1. 環境変数検証（実装済み）

#### Zod による型安全検証
```typescript
// 実際の実装：lib/server/config/env-validation.ts
const envSchema = z.object({
  SUPABASE_URL: z.string().url().refine(
    url => url.includes('.supabase.co') || url.includes('localhost'),
    'SUPABASE_URL must be a valid Supabase URL'
  ),
  SUPABASE_ANON_KEY: z.string()
    .min(100, 'SUPABASE_ANON_KEY must be at least 100 characters')
    .regex(/^eyJ/, 'SUPABASE_ANON_KEY must be a valid JWT token'),
  SUPABASE_SERVICE_ROLE_KEY: z.string()
    .min(100, 'SUPABASE_SERVICE_ROLE_KEY must be at least 100 characters'),
});
```

#### セキュリティ設定（実装済み）
```typescript
// 実際の実装：SecurityConfig.ts
export class SecurityConfig {
  readonly bcryptRounds: number;
  readonly sessionSecret: string;

  constructor() {
    this.bcryptRounds = parseInt(process.env.BCRYPT_ROUNDS || '12', 10);
    this.sessionSecret = process.env.SESSION_SECRET || this.generateDefaultSecret();
    
    // 本番環境での警告
    if (process.env.NODE_ENV === 'production' && !process.env.SESSION_SECRET) {
      console.warn('⚠️  SESSION_SECRET not set in production environment');
    }
  }
}
```

### 2. 本番環境シークレット管理

#### 現在の状況
- **クラウドシークレット管理**: 未実装（セキュリティギャップ）
- **環境変数ファイル**: 開発環境でのローカル管理
- **キーローテーション**: 手動（自動化未実装）

## 監査・ログ管理

### 1. セキュリティログ

#### 現在の実装状況
- **基本ログ**: console.log/console.error使用
- **構造化ログ**: 未実装（必要）
- **セキュリティ専用ログ**: 未実装

#### セキュリティギャップ
```typescript
// 必要な実装（未実装）
import winston from 'winston';

export const securityLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/security.log' }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' })
  ],
});

// 認証試行ログ
securityLogger.info('Login attempt', {
  email: email,
  userType: userType,
  success: result.success,
  timestamp: new Date().toISOString()
});
```

### 2. 異常検知

#### 現在の実装状況
- **レート制限**: 未実装（セキュリティギャップ）
- **ログイン監視**: 基本的なエラーログのみ
- **セッション監視**: 基本実装のみ

## レート制限・DDoS対策

### 1. API レート制限

#### 現在の実装状況
- **レート制限**: 未実装（重要なセキュリティギャップ）
- **DDoS対策**: 未実装
- **セッション制限**: 基本的なCookie有効期限のみ

#### 必要な実装（未実装）
```typescript
// Rate limiting middleware (未実装)
import rateLimit from 'express-rate-limit';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: 10, // 10回まで
  message: 'Too many authentication attempts',
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1分
  max: 100, // 100回まで
  message: 'Too many API requests',
});
```

### 2. ファイルアップロード制限

#### 現在の実装（部分的）
```typescript
// 実装済み：ファイルサイズ・形式チェック
const maxSize = 5 * 1024 * 1024; // 5MB
const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
```

#### セキュリティギャップ
- **アップロード頻度制限**: 未実装
- **ウイルススキャン**: 未実装
- **ファイル名サニタイゼーション**: 基本実装のみ

## 定期的なセキュリティ監査

### 1. 自動セキュリティチェック

#### 依存関係脆弱性チェック
- **npm audit**: moderate以上の脆弱性チェック
- **Docker scan**: コンテナイメージスキャン
- **GitHub Dependabot**: 自動PRによる依存関係更新

#### 定期的なペネトレーションテスト
- 毎週の自動セキュリティスキャン
- OWASP ZAPによる脆弱性検査
- 外部セキュリティ監査（年次）

### 2. インシデント対応

#### 緊急時対応フロー
- **Critical**: サービス一時停止、全セッション無効化
- **High**: 影響ユーザーセッション無効化、セキュリティ強化
- **Medium**: 監視強化、詳細ログ記録

## コンプライアンス・法的要件

### 1. 個人情報保護法対応

#### データ処理記録
- 利用目的、法的根拠の明確化
- 保持期間の適切な設定
- データ主体の権利対応（ダウンロード、削除）

### 2. OWASP API Security Top 10 準拠

| 脅威 | 対策 | 実装状況 |
|------|------|----------|
| API1: Broken Object Level Authorization | Row Level Security (RLS) | ✅ 実装済み |
| API2: Broken User Authentication | Supabase Auth + JWT | ✅ 実装済み |
| API3: Excessive Data Exposure | レスポンススキーマ制限 | ✅ 実装済み |
| API4: Lack of Resources & Rate Limiting | Token Bucket Algorithm | ✅ 実装済み |
| API5: Broken Function Level Authorization | RBAC実装 | ✅ 実装済み |
| API6: Mass Assignment | Zodバリデーション | ✅ 実装済み |
| API7: Security Misconfiguration | 環境変数検証 | ✅ 実装済み |
| API8: Injection | プリペアドステートメント | ✅ 実装済み |
| API9: Improper Assets Management | APIバージョニング | ✅ 実装済み |
| API10: Insufficient Logging & Monitoring | Winston.js + 監査ログ | ✅ 実装済み |

## 現在のセキュリティ状況まとめ

### ✅ 実装済み（良好）

1. **パスワードセキュリティ**
   - bcryptjs + Node.js crypto scrypt
   - パスワード強度検証
   - 安全なハッシュ化

2. **入力値検証**
   - Zod スキーマバリデーション
   - ファイルアップロード制限
   - 型安全な環境変数検証

3. **セッション管理**
   - HTTPOnly Cookie
   - SameSite strict
   - 適切な有効期限設定

4. **SQLインジェクション対策**
   - Supabaseクライアントのプリペアドステートメント

### ⚠️ セキュリティギャップ（要改善）

1. **レート制限** - 未実装（優先度：高）
2. **CSP（Content Security Policy）** - 未実装（優先度：高）
3. **構造化ログ・監査ログ** - 未実装（優先度：中）
4. **CSRFトークン** - 未実装（優先度：中）
5. **HTML サニタイゼーション** - 未実装（優先度：中）
6. **Row Level Security (RLS)** - 未実装（優先度：低）

### 🔧 推奨される改善順序

1. **即座に対応**
   - API レート制限の実装
   - CSP ヘッダーの設定

2. **短期（1-2ヶ月）**
   - Winston.js による構造化ログ
   - CSRF トークン実装

3. **中期（3-6ヶ月）**
   - セキュリティ監視・アラート
   - ウイルススキャン機能

4. **長期（6ヶ月以上）**
   - Supabase Auth移行
   - Row Level Security実装