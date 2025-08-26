import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { logger } from '@/lib/server/utils/logger';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';

// リクエストボディの型定義
const profileSchema = z.object({
  // 認証情報
  userId: z.string().uuid('Invalid user ID format'),
  // 基本情報
  lastName: z.string().min(1, 'Last name is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastNameKana: z.string().optional(),
  firstNameKana: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  birthDate: z.string().optional(), 
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  // 教育情報
  educationLevel: z.enum(['high_school', 'technical_college', 'university', 'graduate_school', 'other']).optional(),
  schoolName: z.string().optional(),
  major: z.string().optional(),
  graduationYear: z.number().int().min(1900).max(2100).optional(),
  // 就職希望情報
  jobPreferences: z.object({
    preferredIndustries: z.array(z.string()).optional(),
    preferredLocations: z.array(z.string()).optional(),
    desiredSalary: z.number().optional(),
    workStyle: z.enum(['full_time', 'part_time', 'contract', 'freelance']).optional(),
  }).optional(),
});

type ProfileRequestBody = z.infer<typeof profileSchema>;

/**
 * 候補者個人情報入力 API Route
 * POST /api/auth/register/candidate/profile
 */
export async function POST(request: NextRequest) {
  try {
    // リクエストボディの取得と型安全性の確保
    const body = await request.json();

    // バリデーション
    const validationResult = profileSchema.safeParse(body);
    if (!validationResult.success) {
      logger.warn(
        'Profile validation failed:',
        validationResult.error.errors
      );
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request data',
          errors: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const profileData = validationResult.data;

    // Supabase管理者クライアントを取得
    const supabaseAdmin = getSupabaseAdminClient();

    // ユーザーの存在確認
    const { data: existingUser, error: userError } = await supabaseAdmin.auth.admin.getUserById(profileData.userId);
    
    if (userError || !existingUser.user) {
      logger.warn(`User not found: ${profileData.userId}`);
      return NextResponse.json(
        {
          success: false,
          message: 'ユーザーが見つかりません',
        },
        { status: 404 }
      );
    }

    // candidatesテーブルの更新
    const { data: updateData, error: updateError } = await supabaseAdmin
      .from('candidates')
      .update({
        last_name: profileData.lastName,
        first_name: profileData.firstName,
        last_name_kana: profileData.lastNameKana || null,
        first_name_kana: profileData.firstNameKana || null,
        gender: profileData.gender || null,
        birth_date: profileData.birthDate || null,
        phone_number: profileData.phoneNumber || null,
        address: profileData.address || null,
        education_level: profileData.educationLevel || null,
        school_name: profileData.schoolName || null,
        major: profileData.major || null,
        graduation_year: profileData.graduationYear || null,
        job_preferences: profileData.jobPreferences || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', profileData.userId)
      .select();

    if (updateError) {
      logger.error(`Failed to update candidate profile for user ${profileData.userId}:`, updateError);
      
      // candidatesレコードが存在しない場合は作成を試行
      if (updateError.code === 'PGRST116') {
        const { data: insertData, error: insertError } = await supabaseAdmin
          .from('candidates')
          .insert({
            id: profileData.userId,
            email: existingUser.user.email!,
            last_name: profileData.lastName,
            first_name: profileData.firstName,
            last_name_kana: profileData.lastNameKana || null,
            first_name_kana: profileData.firstNameKana || null,
            gender: profileData.gender || null,
            birth_date: profileData.birthDate || null,
            phone_number: profileData.phoneNumber || null,
            address: profileData.address || null,
            education_level: profileData.educationLevel || null,
            school_name: profileData.schoolName || null,
            major: profileData.major || null,
            graduation_year: profileData.graduationYear || null,
            job_preferences: profileData.jobPreferences || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select();

        if (insertError) {
          logger.error(`Failed to create candidate record for user ${profileData.userId}:`, insertError);
          return NextResponse.json(
            {
              success: false,
              message: 'プロフィール情報の保存に失敗しました',
              error: insertError.message,
            },
            { status: 500 }
          );
        }

        logger.info(`Candidate profile created for user: ${profileData.userId}`);
      } else {
        return NextResponse.json(
          {
            success: false,
            message: 'プロフィール情報の更新に失敗しました',
            error: updateError.message,
          },
          { status: 500 }
        );
      }
    } else {
      logger.info(`Candidate profile updated for user: ${profileData.userId}`);
    }

    // ユーザーメタデータも更新（プロフィール完了フラグ）
    const { error: metadataError } = await supabaseAdmin.auth.admin.updateUserById(
      profileData.userId,
      {
        user_metadata: {
          ...existingUser.user.user_metadata,
          profile_completed: true,
          profile_updated_at: new Date().toISOString(),
        },
      }
    );

    if (metadataError) {
      logger.warn(`Failed to update user metadata for ${profileData.userId}:`, metadataError);
      // メタデータの更新に失敗してもプロフィール情報は保存されているので継続
    }

    return NextResponse.json({
      success: true,
      message: 'プロフィール情報が保存されました',
      data: {
        userId: profileData.userId,
        profileCompleted: true,
      },
    });
  } catch (error) {
    logger.error('API Route error - save profile:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * 候補者プロフィール取得 API Route
 * GET /api/auth/register/candidate/profile?userId=xxx
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: 'User ID is required',
        },
        { status: 400 }
      );
    }

    // Supabase管理者クライアントを取得
    const supabaseAdmin = getSupabaseAdminClient();

    // candidatesテーブルからプロフィール情報を取得
    const { data: profileData, error: fetchError } = await supabaseAdmin
      .from('candidates')
      .select('*')
      .eq('id', userId)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          {
            success: false,
            message: 'プロフィール情報が見つかりません',
          },
          { status: 404 }
        );
      }

      logger.error(`Failed to fetch candidate profile for user ${userId}:`, fetchError);
      return NextResponse.json(
        {
          success: false,
          message: 'プロフィール情報の取得に失敗しました',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: profileData,
    });
  } catch (error) {
    logger.error('API Route error - get profile:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 