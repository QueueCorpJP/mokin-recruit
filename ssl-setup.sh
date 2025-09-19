#!/bin/bash
# SSL証明書取得・設定スクリプト

# 変数設定（実際のドメイン名に変更してください）
DOMAIN="13.231.207.27"
EMAIL="your-email@example.com"

echo "🔐 SSL証明書の取得を開始します..."

# 1. Certbotのインストール
sudo apt update
sudo apt install -y certbot python3-certbot-nginx

# 2. nginxの停止（証明書取得のため）
sudo systemctl stop nginx

# 3. SSL証明書の取得（IPアドレス用）
# IPアドレスの場合はLet's Encryptは使用できないため、自己署名証明書を作成
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/private/queuepoint.pem \
    -out /etc/ssl/certs/queuepoint.pem \
    -subj "/C=JP/ST=Tokyo/L=Tokyo/O=Organization/CN=$DOMAIN"

# 4. nginx設定ファイルのコピー
sudo cp nginx.conf /etc/nginx/sites-available/mokin-recruit

# 5. 設定ファイル内のドメイン名を置換（既に更新済みのためスキップ）
# sudo sed -i "s/your-domain.com/$DOMAIN/g" /etc/nginx/sites-available/mokin-recruit

# 6. サイトの有効化
sudo ln -sf /etc/nginx/sites-available/mokin-recruit /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# 7. nginx設定のテスト
sudo nginx -t

# 8. nginxの開始
sudo systemctl start nginx
sudo systemctl enable nginx

# 9. 自動更新の設定
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -

echo "✅ SSL設定が完了しました！"
echo "🌐 https://$DOMAIN でアクセスできます"
echo "⚠️  IPアドレス用の自己署名証明書のため、ブラウザで警告が表示される場合があります"

