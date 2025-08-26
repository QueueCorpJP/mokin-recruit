import { NextRequest } from 'next/server';
import { requireCandidateAuthForAPI } from '@/lib/auth/server';
import { getRooms } from '@/lib/rooms';

export async function GET(request: NextRequest) {
  try {
    // 候補者認証を確認
    const authResult = await requireCandidateAuthForAPI(request);
    
    if (!authResult.success) {
      return Response.json(
        { error: authResult.error },
        { status: 401 }
      );
    }

    const { candidateId } = authResult.data;

    // ルーム一覧を取得
    const rooms = await getRooms(candidateId, 'candidate');

    return Response.json({ rooms });
  } catch (error) {
    console.error('Failed to fetch task data:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}