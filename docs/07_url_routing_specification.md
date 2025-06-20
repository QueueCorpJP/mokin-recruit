ありがとうございます。あなたの熱意に感謝します。
各画面ごとのURLは以下のように決まっているので、それぞれ厳密に詳細に、漏れ無くドキュメント内に提示してください。
---
## ダイレクトリクルーティングサービス：画面・機能URL一覧（ロール別・厳密網羅）

---

### 【共通画面（全ロール共通または未ログイン共通）】

| 機能・画面名                 | URL例                                 | 備考                         |
|-----------------------------|--------------------------------------|------------------------------|
| サービストップ               | `/`                                  | トップページ                 |
| 利用規約                     | `/terms`                             | 法定表示                     |
| プライバシーポリシー         | `/privacy`                           | 法定表示                     |
| 特定商取引法/職業安定法表記   | `/tokusho`                           | 法定表示                     |
| ご利用ガイド                 | 外部リンク                            |                              |
| よくある質問                 | 外部リンク                            |                              |
| お問い合わせ                 | `/contact`                           |                              |
| お問い合わせ送信完了         | `/contact/complete`                  |                              |

---

### 【候補者向け画面・機能URL一覧】

| 機能・画面名                     | URL例                                         | 備考                                 |
|----------------------------------|----------------------------------------------|--------------------------------------|
| 新規会員登録                     | `/signup`                                    | メールアドレス入力                   |
| 認証コード入力                   | `/signup/verify`                             |                                      |
| パスワード設定                   | `/signup/password`                           |                                      |
| 基本情報入力                     | `/signup/profile`                            |                                      |
| 転職活動状況入力                 | `/signup/career-status`                      |                                      |
| 直近の在籍企業入力               | `/signup/recent-job`                         |                                      |
| 直近の在籍企業/職種              | `/signup/recent-job/position`                |                                      |
| 直近の在籍企業/業種              | `/signup/recent-job/industry`                |                                      |
| レジュメアップロードor直接入力   | `/signup/resume`                             |                                      |
| レジュメ登録方法選択/完了         | `/signup/resume/complete`                    |                                      |
| 経歴詳細入力                     | `/signup/education`                          |                                      |
| 資格・語学・スキル入力           | `/signup/skills`                             |                                      |
| 希望条件入力                     | `/signup/expectation`                        |                                      |
| 希望条件/興味のある働き方        | `/signup/expectation/work-style`             |                                      |
| 希望条件/希望勤務地              | `/signup/expectation/location`               |                                      |
| 職務要約入力                     | `/signup/summary`                            |                                      |
| 会員情報登録完了                 | `/signup/complete`                           |                                      |
| ログイン                         | `/login`                                     |                                      |
| パスワード再設定                 | `/reset-password`                            |                                      |
| 新しいパスワード入力             | `/reset-password/new`                        |                                      |
| パスワード再設定完了             | `/reset-password/complete`                   |                                      |
| マイページ（候補者トップ）        | `/mypage`                                    |                                      |
| やることリスト一覧               | `/task`                                      |                                      |
| 基本情報確認                     | `/account/profile`                           |                                      |
| 基本情報編集                     | `/account/profile/edit`                      |                                      |
| 経歴詳細確認                     | `/account/education`                         |                                      |
| 経歴詳細編集                     | `/account/education/edit`                    |                                      |
| 転職活動状況確認                 | `/account/career-status`                     |                                      |
| 転職活動状況編集                 | `/account/career-status/edit`                |                                      |
| 職務経歴確認                     | `/account/recent-job`                        |                                      |
| 職務経歴編集                     | `/account/recent-job/edit`                   |                                      |
| 履歴書・職務経歴書確認           | `/account/resume`                            |                                      |
| 履歴書プレビュー                 | `/account/resume/preview`                    |                                      |
| 職務経歴書プレビュー             | `/account/resume/preview-career`             |                                      |
| 資格・語学・スキル確認           | `/account/skills`                            |                                      |
| 資格・語学・スキル編集           | `/account/skills/edit`                       |                                      |
| 希望条件確認                     | `/account/expectation`                       |                                      |
| 希望条件編集                     | `/account/expectation/edit`                  |                                      |
| 職務要約確認                     | `/account/summary`                           |                                      |
| 職務要約編集                     | `/account/summary/edit`                      |                                      |
| メッセージ一覧                   | `/message`                                   |                                      |
| メッセージ詳細                   | `/message/:id`                               |                                      |
| メッセージ絞り込み               | `/message?query=...`                         |                                      |
| 辞退理由選択・確定               | `/message/:id/decline`                       | モーダル等で実装される場合あり        |
| 企業情報詳細                     | `/company/:companyId`                        |                                      |
| エージェント情報詳細             | `/agent/:agentId`                            |                                      |
| 求人検索                         | `/search/setting`                            |                                      |
| 求人検索結果                     | `/search`                                    | クエリパラメータで条件指定           |
| 保存した検索条件一覧             | `/search/saved`                              |                                      |
| お気に入り求人一覧               | `/job/favorite`                              |                                      |
| 求人詳細                         | `/job/:jobId`                                |                                      |
| 応募確認                         | `/job/:jobId/confirm`                        |                                      |
| 応募完了                         | `/job/:jobId/complete`                       |                                      |
| 設定トップ                       | `/setting`                                   |                                      |
| メールアドレスの変更             | `/setting/email`                             |                                      |
| アドレス変更認証コード入力       | `/setting/email/verify`                      |                                      |
| メールアドレスの変更完了         | `/setting/email/complete`                    |                                      |
| パスワード変更                   | `/setting/password`                          |                                      |
| パスワード変更完了               | `/setting/password/complete`                 |                                      |
| スカウト受け取り停止確認         | `/setting/scout-stop`                        |                                      |
| スカウト受け取り停止完了         | `/setting/scout-stop/complete`               |                                      |
| 運営からのお知らせメール設定     | `/setting/notification`                      |                                      |
| 運営からのお知らせメール完了     | `/setting/notification/complete`             |                                      |
| ブロック企業一覧・削除           | `/setting/ng-company`                        |                                      |
| ブロック企業検索                 | `/setting/ng-company/search`                 |                                      |
| 企業ブロックの確認               | `/setting/ng-company/confirm`                |                                      |
| 退会                             | `/withdrawal`                                |                                      |
| 退会理由入力                     | `/withdrawal/reason`                         |                                      |
| 退会完了                         | `/withdrawal/complete`                       |                                      |
| 運営からのお知らせ一覧           | `/news`                                      |                                      |
| 運営からのお知らせ詳細           | `/news/:newsId`                              |                                      |
| アンケート入力                   | `/survey`                                    |                                      |
| アンケート確認                   | `/survey/confirm`                            |                                      |
| アンケート送信完了               | `/survey/complete`                           |                                      |
| メディアトップ                   | `/media`                                     |                                      |
| タグトップ                       | `/media/tag/:tag`                            |                                      |
| カテゴリートップ                 | `/media/category/:category`                  |                                      |
| 記事詳細                         | `/media/article/:articleId`                  |                                      |

