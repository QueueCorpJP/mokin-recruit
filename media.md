admin/media/newで以下の要素を指定した場合のcandidate/media/[media_id]での表示のされ方をいかにまとめたのですべてしっかり修正または追加してください。
テーブルを作るときはもっとわかりやすく作成できるようにしてデザインは今のままでいい。
これはadmin/previewページもこのデザインにしてください

li

color: var(--, #323232);
font-family: "Noto Sans JP";
font-size: 16px;
font-style: normal;
font-weight: 500;
line-height: 200%; /* 32px */
letter-spacing: 1.6px;

目次
display: flex;
padding: 24px;
flex-direction: column;
align-items: flex-start;
gap: 8px;
align-self: stretch;

border-radius: 24px;
border: 2px solid var(--, #0F9058);

目次内テキスト
color: var(--, #323232);

/* 本文_bold */
font-family: "Noto Sans JP";
font-size: 16px;
font-style: normal;
font-weight: 700;
line-height: 200%; /* 32px */
letter-spacing: 1.6px;

目次という文字
color: var(--, #0F9058);

/* h4_bold */
font-family: "Noto Sans JP";
font-size: 18px;
font-style: normal;
font-weight: 700;
line-height: 160%; /* 28.8px */
letter-spacing: 1.8px;

引用コンテナ

display: flex;
width: 960px;
padding: 16px;
align-items: center;
gap: 10px;

引用コンテナないの文字

color: var(--, #323232);
font-family: "Noto Sans JP";
font-size: 16px;
font-style: normal;
font-weight: 500;
line-height: 200%; /* 32px */
letter-spacing: 1.6px;

