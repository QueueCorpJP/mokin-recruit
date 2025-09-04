const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mjhqeagxibsklugikyma.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qaHFlYWd4aWJza2x1Z2lreW1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMjY1MzcsImV4cCI6MjA2NTkwMjUzN30.pNWyWJ1OxchoKfEJTsn7KC1yduaR6S6xETmfbrUdHIk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function getCompanies() {
  try {
    const { data, error } = await supabase
      .from('company_accounts')
      .select('id, company_name, created_at')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('データベースエラー:', error);
      return;
    }
    
    console.log('=== 存在する企業一覧 ===');
    if (data && data.length > 0) {
      data.forEach((company, index) => {
        console.log(`${index + 1}. ID: ${company.id}`);
        console.log(`   企業名: ${company.company_name}`);
        console.log(`   作成日: ${new Date(company.created_at).toLocaleString('ja-JP')}`);
        console.log('');
      });
    } else {
      console.log('企業データが見つかりません');
      console.log('');
      console.log('💡 新規企業作成ページで企業を作成してください:');
      console.log('http://localhost:3000/admin/company/new');
    }
  } catch (error) {
    console.error('接続エラー:', error.message);
  }
}

getCompanies();