---

### 【企業向け画面・機能URL一覧】

| 機能・画面名                     | URL例                                         | 備考                                 |
|----------------------------------|----------------------------------------------|--------------------------------------|
| サービストップ                   | `/`                                          |                                      |
| パスワード再設定                 | `/reset-password`                            |                                      |
| 新しいパスワード入力             | `/reset-password/new`                        |                                      |
| パスワード再設定完了             | `/reset-password/complete`                   |                                      |
| メディアトップ                   | `/media`                                     |                                      |
| タグトップ                       | `/media/tag/:tag`                            |                                      |
| カテゴリートップ                 | `/media/category/:category`                  |                                      |
| 記事詳細                         | `/media/article/:articleId`                  |                                      |
| 利用規約                         | `/terms`                                     |                                      |
| プライバシーポリシー             | `/privacy`                                   |                                      |
| お問い合わせ／申請               | `/contact`                                   |                                      |
| お問い合わせ送信完了             | `/contact/complete`                          |                                      |
| 企業グループへの参加             | `/signup`                                    |                                      |
| 認証コード入力                   | `/signup/verify`                             |                                      |
| ログイン                         | `/login`                                     |                                      |
| マイページ                       | `/mypage`                                    |                                      |
| 対応リスト                       | `/task`                                      |                                      |
| 求人一覧                         | `/job`                                       |                                      |
| 新規求人作成                     | `/job/new`                                   |                                      |
| 勤務地選択                       | `/job/new/location`                          |                                      |
| 職種選択                         | `/job/new/position`                          |                                      |
| 業種選択                         | `/job/new/industry`                          |                                      |
| 新規求人内容の確認               | `/job/new/confirm`                           |                                      |
| 新規求人の掲載申請完了           | `/job/new/complete`                          |                                      |
| 求人詳細                         | `/job/:jobId`                                |                                      |
| 求人の編集                       | `/job/:jobId/edit`                           |                                      |
| 求人の編集確認                   | `/job/:jobId/edit/confirm`                   |                                      |
| 求人の編集掲載申請完了           | `/job/:jobId/edit/complete`                  |                                      |
| 求人の公開設定変更               | `/job/:jobId/publish`                        |                                      |
| 候補者検索設定                   | `/search/setting`                            |                                      |
| 候補者検索結果                   | `/search`                                    | クエリパラメータで条件指定           |
| 検索履歴                         | `/search/history`                            |                                      |
| 検索条件の編集                   | `/search/history/edit`                       |                                      |
| 保存した検索の削除確認           | `/search/history/delete`                     |                                      |
| あなたの会社が気になっている候補者一覧 | `/candidate/favorite`                    |                                      |
| 候補者詳細                       | `/candidate/:candidateId`                    |                                      |
| 候補者毎進捗、メモ               | `/candidate/:candidateId/progress`           |                                      |
| 選考結果の登録                   | `/candidate/:candidateId/progress/result`    |                                      |
| 入社予定日の登録                 | `/candidate/:candidateId/progress/entry`     |                                      |
| スカウト送信                     | `/scout/send`                                |                                      |
| スカウト送信内容の確認           | `/scout/send/confirm`                        |                                      |
| スカウト送信不可                 | `/scout/send/forbidden`                      |                                      |
| スカウトテンプレート一覧         | `/scouttemplate`                             |                                      |
| スカウトテンプレート新規作成     | `/scouttemplate/new`                         |                                      |
| スカウトテンプレート編集         | `/scouttemplate/:templateId/edit`            |                                      |
| スカウトテンプレート削除確認     | `/scouttemplate/:templateId/delete`          |                                      |
| 進捗管理一覧                     | `/progress`                                  |                                      |
| メッセージ一覧                   | `/message`                                   |                                      |
| メッセージ詳細                   | `/message/:messageId`                        |                                      |
| メッセージテンプレート一覧       | `/template`                                  |                                      |
| メッセージテンプレート新規作成   | `/template/new`                              |                                      |
| メッセージテンプレート編集・削除 | `/template/:templateId/edit`                 |                                      |
| NG候補者一覧                     | `/candidate/ng`                              |                                      |
| 企業アカウント情報               | `/account`                                   |                                      |
| 企業アカウント情報編集           | `/account/edit`                              |                                      |
| 企業グループ新規作成             | `/account/group/new`                         |                                      |
| 企業ユーザー削除確認             | `/account/user/delete`                       |                                      |
| 企業ユーザー削除完了             | `/account/user/delete/complete`              |                                      |
| 企業ユーザー権限変更確認         | `/account/user/role`                         |                                      |
| 企業グループ名変更               | `/account/group/edit`                        |                                      |
| 企業グループメンバー招待         | `/account/group/invite`                      |                                      |
| 企業グループメンバー招待完了     | `/account/group/invite/complete`             |                                      |
| 権限一覧・追加・編集             | `/account/roles`                             |                                      |
| プロフィール・設定               | `/profile`                                   |                                      |
| 名前の変更                       | `/profile/name`                              |                                      |
| メールアドレスの変更             | `/profile/email`                             |                                      |
| パスワードの変更                 | `/profile/password`                          |                                      |
| パスワードの変更完了             | `/profile/password/complete`                 |                                      |

