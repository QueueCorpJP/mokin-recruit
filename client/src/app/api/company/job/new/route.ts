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
    
    // X-User-Idヘッダーからcompany_users.idを取得
    const companyUserId = request.headers.get('x-user-id');
    
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
    
    console.log('User authenticated:', sessionResult.sessionInfo.user.email);

    // 企業ユーザーのcompany_account_idを取得
    const supabase = getSupabaseAdminClient();
    
    let actualUserId: string | null = null;
    let userCompanyAccountId: string | null = null;
    
    // X-User-Idヘッダーがある場合は直接検索（最適化）
    if (companyUserId) {
      console.log('Using X-User-Id header for optimized lookup:', companyUserId);
      
      const { data: userByIdData, error: userByIdError } = await supabase
        .from('company_users')
        .select('id, company_account_id, email, full_name')
        .eq('id', companyUserId)
        .single();
      
      if (!userByIdError && userByIdData) {
        // セキュリティチェック：セッションのメールアドレスと一致するか確認
        if (userByIdData.email === sessionResult.sessionInfo.user.email) {
          actualUserId = userByIdData.id;
          userCompanyAccountId = userByIdData.company_account_id;
          console.log('✅ Optimized lookup successful');
        } else {
          console.warn('⚠️ Security check failed: email mismatch');
        }
      }
    }
    
    // フォールバック：メールアドレスで検索
    if (!actualUserId || !userCompanyAccountId) {
      console.log('Falling back to email lookup...');
      
      const { data: userByEmail, error: emailError } = await supabase
        .from('company_users')
        .select('id, company_account_id, email, full_name')
        .eq('email', sessionResult.sessionInfo.user.email)
        .single();
      
      if (emailError || !userByEmail) {
        console.log('Failed to get user by email:', emailError);
        return NextResponse.json({ success: false, error: '企業アカウント情報の取得に失敗しました' }, { status: 400 });
      }
      
      actualUserId = userByEmail.id;
      userCompanyAccountId = userByEmail.company_account_id;
      console.log('📧 Email lookup successful');
    }
    
    console.log('User data:', { actualUserId, userCompanyAccountId });

    // company_group_idは求人作成時にフロントエンドから指定される
    console.log('Company group handling: Will use company_account_id for filtering');

    const body = await request.json();
    console.log('Request body received');
    
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
      work_locations,
      location_note,
      employment_type_note,
      working_hours,
      overtime,
      overtime_info,
      holidays,
      remote_work_available,
      job_types,
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

    // デバッグ：受信データをログ出力
    console.log('=== RECEIVED DATA DEBUG ===');
    console.log('required_skills:', required_skills, 'type:', typeof required_skills);
    console.log('preferred_skills:', preferred_skills, 'type:', typeof preferred_skills);
    console.log('job_types:', job_types, 'isArray:', Array.isArray(job_types));
    console.log('industries:', industries, 'isArray:', Array.isArray(industries));
    console.log('work_locations:', work_locations, 'isArray:', Array.isArray(work_locations));
    console.log('appeal_points:', appeal_points, 'isArray:', Array.isArray(appeal_points));
    console.log('=== END DEBUG ===');

    // 雇用形態の日本語→英語マッピング
    const employmentTypeMapping: Record<string, string> = {
      '正社員': 'FULL_TIME',
      '契約社員': 'CONTRACT',
      '派遣社員': 'CONTRACT',
      'アルバイト・パート': 'PART_TIME',
      '業務委託': 'CONTRACT',
      'インターン': 'INTERN'
    };
    
    const mappedEmploymentType = employmentTypeMapping[employment_type] || 'FULL_TIME';

    // 現在のcompany_account_idに属するcompany_usersを確認
    const { data: availableUsers, error: usersError } = await supabase
      .from('company_users')
      .select('id, email, full_name')
      .eq('company_account_id', userCompanyAccountId);
    
    console.log('Available company_users for this account:', availableUsers?.length);
    
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
    
    // 配列フィールドの処理を強化
    const ensureArray = (value: any): string[] => {
      console.log('ensureArray input:', value, 'type:', typeof value);
      if (Array.isArray(value)) {
        console.log('ensureArray result (already array):', value);
        return value.filter(v => v && typeof v === 'string');
      }
      if (value && typeof value === 'string') {
        console.log('ensureArray result (string to array):', [value]);
        return [value];
      }
      console.log('ensureArray result (empty):', []);
      return [];
    };

    // テキストフィールドの処理（配列から文字列に変換）
    const ensureText = (value: any): string | null => {
      console.log('ensureText input:', value, 'type:', typeof value);
      if (typeof value === 'string') {
        console.log('ensureText result (already string):', value);
        return value || null;
      }
      if (Array.isArray(value)) {
        const textResult = value.filter(v => v && typeof v === 'string').join(', ');
        console.log('ensureText result (array to string):', textResult);
        return textResult || null;
      }
      console.log('ensureText result (null):', null);
      return null;
    };

    const insertData = {
      company_account_id: userCompanyAccountId,
      company_group_id: finalCompanyGroupId,
      title: title || '未設定',
      job_description: job_description || '未設定',
      position_summary: position_summary || null,
      required_skills: ensureText(required_skills),
      preferred_skills: ensureText(preferred_skills),
      salary_min: salary_min !== undefined ? Number(salary_min) : null,
      salary_max: salary_max !== undefined ? Number(salary_max) : null,
      salary_note: salary_note || null,
      employment_type: mappedEmploymentType,
      work_location: ensureArray(work_locations),
      location_note: location_note || null,
      employment_type_note: employment_type_note || null,
      working_hours: working_hours || null,
      overtime: overtime || 'あり',
      overtime_info: overtime_info || null,
      holidays: holidays || null,
      remote_work_available: remote_work_available === true || remote_work_available === 'true',
      job_type: ensureArray(job_types),
      industry: ensureArray(industries),
      selection_process: selection_process || null,
      appeal_points: ensureArray(appeal_points),
      smoking_policy: smoking_policy || null,
      smoking_policy_note: smoking_policy_note || null,
      required_documents: ensureArray(required_documents),
      internal_memo: internal_memo || null,
      publication_type: publication_type || 'public',
      image_urls: imageUrls,
      status: status || 'PENDING_APPROVAL',
      application_deadline: application_deadline || null,
      published_at: published_at || null,
    };
    
    // デバッグ：insertDataの配列フィールドをログ出力
    console.log('=== INSERT DATA DEBUG ===');
    console.log('insertData.job_type:', insertData.job_type);
    console.log('insertData.industry:', insertData.industry);
    console.log('insertData.work_location:', insertData.work_location);
    console.log('insertData.appeal_points:', insertData.appeal_points);
    console.log('=== END INSERT DATA DEBUG ===');
    
    console.log('Creating job posting...');
    
    const { data, error } = await supabase.from('job_postings').insert([insertData]);
    
    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    
    console.log('Job created successfully');
    console.log('Insert result data:', data);
    return NextResponse.json({ success: true, data });
  } catch (e: any) {
    console.error('Job creation API error:', e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
