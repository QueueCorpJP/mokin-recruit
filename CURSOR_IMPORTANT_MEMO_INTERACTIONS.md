# 🏗️ Mokin Recruit SOLID原則改善メモ

## 🚀 **Next.js API Routes移行完了** (2025-01-28)

### ✅ **移行完了項目**

#### **1. 基盤インフラストラクチャ移行**

```typescript
client/src/lib/server/
├── controllers/
│   └── AuthController.ts     # ✅ Express.jsからNext.js対応版に移行
├── container/
│   ├── types.ts              # ✅ DIコンテナ型定義移行
│   ├── container.ts          # ✅ DIコンテナ実装移行
│   └── index.ts              # ✅ エクスポート統合
└── utils/
    └── logger.ts             # ✅ Winstonロガー移行
```

#### **2. Next.js API Routes実装**

```typescript
client/src/app/api/auth/
├── register/
│   ├── candidate/route.ts    # ✅ 候補者登録API Route
│   └── company/route.ts      # ✅ 企業ユーザー登録API Route
├── login/route.ts            # ✅ ログインAPI Route
└── logout/route.ts           # ✅ ログアウトAPI Route
```

#### **3. 依存関係・設定更新**

- **package.json**: サーバーサイド依存関係追加
  - `@supabase/supabase-js`, `inversify`, `winston`, `bcryptjs`, `jsonwebtoken`
- **tsconfig.json**: Decorator設定とパスエイリアス追加
  - `experimentalDecorators: true`, `emitDecoratorMetadata: true`
  - `@/lib/server/*` パスマッピング

### 🔧 **技術的設計方針**

#### **Express.js → Next.js 移行戦略**

1. **Mock Request/Response Pattern**: Express.jsのReq/Resを模擬オブジェクトで包装
2. **DIコンテナ保持**: Inversifyベースの依存性注入を維持
3. **SOLID原則継承**: 既存のアーキテクチャ設計を保持

#### **API Routes最適化**

```typescript
// Next.js API Route標準パターン
export async function POST(request: NextRequest) {
  await initializeDI(); // DIコンテナ初期化
  const body = await request.json(); // リクエスト解析
  const controller = resolve<AuthController>('AuthController');

  // Express.js互換レイヤー
  const mockReq = { body } as any;
  const mockRes = {
    status: (code: number) => mockRes,
    json: (data: any) => (responseData = data),
  } as any;

  await controller.method(mockReq, mockRes);
  return NextResponse.json(responseData, { status: statusCode });
}
```

### 🎯 **次期移行対象**

#### **Phase 4: 残存サーバーロジック移行 (予定)**

```typescript
// 移行予定項目
client/src/lib/server/
├── auth/
│   └── supabaseAuth.ts       # 🔄 Supabase認証ロジック
├── config/
│   ├── security.ts           # 🔄 セキュリティ設定
│   └── database.ts           # 🔄 データベース設定
├── core/
│   ├── interfaces/           # 🔄 インターフェース定義
│   └── services/             # 🔄 ビジネスロジックサービス
└── infrastructure/
    └── database/             # 🔄 リポジトリ実装
```

#### **Phase 5: API Routes拡張**

```typescript
client/src/app/api/
├── candidates/route.ts       # 🔄 候補者管理API
├── companies/route.ts        # 🔄 企業管理API
├── jobs/route.ts             # 🔄 求人管理API
├── messages/route.ts         # 🔄 メッセージAPI
└── admin/route.ts            # 🔄 管理者API
```

### 📊 **移行効果の評価**

#### **✅ 改善された点**

1. **統合性向上**: フロントエンド・バックエンド統合による開発効率化
2. **デプロイ簡素化**: 単一Next.jsアプリケーションとしてのデプロイ
3. **型安全性**: サーバー・クライアント間の型共有強化
4. **開発体験**: Hot Reloadによるフルスタック開発

#### **⚠️ 注意事項**

1. **メモリ使用量**: サーバーロジックがクライアント側に統合
2. **Cold Start**: サーバーレス環境でのDIコンテナ初期化
3. **セキュリティ**: 機密情報の適切な環境変数管理

---

## 📋 現在の主要な問題点

### 🔴 Single Responsibility Principle (SRP) 違反

1. **`server/src/index.ts`** (230行) → **廃止予定**

   - アプリケーション起動
   - 設定管理
   - ルーティング設定
   - データベース初期化
   - ミドルウェア設定

2. **`AuthController.ts`** (385行) → **✅ Next.js移行完了**
   - 候補者登録
   - 企業ユーザー登録
   - ログイン処理
   - パスワードリセット
   - トークン管理

### 🔴 Dependency Inversion Principle (DIP) 違反

- ~~コントローラーがPrismaクライアントに直接依存~~ → **✅ 解決済み**
- Supabaseクライアントへの具象的な依存 → **🔄 移行中**
- DIコンテナの未実装 → **✅ 完了**

### 🔴 Open/Closed Principle (OCP) 違反

