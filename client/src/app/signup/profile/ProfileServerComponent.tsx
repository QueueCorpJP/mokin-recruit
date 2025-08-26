import { redirect } from 'next/navigation';
import ProfileClient from './ProfileClient';

export default async function ProfileServerComponent() {
  try {
    // Supabaseクライアントを動的にインポート
    const { createClient } = await import('@supabase/supabase-js');
    
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      redirect('/signup');
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: false,
      },
    });

    // ユーザー認証状態をチェック
    const { data: { user }, error } = await supabase.auth.getUser();

    // 認証されていない場合はsignupページにリダイレクト
    if (error || !user) {
      redirect('/signup');
    }

    // candidatesテーブルに該当ユーザーが存在するかチェック
    const { data: candidate, error: candidateError } = await supabase
      .from('candidates')
      .select('id, email')
      .eq('id', user.id)
      .single();

    // candidatesテーブルにレコードがない場合もsignupページにリダイレクト
    if (candidateError || !candidate) {
      redirect('/signup');
    }

    return <ProfileClient />;
  } catch (error) {
    console.error('ProfileServerComponent error:', error);
    redirect('/signup');
  }
}