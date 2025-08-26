・signup/set-passwordページを以下のデザインを確認にしてcomponents/uiを確認して同じデザインのコンポーネントがあればそれを使用してください。バックグラウンドはCandidateAuthBackgroundにしてください。pbはsignupページと同じようにしてほかのページを確認してコンポーネントでできる場所はコンポーネントにしてください。

・機能ではサーバーコンポーネントを使用して実装してほしくてverifyから送られてきたメールアドレスのパスワードをsupabase authで設定できるようにしてほしい。

https://www.figma.com/design/qyApM0fuIL9ImMtvwE1otX/%E3%80%90%E9%96%8B%E7%99%BA%E4%BC%9A%E7%A4%BE%E6%A7%98%E5%85%B1%E6%9C%89%E7%94%A8%E3%80%91DRSPJ_%E3%83%9E%E3%82%B9%E3%82%BF%E3%83%BC%E3%83%87%E3%82%B6%E3%82%A4%E3%83%B3?node-id=2533-104973&m=dev


流れでいうとsignupページでメールアドレスを入力して遷移しverifyページでメールアドレスあてに送られてきたコードを入力してset-passwordに遷移してそこでパスワードを設定し登録が完了という流れ。