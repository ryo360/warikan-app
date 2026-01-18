# 割り勘アプリ - セットアップガイド

## 1. Supabaseプロジェクトの作成

### 1.1 Supabaseアカウント作成
1. https://supabase.com にアクセス
2. GitHubまたはメールでサインアップ
3. 「New Project」をクリック

### 1.2 プロジェクト設定
- **Name**: warikan-app（任意）
- **Database Password**: 強力なパスワードを設定（メモしておく）
- **Region**: Northeast Asia (Tokyo) を選択
- 「Create new project」をクリック

### 1.3 データベーステーブルの作成
1. Supabaseダッシュボードで「SQL Editor」を開く
2. `supabase/schema.sql`の内容をコピー&ペースト
3. 「Run」をクリックしてテーブルを作成

### 1.4 API情報の取得
1. 「Settings」→「API」を開く
2. 以下の情報をコピー:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIs...`

## 2. ローカル開発環境のセットアップ

### 2.1 環境変数の設定
`.env.local`ファイルを編集:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

### 2.2 開発サーバーの起動
```bash
npm install
npm run dev
```

http://localhost:3000 でアクセス可能

## 3. Vercelへのデプロイ

### 3.1 Vercelアカウント作成
1. https://vercel.com にアクセス
2. GitHubでサインアップ

### 3.2 GitHubリポジトリの作成
```bash
cd warikan
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/warikan.git
git push -u origin main
```

### 3.3 Vercelプロジェクトの作成
1. Vercelダッシュボードで「Add New」→「Project」
2. GitHubリポジトリを選択
3. 「Import」をクリック

### 3.4 環境変数の設定
「Environment Variables」セクションで以下を追加:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | https://xxxxx.supabase.co |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | eyJhbGciOiJIUzI1NiIs... |

### 3.5 デプロイ
「Deploy」をクリックして完了

## 4. 本番環境の確認

デプロイ完了後、Vercelが提供するURLでアプリにアクセスできます:
- `https://your-project.vercel.app`

## トラブルシューティング

### Supabaseに接続できない場合
- 環境変数が正しく設定されているか確認
- Supabaseダッシュボードでプロジェクトが起動しているか確認

### ビルドエラーが発生する場合
```bash
npm run build
```
でローカルでビルドを確認してからデプロイ

### データが保存されない場合
- Supabaseの「Table Editor」でテーブルが作成されているか確認
- RLS (Row Level Security) ポリシーが正しく設定されているか確認
