'use server';

import { cookies as nextCookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { container } from '@/lib/server/container';
import { TYPES } from '@/lib/server/container/types';
import { AuthController } from '@/lib/server/controllers/AuthController';

// AuthControllerのMockRequest/MockResponse型をローカルで再定義
interface MockRequest {
  body?: Record<string, unknown>;
  headers?: Record<string, unknown>;
  params?: Record<string, unknown>;
  query?: Record<string, unknown>;
}
interface MockResponse {
  status: (code: number) => MockResponse;
  json: (data: unknown) => void;
}

function encodeQuery(obj: Record<string, string | null | undefined>): string {
  return Object.entries(obj)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v ?? '')}`)
    .join('&');
}

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const userType = formData.get('userType') as string;

  // AuthControllerの取得
  const authController = container.get<AuthController>(TYPES.AuthController);

  // Express.jsのReq/Resオブジェクトを模擬
  let responseData: { [key: string]: any } = {};
  let statusCode = 200;
  const mockReq: MockRequest = { body: { email, password, userType } };
  const mockRes: MockResponse = {
    status: (code: number) => {
      statusCode = code;
      return mockRes;
    },
    json: (data: unknown) => {
      responseData = data as { [key: string]: any };
    },
  };

  await authController.login(mockReq, mockRes);

  if (responseData.success && responseData.token) {
    // クッキーをセット
    const cookieStore = await nextCookies();
    cookieStore.set('supabase-auth-token', responseData.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7日間
    });
    // ログイン成功時は /admin へリダイレクト
    redirect('/admin');
  }

  // 失敗時はエラー内容をURLパラメータに載せてリダイレクト
  const query = encodeQuery({
    error: responseData.message || 'ログインに失敗しました',
    errorDetail: responseData.errorDetail || '',
    errorStage: responseData.errorStage || '',
    email,
  });
  redirect(`/admin/auth/login?${query}`);
}
