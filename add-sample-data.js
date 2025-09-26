// Simple Node.js script to add sample data
// Run with: node add-sample-data.js

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function addSampleData() {
  console.log('Adding sample media articles...');

  // Sample media articles
  const articles = [
    {
      title: 'DX人材の需要が急拡大中！転職市場で求められるスキルとは',
      slug: 'dx-talent-demand-expansion-' + Date.now(),
      content: `<div class="article-content">
        <h2>DX人材とは何か？</h2>
        <p>デジタルトランスフォーメーション（DX）人材とは、企業のデジタル化を推進し、ビジネスモデルの変革を担う専門人材のことです。近年、あらゆる業界でDXの重要性が高まる中、このような人材への需要が急速に拡大しています。</p>

        <h3>求められる主要スキル</h3>
        <ul>
          <li>データ分析・AI/機械学習の知識</li>
          <li>クラウドプラットフォームの活用経験</li>
          <li>プロジェクトマネジメント能力</li>
          <li>ビジネス理解と戦略的思考力</li>
        </ul>

        <h3>転職市場での現状</h3>
        <p>現在の転職市場では、DX人材の年収は一般的なITエンジニアよりも20-30%高い水準で推移しています。特に大手企業では、DX推進責任者ポジションに対して1000万円を超えるオファーも珍しくありません。</p>

        <h3>キャリアアップのポイント</h3>
        <p>DX人材としてキャリアアップするためには、技術スキルだけでなく、ビジネスサイドとの橋渡し役となる対人スキルも重要です。資格取得やプロジェクト実績の積み重ねが転職成功の鍵となります。</p>
      </div>`,
      excerpt:
        'デジタルトランスフォーメーション（DX）人材への需要が急拡大中。転職市場で求められるスキルや年収水準、キャリアアップのポイントを解説します。',
      status: 'PUBLISHED',
      published_at: new Date().toISOString(),
    },
    {
      title: 'リモートワーク時代の面接対策：オンライン面接で好印象を与える方法',
      slug: 'remote-interview-tips-' + Date.now(),
      content: `<div class="article-content">
        <h2>オンライン面接の基本準備</h2>
        <p>リモートワークが普及する中、オンライン面接は転職活動の標準となりました。対面面接とは異なる準備が必要です。</p>

        <h3>技術的準備のチェックリスト</h3>
        <ul>
          <li>安定したインターネット接続の確認</li>
          <li>カメラとマイクの音質・画質テスト</li>
          <li>面接ツール（Zoom、Teams等）の事前確認</li>
          <li>バックアップデバイスの準備</li>
        </ul>

        <h3>環境設定のポイント</h3>
        <p>背景は清潔感のある壁や専用の背景を使用し、顔がしっかりと照らされる照明を確保しましょう。雑音が入らない静かな環境を選ぶことも重要です。</p>

        <h3>コミュニケーションのコツ</h3>
        <p>オンラインでは相手の反応が読みにくいため、いつもより大きめのリアクションを心がけ、相手の話をしっかりと聞いている姿勢を示すことが大切です。</p>

        <h3>よくあるトラブルと対処法</h3>
        <p>接続トラブルに備えて、面接官の連絡先を事前に確認し、問題が発生した場合の連絡手段を準備しておきましょう。</p>
      </div>`,
      excerpt:
        'オンライン面接で好印象を与えるための準備方法とコミュニケーションのコツを詳しく解説。リモートワーク時代の転職成功術をお伝えします。',
      status: 'PUBLISHED',
      published_at: new Date().toISOString(),
    },
  ];

  // Insert articles
  for (const articleData of articles) {
    try {
      const { data: article, error: createError } = await supabase
        .from('articles')
        .insert(articleData)
        .select()
        .single();

      if (createError) {
        console.error('Article creation error:', createError);
        continue;
      }

      console.log('Created article:', article.title);
    } catch (error) {
      console.error('Error creating article:', error);
    }
  }

  console.log('Adding sample notices...');

  // Sample notices
  const notices = [
    {
      title: 'システムメンテナンスのお知らせ（12月15日深夜実施）',
      slug: 'system-maintenance-dec-15-' + Date.now(),
      content: `<div class="notice-content">
        <h2>メンテナンス実施日時</h2>
        <p><strong>2024年12月15日（日）午前2:00〜午前6:00（予定）</strong></p>

        <h3>メンテナンス内容</h3>
        <ul>
          <li>サーバーインフラの更新</li>
          <li>セキュリティパッチの適用</li>
          <li>データベースの最適化</li>
          <li>新機能リリースに向けた準備作業</li>
        </ul>

        <h3>影響について</h3>
        <p>メンテナンス期間中は、以下のサービスがご利用いただけません：</p>
        <ul>
          <li>求人検索・応募機能</li>
          <li>スカウトメッセージの送受信</li>
          <li>プロフィールの編集</li>
          <li>管理画面での各種操作</li>
        </ul>

        <h3>ご注意事項</h3>
        <p>メンテナンス開始直前にサービスをご利用中の場合、作業中のデータが保存されない可能性があります。事前に重要なデータは保存いただきますようお願いいたします。</p>

        <h3>お問い合わせ</h3>
        <p>メンテナンスに関してご不明な点がございましたら、サポートまでお気軽にお問い合わせください。</p>
      </div>`,
      excerpt:
        '12月15日深夜にシステムメンテナンスを実施いたします。メンテナンス期間中はサービスがご利用いただけません。詳細をご確認ください。',
      status: 'PUBLISHED',
      published_at: new Date().toISOString(),
      views_count: 0,
    },
    {
      title: '新機能「AIマッチング機能」をリリースしました',
      slug: 'ai-matching-feature-release-' + Date.now(),
      content: `<div class="notice-content">
        <h2>新機能のご紹介</h2>
        <p>この度、求職者様と企業様をより効率的にマッチングする「AIマッチング機能」をリリースいたしました。</p>

        <h3>主な機能</h3>
        <ul>
          <li><strong>スキルベースマッチング</strong>：保有スキルと求人要件の適合度を自動算出</li>
          <li><strong>キャリアパス予測</strong>：過去の転職データから最適なキャリアパスを提案</li>
          <li><strong>企業文化適合度診断</strong>：性格診断結果をもとに企業文化との適合度を分析</li>
          <li><strong>自動スカウト送信</strong>：条件に合致する候補者に自動でスカウトを送信</li>
        </ul>

        <h3>ご利用方法</h3>
        <h4>求職者の方</h4>
        <p>マイページの「AIマッチング」タブから機能をご利用いただけます。プロフィールを充実させることで、より精度の高いマッチングが可能になります。</p>

        <h4>企業の方</h4>
        <p>管理画面の「スカウト」メニューに「AIマッチング」が追加されました。求人条件を詳細に設定することで、適合度の高い候補者を効率的に見つけることができます。</p>

        <h3>今後のアップデート予定</h3>
        <p>今後も機械学習アルゴリズムの改善を続け、マッチング精度の向上を図ってまいります。ユーザーの皆様からのフィードバックをお聞かせください。</p>
      </div>`,
      excerpt:
        '求職者と企業をより効率的にマッチングする「AIマッチング機能」をリリース。スキルベースマッチングやキャリアパス予測など、充実の機能をご提供します。',
      status: 'PUBLISHED',
      published_at: new Date().toISOString(),
      views_count: 0,
    },
  ];

  // Insert notices
  for (const noticeData of notices) {
    try {
      const { data: notice, error: createError } = await supabase
        .from('notices')
        .insert(noticeData)
        .select()
        .single();

      if (createError) {
        console.error('Notice creation error:', createError);
        continue;
      }

      console.log('Created notice:', notice.title);
    } catch (error) {
      console.error('Error creating notice:', error);
    }
  }

  console.log('Sample data insertion completed!');
}

addSampleData().catch(console.error);
