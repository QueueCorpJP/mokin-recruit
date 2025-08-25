タスク1

admin/messageページにて一覧のヘッドの項目は日付、企業ID、企業名、企業グループ、候補者名、選考状況、求人ページにしてください。基本他ページどうよう一覧のコンポーネント使ってほぼコンポーネントで実装してください。admin/mediaを参考にして一覧を横スクロールできるようにしてください。

https://www.figma.com/design/qyApM0fuIL9ImMtvwE1otX/%E3%80%90%E9%96%8B%E7%99%BA%E4%BC%9A%E7%A4%BE%E6%A7%98%E5%85%B1%E6%9C%89%E7%94%A8%E3%80%91DRSPJ_%E3%83%9E%E3%82%B9%E3%82%BF%E3%83%BC%E3%83%87%E3%82%B6%E3%82%A4%E3%83%B3?node-id=2533-161682&m=dev


タスク2

admin/messageにてadmin/jobの検索部分とまったく同じものを表示してください。セレクトの内容は候補者名、企業ID、企業名、選考状況にしてください。実際にdatabase.mdを確認してやってください。


タスク3

admin/message/[message_id]ページを作成してください。タイトル、サイドバー、パンくずリストはlayoutにあるからいらないです。あと全体的に既存のコンポーネトを使用してください。セレクトも既存のものもあるのでそれを使用してください。

https://www.figma.com/design/qyApM0fuIL9ImMtvwE1otX/%E3%80%90%E9%96%8B%E7%99%BA%E4%BC%9A%E7%A4%BE%E6%A7%98%E5%85%B1%E6%9C%89%E7%94%A8%E3%80%91DRSPJ_%E3%83%9E%E3%82%B9%E3%82%BF%E3%83%BC%E3%83%87%E3%82%B6%E3%82%A4%E3%83%B3?node-id=2533-163014&m=dev

admin/message/[message_id]ページのメッセージのコンポーネントをつくってそれを使用してください。イメージとしては四角の左上に▲を配置するみたいなこと

四角
width: 805px;
height: 187px;
flex-shrink: 0;

border-radius: 3px;
border: 1px solid #000;
background: #FFF;

三角
width: 16px;
height: 17px;
transform: rotate(-90deg);
flex-shrink: 0;

fill: #FFF;
stroke-width: 1px;
stroke: #000;

<svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
  <path d="M16.5 0.788085L16.5 15.2119L1.17285 8L16.5 0.788085Z" fill="white" stroke="black"/>
</svg>