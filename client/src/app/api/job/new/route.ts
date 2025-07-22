import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { SessionService } from '@/lib/server/core/services/SessionService';

export async function POST(request: NextRequest) {
  try {
    console.log('=== Job Creation API Started ===');
    
    // セッションからユーザーID取得
    const sessionService = new SessionService();
    const authHeader = request.headers.get('authorization');
    const cookieToken = request.cookies.get('supabase-auth-token')?.value;
    const token = authHeader?.replace('Bearer ', '') || cookieToken;
    console.log('Auth token found:', !!token);
    
    if (!token) {
      console.log('No auth token provided');
      return NextResponse.json({ success: false, error: '認証トークンがありません' }, { status: 401 });
    }
    
    console.log('Validating session...');
    const sessionResult = await sessionService.validateSession(token);
    if (!sessionResult.success || !sessionResult.sessionInfo) {
      console.log('Session validation failed:', sessionResult.error);
      return NextResponse.json({ success: false, error: '認証エラー' }, { status: 401 });
    }
    const createdBy = sessionResult.sessionInfo.user.id;
    console.log('User authenticated:', createdBy);

    // 企業ユーザーのcompany_account_idを取得
    const supabase = getSupabaseAdminClient();
    
    // セッション認証のユーザーIDとcompany_usersのIDは異なるため、メールアドレスで検索
    console.log('Searching user by email:', sessionResult.sessionInfo.user.email);
    const { data: userByEmail, error: emailError } = await supabase
      .from('company_users')
      .select('id, company_account_id, email, full_name')
      .eq('email', sessionResult.sessionInfo.user.email)
      .single();
    
    if (emailError || !userByEmail) {
      console.log('Failed to get user by email:', emailError);
      return NextResponse.json({ success: false, error: '企業アカウント情報の取得に失敗しました' }, { status: 400 });
    }
    
    console.log('Found user by email:', userByEmail);
    const actualUserId = userByEmail.id; // これが実際のcompany_usersのID
    const userCompanyAccountId = userByEmail.company_account_id;
    console.log('Actual user ID from company_users:', actualUserId);
    console.log('User company_account_id:', userCompanyAccountId);

    // company_group_idは求人作成時にフロントエンドから指定される
    // 指定されない場合はnullにする（後で管理画面で設定可能）
    console.log('Company group handling: Will use company_account_id for filtering');

    const body = await request.json();
    console.log('Request body received:', body);
    // フォームからのすべての項目を受け取る
    const {
      company_group_id: bodyCompanyGroupId,
      title,
      job_description,
      position_summary,
      required_skills,
      preferred_skills,
      salary_min,
      salary_max,
      salary_note,
      employment_type,
      work_location,
      work_locations,
      location_note,
      employment_type_note,
      working_hours,
      overtime_info,
      holidays,
      remote_work_available,
      job_type,
      job_types,
      industry,
      industries,
      selection_process,
      appeal_points,
      smoking_policy,
      smoking_policy_note,
      required_documents,
      internal_memo,
      publication_type,
      status,
      application_deadline,
      published_at,
      images, // Base64エンコードされた画像データの配列
    } = body;

    // 雇用形態の日本語→英語マッピング
    const employmentTypeMapping: Record<string, string> = {
      '正社員': 'FULL_TIME',
      '契約社員': 'CONTRACT',
      '派遣社員': 'CONTRACT', // 契約社員として扱う
      'アルバイト・パート': 'PART_TIME',
      '業務委託': 'CONTRACT', // 契約社員として扱う
      'インターン': 'INTERN'
    };
    
    const mappedEmploymentType = employmentTypeMapping[employment_type] || 'FULL_TIME';

    // 下書き保存のため必須チェックを一時的に無効化
    // if (!company_group_id || !title || !job_description || !employment_type || !work_location || !job_type || !industry) {
    //   return NextResponse.json({ success: false, error: '必須項目が不足しています' }, { status: 400 });
    // }

    // デバッグ：利用可能なcompany_user_idを確認
    console.log('=== DEBUG INFO ===');
    console.log('createdBy (session user ID):', createdBy);
    console.log('actualUserId (company_users ID):', actualUserId);
    console.log('bodyCompanyGroupId from request:', bodyCompanyGroupId);
    console.log('userCompanyAccountId:', userCompanyAccountId);
    
    // 現在のcompany_account_idに属するcompany_usersを確認
    const { data: availableUsers, error: usersError } = await supabase
      .from('company_users')
      .select('id, email, full_name')
      .eq('company_account_id', userCompanyAccountId);
    
    console.log('Available company_users for this account:', availableUsers);
    console.log('Users query error:', usersError);
    
    // company_group_idとして使用するIDを決定
    let finalCompanyGroupId = actualUserId; // デフォルトは実際のcompany_usersのID
    
    // bodyCompanyGroupIdが指定されており、利用可能なユーザーIDの中にある場合はそれを使用
    if (bodyCompanyGroupId && availableUsers?.some(user => user.id === bodyCompanyGroupId)) {
      finalCompanyGroupId = bodyCompanyGroupId;
      console.log('Using bodyCompanyGroupId:', finalCompanyGroupId);
    } else {
      console.log('Using actualUserId as fallback:', finalCompanyGroupId);
    }
    
    // 画像をSupabase Storageにアップロード
    let imageUrls: string[] = [];
    if (images && Array.isArray(images) && images.length > 0) {
      console.log('Processing images:', images.length);
      
      try {
        const uploadPromises = images.map(async (imageData: any, index: number) => {
          // Base64データから実際のファイルデータを抽出
          const { data: base64Data, contentType } = imageData;
          const buffer = Buffer.from(base64Data, 'base64');
          
          // ファイル名を生成（一意性を保つため）
          const timestamp = Date.now();
          const randomSuffix = Math.random().toString(36).substring(2, 15);
          const fileExtension = contentType.includes('jpeg') ? 'jpg' : contentType.split('/')[1];
          const fileName = `job-${finalCompanyGroupId}-${timestamp}-${index}-${randomSuffix}.${fileExtension}`;
          
          console.log('Uploading image:', fileName);
          
          // Supabase Storageにアップロード
          const { data, error } = await supabase.storage
            .from('job-images')
            .upload(fileName, buffer, {
              contentType: contentType,
              upsert: false
            });
          
          if (error) {
            console.error('Image upload error:', error);
            throw new Error(`画像のアップロードに失敗しました: ${error.message}`);
          }
          
          // パブリックURLを取得
          const { data: urlData } = supabase.storage
            .from('job-images')
            .getPublicUrl(fileName);
          
          console.log('Image uploaded successfully:', urlData.publicUrl);
          return urlData.publicUrl;
        });
        
        imageUrls = await Promise.all(uploadPromises);
        console.log('All images uploaded:', imageUrls);
        
      } catch (error) {
        console.error('Image upload process failed:', error);
        return NextResponse.json({ 
          success: false, 
          error: `画像のアップロードに失敗しました: ${error instanceof Error ? error.message : String(error)}` 
        }, { status: 500 });
      }
    }
    
    const insertData = {
      company_account_id: userCompanyAccountId,
      company_group_id: finalCompanyGroupId,
      title: title || '未設定',
      job_description: job_description || '未設定',
      position_summary: position_summary || null,
      required_skills: Array.isArray(required_skills) ? required_skills : (required_skills ? [required_skills] : []),
      preferred_skills: Array.isArray(preferred_skills) ? preferred_skills : (preferred_skills ? [preferred_skills] : []),
      salary_min: salary_min !== undefined ? Number(salary_min) : null,
      salary_max: salary_max !== undefined ? Number(salary_max) : null,
      salary_note: salary_note || null,
      employment_type: mappedEmploymentType,
      work_location: work_location || '未設定',
      work_locations: Array.isArray(work_locations) ? work_locations : (work_locations ? [work_locations] : []),
      location_note: location_note || null,
      employment_type_note: employment_type_note || null,
      working_hours: working_hours || null,
      overtime_info: overtime_info || null,
      holidays: holidays || null,
      remote_work_available: remote_work_available === true || remote_work_available === 'true',
      job_type: job_type || '未設定',
      job_types: Array.isArray(job_types) ? job_types : (job_types ? [job_types] : []),
      industry: industry || '未設定',
      industries: Array.isArray(industries) ? industries : (industries ? [industries] : []),
      selection_process: selection_process || null,
      appeal_points: Array.isArray(appeal_points) ? appeal_points : [],
      smoking_policy: smoking_policy || null,
      smoking_policy_note: smoking_policy_note || null,
      required_documents: Array.isArray(required_documents) ? required_documents : [],
      internal_memo: internal_memo || null,
      publication_type: publication_type || 'public',
      image_urls: imageUrls,
      status: status || 'DRAFT',
      application_deadline: application_deadline || null,
      published_at: published_at || null,
    };
    
    console.log('Data to insert into Supabase:', insertData);
    
    const { data, error } = await supabase.from('job_postings').insert([insertData]);
    
    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    
    console.log('Job created successfully:', data);
    return NextResponse.json({ success: true, data });
  } catch (e: any) {
    console.error('Job creation API error:', e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