- 新しいユーザータイプ追加時の既存コード修正が必要 → **🔄 改善中**
- データベース変更時の大幅な修正が必要 → **🔄 リポジトリパターンで改善**

## 🗑️ 負債ファイル削除完了 (2025-06-24)

### ✅ 削除済みファイル

- **環境設定ファイル群**: `.env.backup*`, `.env.old`, `.env.failed_direct`, `.env.direct`,
  `.env.pool_failed`
- **Prisma関連ファイル**: `server/prisma/`, `server/migration_preview.sql`,
  `server/src/database/connection.ts`
- **空ディレクトリ**: `server/src/demo/`
- **package.json**: `@prisma/client` 依存関係削除

### ✅ 新規作成ファイル

- **`server/.gitignore`**: ログファイルと環境設定ファイルの除外設定
- **`server/src/infrastructure/database/SupabaseRepository.ts`**: Supabaseベースリポジトリクラス
- **`server/src/infrastructure/database/CandidateRepository.ts`**: 候補者リポジトリ実装

### 🎯 削除理由

1. **セキュリティリスク**: 複数の環境設定ファイルに機密情報が散在
2. **使用不可**: Supabase Pro制限によりPrismaマイグレーション不可
3. **混乱防止**: 開発者がどの設定・ツールを使うべきか明確化
4. **保守負債**: 556行のPrismaスキーマファイルが無駄に存在

## 🚀 段階的改善計画

### Phase 1: 設定の分離 (即座に実行可能)

```typescript
// server/src/config/
├── app.config.ts          // アプリケーション設定
├── database.config.ts     // データベース設定
├── security.config.ts     // セキュリティ設定
└── swagger.config.ts      // API仕様設定
```

### Phase 2: サービス層の導入

```typescript
// server/src/services/
├── auth.service.ts        // 認証専用サービス
├── password.service.ts    // パスワード管理サービス
├── registration.service.ts // ユーザー登録サービス
└── token.service.ts       // トークン管理サービス
```

### Phase 3: リポジトリパターンの適用 ✅ 開始済み

```typescript
// server/src/infrastructure/database/
├── SupabaseRepository.ts     // 基底リポジトリ ✅
├── CandidateRepository.ts    // 候補者リポジトリ ✅
├── CompanyRepository.ts      // 企業リポジトリ
└── JobRepository.ts          // 求人リポジトリ
```

### Phase 4: コントローラーの分離

```typescript
// server/src/controllers/
├── auth/
│   ├── login.controller.ts
│   ├── registration.controller.ts
│   └── password.controller.ts
├── candidate.controller.ts
├── company.controller.ts
└── job.controller.ts
```

## 🔧 実装上の注意点

### ESLint設定の調整が必要

- `process` オブジェクトの型定義
- Node.js環境変数の適切な型付け
- TypeScript設定の最適化

### 段階的移行戦略

1. **既存機能を維持**しながら新しいアーキテクチャを並行導入
2. **テストケース**を先に作成してリファクタリングの安全性を確保
3. **一つずつ**クラスを移行してリスクを最小化

## 📊 期待される効果

### ✅ 短期的な改善

- コードの可読性向上
- 責任の明確化
- 並行開発の促進
- **セキュリティ向上**: 環境設定ファイルの整理
- **開発環境の明確化**: Supabase専用アーキテクチャ

### ✅ 長期的な利益

- 機能追加時の影響範囲限定
- テストカバレッジの向上
- チーム開発効率の向上

## 🎯 次のアクション

1. **設定クラスの分離** (最優先)
2. **認証サービスの分割**
3. **リポジトリパターンの段階的導入** ✅ 開始済み
4. **DIコンテナの実装検討** ✅ **完了**

---

_現在の開発を停止せずに段階的に改善可能な計画です。_

# 🎯 Cursor重要メモ - 技術的制約分析と対応戦略

## 📋 **技術的制約の厳密な分析結果**

### 🔴 **重大な技術的制約 (開発阻害要因)**

#### 1. **Supabase Pro Plan制限** ⚠️ **最重要**

- **制約**: 直接PostgreSQL接続禁止 (`FATAL: Tenant or user not found`)
- **影響**: Prismaマイグレーション不可、ORMアクセス制限
- **対応**: Supabase Client Library採用、手動SQL実行

#### 2. **WSL2 IPv6接続問題** ⚠️ **環境依存**

- **制約**: `Network is unreachable` エラー
- **影響**: 直接DB接続の不安定性
- **対応**: Pooler接続強制、DNS設定(8.8.8.8)

#### 3. **ファイル権限問題** ⚠️ **Docker/WSL2特有**

- **制約**: `node_modules` がroot権限で作成
- **影響**: npm install実行不可
- **対応**: `sudo chown -R suda:suda node_modules/` ✅ **解決済み**

#### 4. **依存関係の不整合** ⚠️ **パッケージ管理**

