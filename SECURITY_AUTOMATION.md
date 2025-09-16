# セキュリティ自動化ガイド

このプロジェクトには、GitHubのCode
Scanningアラートを自動修正するためのワークフローが設定されています。

## 🔧 セットアップされたワークフロー

### 1. CodeQL分析 (`.github/workflows/codeql.yml`)

- **実行タイミング**: プッシュ、プルリクエスト、週1回のスケジュール実行
- **機能**: TypeScript/JavaScriptコードの静的解析
- **検出内容**: セキュリティ脆弱性、コード品質の問題

### 2. 自動修正 (`.github/workflows/auto-fix-security.yml`)

- **実行タイミング**: 毎日午前2時、手動実行可能
- **機能**:
  - ESLintの自動修正
  - Prettierによるフォーマット
  - 一般的なセキュリティ問題の修正
  - 依存関係の脆弱性修正

### 3. セキュリティレビュー (`.github/workflows/security-review.yml`)

- **実行タイミング**: プルリクエスト作成時
- **機能**:
  - 依存関係の脆弱性チェック
  - ハードコードされたシークレットの検出
  - 危険なコードパターンの検出

## 🚀 使用方法

### 手動での自動修正実行

1. GitHubリポジトリの「Actions」タブに移動
2. 「Auto-fix Security Issues」ワークフローを選択
3. 「Run workflow」をクリック
4. 修正タイプを選択:
   - `all`: すべての修正を適用
   - `security`: セキュリティ関連のみ
   - `linting`: ESLint修正のみ
   - `formatting`: フォーマットのみ

### 自動修正されるもの

#### セキュリティ関連

- ✅ HTTPをHTTPSに変更
- ✅ 不要なconsole.logの削除
- ✅ 依存関係の脆弱性修正
- ⚠️ dangerouslySetInnerHTMLの検出（手動レビュー必要）

#### コード品質

- ✅ ESLintルールの自動修正
- ✅ Prettierによるフォーマット
- ✅ TypeScript型エラーの基本的な修正

### プルリクエストでのセキュリティチェック

プルリクエストを作成すると、自動的に以下がチェックされます：

- 依存関係の脆弱性
- ハードコードされたシークレット
- 危険なコードパターン
- 結果はプルリクエストにコメントとして投稿

## 📋 アラートへの対応方針

### Critical/High レベル

- 🚨 **即座に対応必要**
- 自動修正で対応可能なものは自動でPR作成
- 手動対応が必要なものはissue作成

### Moderate レベル

- ⚠️ **計画的に対応**
- 週次で確認・対応
- リリース前に必ず解決

### Low レベル

- ℹ️ **継続的改善**
- 月次で確認
- 可能な範囲で対応

## 🔍 手動でのセキュリティチェック

### 基本的なチェック

```bash
# 依存関係の脆弱性チェック
npm audit

# 自動修正可能な脆弱性の修正
npm audit fix

# 高レベルの脆弱性のみ表示
npm audit --audit-level=high

# ESLintによるコード品質チェック
npm run lint

# TypeScript型チェック
npm run type-check
```

### 詳細なセキュリティチェック

```bash
# ハードコードされたシークレットの検索
grep -r -i "password\|secret\|token\|key" src/ --include="*.ts" --include="*.tsx" | grep -v "Type\|Interface\|process.env"

# 危険な関数の使用チェック
grep -r "dangerouslySetInnerHTML\|eval(\|innerHTML\s*=" src/ --include="*.ts" --include="*.tsx"

# HTTPリンクのチェック
grep -r "http://" src/ --include="*.ts" --include="*.tsx"
```

## ⚙️ カスタマイズ

### 自動修正のカスタマイズ

`.github/workflows/auto-fix-security.yml`を編集して、プロジェクトに特化した修正ルールを追加できます：

```yaml
- name: Custom security fixes
  run: |
    # プロジェクト固有の修正ルールを追加
    find src -name "*.ts" | xargs sed -i 's/oldPattern/newPattern/g'
```

### 除外設定

特定のファイルやパターンを自動修正から除外する場合：

```yaml
- name: Apply fixes (excluding specific files)
  run: |
    # 特定のファイルを除外
    npm run lint -- --fix --ignore-path .eslintignore
```

## 📊 モニタリング

- GitHub Actions の実行履歴でワークフローの成功/失敗を確認
- Security タブでCode Scanningアラートの推移を監視
- 依存関係の脆弱性はDependabotアラートで追跡

## 🤝 貢献

新しい自動修正ルールの追加や改善の提案は、Issueまたはプルリクエストでお願いします。

---

## トラブルシューティング

### よくある問題

**Q: 自動修正ワークフローが失敗する** A:

- Node.jsのバージョンを確認
- package.jsonのスクリプトが正しく設定されているか確認
- 権限設定を確認（GITHUB_TOKENの権限）

**Q: 修正されたPRが作成されない** A:

- 修正対象の問題が存在するか確認
- ブランチ保護ルールの設定を確認
- ワークフローのログを確認

**Q: 特定の修正を無効にしたい** A:

- ワークフローファイルの該当部分をコメントアウト
- または条件分岐を追加して特定の場合のみ実行
