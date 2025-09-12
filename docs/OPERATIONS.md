# Operations Runbook (簡易)

## Build & Run (Local)

- `npm ci`
- `cp .env.local.example .env.local` を編集
- `npm run dev`

## Docker

- ビルド: `docker build -t mokin-recruit:latest .`
- 実行: `docker run -p 3000:3000 --env-file .env.local mokin-recruit:latest`

## CI

- GitHub Actions が PR/`main` で type-check / lint / test / build を実行

## 環境変数

- `.env.local.example` を参照

## ログ

- 開発: `logs/*.log`
- 本番: コンソール(JSON)出力を収集