- **制約**: 必須パッケージ不足、バージョン競合
- **影響**: ビルドエラー、型安全性欠如
- **対応**: 依存関係修正完了 ✅ **解決済み**

#### 5. **レガシーコードの残存** ⚠️ **技術的負債**

- **制約**: Prisma関連コードが残存
- **影響**: ビルドエラー、実行時エラー
- **対応**: 段階的リファクタリング必要 🔄 **進行中**

### 🟡 **中程度の制約 (運用に影響)**

#### 6. **Docker環境の複雑性**

- IPv6ネットワーク設定
- 複数サービス依存関係
- ボリュームマウント設定

#### 7. **環境変数管理の分散**

- ルート/.env と server/.env の二重管理
- 機密情報の適切な管理
- Docker環境との同期

#### 8. **TypeScript設定の不整合**

- 型定義ファイルの参照問題
- パス設定の複雑性

### 🟢 **軽微な制約 (改善対象)**

#### 9. **ログ管理**

- ログファイルの蓄積
- Git管理の除外設定

#### 10. **パッケージ管理**

- 不要な依存関係の残存
- セキュリティ脆弱性の潜在リスク

## 🚀 **修正済み依存関係**

### ✅ **成功した修正**

```bash
# 追加されたパッケージ
inversify@6.2.2          # DI コンテナ
reflect-metadata@0.2.2   # メタデータリフレクション
bcryptjs@2.4.3          # パスワードハッシュ化
@types/node@20.19.1     # Node.js型定義

# 削除されたパッケージ
@prisma/client@5.22.0   # Prisma ORM (Supabase制限により不要)
prisma@5.22.0          # Prisma CLI (同上)
```

### 🔄 **残存する問題**

1. **AuthController.ts**: Prisma参照の除去必要
2. **CandidateRepository.ts**: `findByCriteria` メソッド実装必要
3. **全般**: Supabase Client への移行作業

## 🎯 **段階別対応戦略**

### **Phase 1: 緊急修復** (今日中) ⚡

**目標**: ビルドエラーの解消

**実施内容**:

1. **AuthController修正**: Prisma → Supabase Client移行
2. **Repository完成**: 不足メソッドの実装
3. **ビルド確認**: `npm run build` 成功確認

**成功指標**:

- ビルドエラー 0件
- 型チェック通過
- 基本的な起動確認

### **Phase 2: 基盤安定化** (1-2日)

**目標**: 開発環境の完全安定化

**実施内容**:

1. **環境変数統一**: 単一ファイル管理
2. **Docker最適化**: 権限問題の根本解決
3. **接続テスト**: Supabase接続の安定性確認

### **Phase 3: アーキテクチャ改善** (1週間)

**目標**: SOLID原則準拠の基盤構築

**実施内容**:

1. **設定クラス分離**: AppConfig, DatabaseConfig
2. **サービス層導入**: ビジネスロジック抽象化
3. **テスト環境**: 単体テスト実行環境

### **Phase 4: 機能開発** (2-3週間)

**目標**: 核心機能の実装

## 🚨 **重要な制約への対応方針**

### **Supabase Pro Plan制限への対応**

1. **データベース管理**:

   - Supabase Dashboard での手動SQL実行
   - `database_schema.sql` による一括作成
   - バージョン管理はGitで実施

2. **ORM戦略**:

   - Prisma完全廃止
   - Supabase Client Library採用
   - Repository Pattern による抽象化

3. **開発ワークフロー**:
   - スキーマ変更は手動実行
   - 本番反映は慎重に段階実施
   - バックアップ戦略の確立

### **WSL2環境への対応**

1. **接続安定性**:

   - Pooler接続の強制使用
   - DNS設定の最適化
   - 接続エラーの監視

2. **権限管理**:
   - Docker実行前の権限確認
   - 自動化スクリプトの作成
   - 定期的なメンテナンス

## 📊 **現在の技術スタック**

### **確定技術**

- **Runtime**: Node.js 18.19.1
- **Framework**: Express.js 4.21.2
- **Language**: TypeScript 5.8.3
- **Database**: Supabase PostgreSQL (Pro Plan)
- **ORM**: Supabase Client Library 2.50.0
- **Authentication**: JWT + bcryptjs
- **Container**: Docker + Docker Compose
- **Environment**: WSL2 Ubuntu 24.04.2

### **開発ツール**

- **DI Container**: inversify 6.2.2
- **Validation**: express-validator 7.2.1
- **Testing**: Jest 29.7.0
- **Logging**: winston 3.17.0
- **Documentation**: Swagger

## 🔄 **次回実施項目**

### **即座に実行**

1. AuthController のPrisma参照除去
2. CandidateRepository の完成
3. ビルド成功確認

### **短期実施**

1. 環境変数の統一管理
2. Docker権限問題の根本解決
3. Supabase接続の安定性テスト

---

**最終更新**: 2025-06-24 17:15 JST **制約分析**: 10項目特定、4項目解決済み、6項目対応中
