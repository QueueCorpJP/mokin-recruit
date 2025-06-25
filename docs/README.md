# 📚 Mokin Recruit - Documentation Index

## 🎯 ドキュメント構造概要

このドキュメントディレクトリは、Mokin Recruitプロジェクトの全ての技術文書を体系的に管理しています。

---

## 📁 ドキュメント分類

### 🚀 Getting Started - セットアップ・導入

新規開発者向けの導入ガイドとセットアップ手順

| ドキュメント                                                      | 説明                   | 対象者     |
| ----------------------------------------------------------------- | ---------------------- | ---------- |
| [Setup Guide](./getting-started/setup-guide.md)                   | 開発環境セットアップ   | 新規開発者 |
| [Quick Start](./getting-started/quick-start.md)                   | クイックスタートガイド | 新規開発者 |
| [Development Workflow](./getting-started/development-workflow.md) | 開発ワークフロー       | 全開発者   |
| [Troubleshooting](./getting-started/troubleshooting.md)           | トラブルシューティング | 全開発者   |

### 🏗️ Architecture - アーキテクチャ・技術仕様

システムの技術的設計とアーキテクチャ

| ドキュメント                                                     | 説明                       | 対象者                   |
| ---------------------------------------------------------------- | -------------------------- | ------------------------ |
| [Architecture Overview](./architecture/overview.md)              | システム全体アーキテクチャ | 技術リード・アーキテクト |
| [Technical Constraints](./architecture/technical-constraints.md) | 技術的制約と戦略           | 技術リード               |
| [Database Design](./architecture/database-design.md)             | データベース設計           | バックエンド開発者       |
| [API Specification](./architecture/api-specification.md)         | API設計仕様                | 全開発者                 |
| [Security Architecture](./architecture/security-architecture.md) | セキュリティアーキテクチャ | セキュリティエンジニア   |

### ⚡ Features - 機能仕様

ビジネス機能の詳細仕様

| ドキュメント                                           | 説明                | 対象者               |
| ------------------------------------------------------ | ------------------- | -------------------- |
| [Candidate Features](./features/candidate-features.md) | 候補者向け機能仕様  | 全開発者・PM         |
| [Company Features](./features/company-features.md)     | 企業向け機能仕様    | 全開発者・PM         |
| [Admin Features](./features/admin-features.md)         | 管理者向け機能仕様  | 全開発者・PM         |
| [Permissions](./features/permissions.md)               | 権限・認可仕様      | 全開発者             |
| [Notifications](./features/notifications.md)           | 通知システム仕様    | 全開発者             |
| [URL Routing](./features/url-routing.md)               | URLルーティング仕様 | フロントエンド開発者 |

### 🗄️ Database - データベース関連

データベース設計とスキーマ管理

| ドキュメント                                         | 説明                     | 対象者             |
| ---------------------------------------------------- | ------------------------ | ------------------ |
| [Database Schema](./database/schema.sql)             | データベーススキーマ定義 | バックエンド開発者 |
| [Data Requirements](./database/data-requirements.md) | データ要件定義           | 全開発者・PM       |
| [Migration Guide](./database/migrations/README.md)   | マイグレーション手順     | バックエンド開発者 |

### 🔌 API - API ドキュメント

REST API の詳細仕様

| ドキュメント                                  | 説明          | 対象者   |
| --------------------------------------------- | ------------- | -------- |
| [Authentication API](./api/authentication.md) | 認証関連API   | 全開発者 |
| [Candidates API](./api/candidates.md)         | 候補者関連API | 全開発者 |
| [Companies API](./api/companies.md)           | 企業関連API   | 全開発者 |
| [Admin API](./api/admin.md)                   | 管理者関連API | 全開発者 |

### 🚀 Deployment - デプロイ・運用

本番環境へのデプロイと運用

| ドキュメント                                                   | 説明             | 対象者               |
| -------------------------------------------------------------- | ---------------- | -------------------- |
| [Docker Setup](./deployment/docker-setup.md)                   | Docker環境構築   | DevOps・インフラ     |
| [Environment Variables](./deployment/environment-variables.md) | 環境変数設定     | 全開発者             |
| [Production Deployment](./deployment/production-deployment.md) | 本番デプロイ手順 | DevOps・リリース担当 |
| [Monitoring](./deployment/monitoring.md)                       | 監視・ログ設定   | DevOps・SRE          |

### 🔒 Internal - 内部ドキュメント

開発チーム内部の記録とメモ

| ドキュメント                                                         | 説明                         | 対象者         |
| -------------------------------------------------------------------- | ---------------------------- | -------------- |
| [Architecture Migration](./internal/architecture-migration-notes.md) | アーキテクチャ移行記録       | 技術リード     |
| [Cursor Interactions](./internal/cursor-interactions.md)             | Cursor AI使用記録            | 開発チーム内部 |
| [Development Notes](./internal/development-notes.md)                 | 開発メモ・知見               | 開発チーム内部 |
| [Architecture Decisions](./internal/decisions/)                      | アーキテクチャ決定記録 (ADR) | 技術リード     |

---

## 🎯 ドキュメント管理ルール

### 📝 作成・更新ガイドライン

1. **分類の徹底**: 新しいドキュメントは適切なカテゴリに配置
2. **命名規則**: ファイル名はケバブケース（例: `setup-guide.md`）
3. **目次の更新**: 新規ドキュメント作成時はこのREADME.mdを更新
4. **リンクの維持**: 移動・削除時は関連リンクを確実に更新

### 🔄 ドキュメントライフサイクル

- **作成**: 機能実装と同時にドキュメント作成
- **更新**: コード変更時にドキュメントも同期更新
- **レビュー**: プルリクエスト時にドキュメントもレビュー対象
- **アーカイブ**: 廃止機能のドキュメントは `archived/` フォルダに移動

---

## 🚀 クイックリンク

### 開発を始める

1. [Setup Guide](./getting-started/setup-guide.md) - 環境構築
2. [Quick Start](./getting-started/quick-start.md) - すぐに開発開始
3. [Development Workflow](./getting-started/development-workflow.md) - 開発フロー

### 機能を理解する

1. [Architecture Overview](./architecture/overview.md) - システム全体像
2. [Feature Specifications](./features/) - 機能仕様一覧
3. [API Documentation](./api/) - API仕様

### デプロイする

1. [Environment Variables](./deployment/environment-variables.md) - 環境設定
2. [Production Deployment](./deployment/production-deployment.md) - 本番デプロイ

---

## 📞 サポート・お問い合わせ

- **技術的な質問**: 開発チームSlack `#mokin-recruit-dev`
- **ドキュメント改善提案**: GitHub Issues
- **緊急時対応**: 開発リーダーまで直接連絡

---

_最終更新: 2024年12月_ _管理者: Mokin Recruit Development Team_