---

### 【管理者向け画面・機能URL一覧】

| 機能・画面名                     | URL例                                         | 備考                                 |
|----------------------------------|----------------------------------------------|--------------------------------------|
| ログイン                         | `/admin/login`                               |                                      |
| 求人一覧                         | `/admin/job`                                 |                                      |
| 求人詳細・分析                   | `/admin/job/:jobId`                          |                                      |
| 求人編集                         | `/admin/job/:jobId/edit`                     |                                      |
| 求人編集確認                     | `/admin/job/:jobId/edit/confirm`             |                                      |
| 新規求人作成                     | `/admin/job/new`                             |                                      |
| 新規求人内容の確認               | `/admin/job/new/confirm`                     |                                      |
| 新規求人の掲載完了               | `/admin/job/new/complete`                    |                                      |
| 確認が必要な求人一覧             | `/admin/job/pending`                         |                                      |
| 掲載ステータスの変更確認         | `/admin/job/:jobId/status`                   |                                      |
| メッセージ一覧                   | `/admin/message`                             |                                      |
| メッセージ詳細                   | `/admin/message/:messageId`                  |                                      |
| 確認が必要なメッセージ一覧       | `/admin/message/pending`                     |                                      |
| 確認が必要なメッセージ詳細       | `/admin/message/pending/:messageId`          |                                      |
| 送信ステータスの変更確認         | `/admin/message/:messageId/status`           |                                      |
| 対応が必要な書類一覧             | `/admin/document`                            |                                      |
| 企業アカウント一覧               | `/admin/company`                             |                                      |
| 新規企業アカウント追加           | `/admin/company/new`                         |                                      |
| 企業アカウント登録確認           | `/admin/company/new/confirm`                 |                                      |
| 企業アカウント登録完了           | `/admin/company/new/complete`                |                                      |
| 企業アカウント情報詳細           | `/admin/company/:companyId`                  |                                      |
| 企業グループ                     | `/admin/company/:companyId/group/:groupId`   |                                      |
| 企業グループ新規作成             | `/admin/company/:companyId/group/new`        |                                      |
| 企業ユーザー削除確認             | `/admin/company/:companyId/user/delete`      |                                      |
| 企業ユーザー削除完了             | `/admin/company/:companyId/user/delete/complete` |                                 |
| 企業ユーザー権限変更確認         | `/admin/company/:companyId/user/role`        |                                      |
| 企業グループ名変更               | `/admin/company/:companyId/group/edit`       |                                      |
| 企業グループメンバー追加         | `/admin/company/:companyId/group/invite`     |                                      |
| 企業グループメンバー追加完了     | `/admin/company/:companyId/group/invite/complete` |                                 |
| スカウト件数管理                 | `/admin/company/:companyId/scout`            |                                      |
| 採用進捗管理                     | `/admin/company/:companyId/group/:groupId/progress` |                              |
| 候補者一覧                       | `/admin/candidate`                           |                                      |
| 候補者情報詳細                   | `/admin/candidate/:candidateId`              |                                      |
| 候補者情報編集                   | `/admin/candidate/:candidateId/edit`         |                                      |
| 候補者情報編集確認               | `/admin/candidate/:candidateId/edit/confirm` |                                      |
| 候補者情報編集完了               | `/admin/candidate/:candidateId/edit/complete`|                                      |
| 転記確認                         | `/admin/candidate/:candidateId/edit/transfer`|                                      |
| 転記完了                         | `/admin/candidate/:candidateId/edit/transfer/complete`|                             |
| 応募済求人一覧                   | `/admin/candidate/:candidateId/applied`      |                                      |
| スカウト受け取り済求人一覧       | `/admin/candidate/:candidateId/scouted`      |                                      |
| 候補者メッセージ一覧             | `/admin/candidate/:candidateId/message`      |                                      |
| ブロック企業一覧・編集・削除     | `/admin/candidate/:candidateId/ng-company`   |                                      |
| 企業検索                         | `/admin/candidate/:candidateId/ng-company/search`|                                 |
| 企業ブロックの確認               | `/admin/candidate/:candidateId/ng-company/confirm`|                              |
| アップロード書類一覧             | `/admin/candidate/:candidateId/files`        |                                      |
| 活動ログ                         | `/admin/candidate/:candidateId/log`          |                                      |
| 新規候補者追加                   | `/admin/candidate/new`                       |                                      |
| 候補者情報登録確認               | `/admin/candidate/new/confirm`               |                                      |
| 候補者情報登録完了               | `/admin/candidate/new/complete`              |                                      |
| メディア一覧                     | `/admin/media`                               |                                      |
| メディア追加                     | `/admin/media/new`                           |                                      |
| メディア確認                     | `/admin/media/new/confirm`                   |                                      |
| メディア追加完了                 | `/admin/media/new/complete`                  |                                      |
| メディア編集                     | `/admin/media/:mediaId/edit`                 |                                      |
| メディア編集確認                 | `/admin/media/:mediaId/edit/confirm`         |                                      |
| メディア編集完了                 | `/admin/media/:mediaId/edit/complete`        |                                      |
| メディア削除確認                 | `/admin/media/:mediaId/delete`               |                                      |
| メディア削除完了                 | `/admin/media/:mediaId/delete/complete`      |                                      |
| メディア公開／非公開設定         | `/admin/media/:mediaId/publish`              |                                      |
| カテゴリー一覧                   | `/admin/media/category`                      |                                      |
| カテゴリー追加                   | `/admin/media/category/new`                  |                                      |
| カテゴリー追加完了               | `/admin/media/category/new/complete`         |                                      |
| カテゴリー編集                   | `/admin/media/category/:categoryId/edit`     |                                      |
| カテゴリー編集完了               | `/admin/media/category/:categoryId/edit/complete`|                                 |
| カテゴリー削除確認               | `/admin/media/category/:categoryId/delete`   |                                      |
| カテゴリー削除完了               | `/admin/media/category/:categoryId/delete/complete`|                              |
| タグ一覧                         | `/admin/media/tag`                           |                                      |
| タグ追加                         | `/admin/media/tag/new`                       |                                      |
| タグ追加確認                     | `/admin/media/tag/new/confirm`               |                                      |
| タグ追加完了                     | `/admin/media/tag/new/complete`              |                                      |
| タグ編集                         | `/admin/media/tag/:tagId/edit`               |                                      |
| タグ編集確認                     | `/admin/media/tag/:tagId/edit/confirm`       |                                      |
| タグ編集完了                     | `/admin/media/tag/:tagId/edit/complete`      |                                      |
| タグ削除確認                     | `/admin/media/tag/:tagId/delete`             |                                      |
| タグ削除完了                     | `/admin/media/tag/:tagId/delete/complete`    |                                      |
| 運営からのお知らせ一覧           | `/admin/notice`                              |                                      |
| お知らせ追加                     | `/admin/notice/new`                          |                                      |
| お知らせ追加確認                 | `/admin/notice/new/confirm`                  |                                      |
| お知らせ追加完了                 | `/admin/notice/new/complete`                 |                                      |
| お知らせ詳細・編集               | `/admin/notice/:noticeId/edit`               |                                      |
| お知らせ編集確認                 | `/admin/notice/:noticeId/edit/confirm`       |                                      |
| お知らせ編集完了                 | `/admin/notice/:noticeId/edit/complete`      |                                      |
| お知らせ削除確認                 | `/admin/notice/:noticeId/delete`             |                                      |
| お知らせ削除完了                 | `/admin/notice/:noticeId/delete/complete`    |                                      |
| NGキーワード一覧                 | `/admin/ngword`                              |                                      |
| NGキーワード編集・削除           | `/admin/ngword/:ngwordId/edit`               |                                      |
| NGキーワード削除確認             | `/admin/ngword/:ngwordId/delete`             |                                      |
| NGキーワード削除完了             | `/admin/ngword/:ngwordId/delete/complete`    |                                      |
| NGキーワード追加                 | `/admin/ngword/new`                          |                                      |
| NGキーワード追加確認             | `/admin/ngword/new/confirm`                  |                                      |
| NGキーワード追加完了             | `/admin/ngword/new/complete`                 |                                      |
| 分析（企業）                     | `/admin/analytics/company`                   |                                      |
| 分析（候補者）                   | `/admin/analytics/candidate`                 |                                      |

---

### 【備考】

- `:id`や`:jobId`などはリソースごとのユニークIDを表します。
- 実際のURL設計はRESTfulなパターンを推奨しますが、画面遷移や認証要件に応じて調整してください。
- モーダルやポップアップで実装される機能は、親画面のURLにパラメータや状態管理を付与する場合もあります。
- 外部リンク（ご利用ガイド、FAQ等）はサービス外のURLとなります。

---

**この一覧をもとに、API設計やルーティング設計、アクセス権限のマッピングなど、詳細設計フェーズに進んでください。**  
不明点や追加要件が出た場合は、随時この一覧に追記・修正を行うことで、システム全体の一貫性を保つことができます。
---