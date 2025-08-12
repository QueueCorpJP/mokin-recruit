admin/media/newで以下の要素を指定した場合のcandidate/media/[media_id]での表示のされ方をいかにまとめたのですべてしっかり修正または追加してください。
テーブルを作るときはもっとわかりやすく作成できるようにしてデザインは今のままでいい。
これはadmin/previewページもこのデザインにしてください

写真はサムネとまったく同じデザインにしてください。

テーブルは何コラム何列が指定してからそのテーブルが表示されるようにして今はただのテキストが表示されるが実際のテーブルが表示されるようにしてください。

テーブルの表示もしっかり同じにしてください
コラム名コンテナ
display: flex;
padding: 16px;
justify-content: center;
align-items: center;
align-content: center;
gap: 24px;
align-self: stretch;
flex-wrap: wrap;

コラム名コンテナ内テキスト

color: var(--, #323232);
font-family: "Noto Sans JP";
font-size: 16px;
font-style: normal;
font-weight: 500;
line-height: 200%; /* 32px */
letter-spacing: 1.6px;

列のコンテナ
display: flex;
padding: 16px;
justify-content: center;
align-items: center;
align-content: center;
gap: 24px;
align-self: stretch;
flex-wrap: wrap;

列のコンテナ内テキスト

color: var(--, #323232);
font-family: "Noto Sans JP";
font-size: 16px;
font-style: normal;
font-weight: 500;
line-height: 200%; /* 32px */
letter-spacing: 1.6px;

著者コンテナ

display: flex;
width: 960px;
padding: 16px;
align-items: center;
gap: 10px;

border-top: 1px solid var(--, #0F9058);
border-bottom: 1px solid var(--, #0F9058);
background: var(--, #F0F9F3);

著者コンテナテキスト

color: var(--, #323232);
font-family: "Noto Sans JP";
font-size: 16px;
font-style: normal;
font-weight: 500;
line-height: 200%; /* 32px */
letter-spacing: 1.6px;