import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('name');
  const limit = parseInt(searchParams.get('limit') || '10');

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ hojin_infos: [] });
  }

  try {
    const gbizApiUrl = 'https://info.gbiz.go.jp/hojin/v1/hojin';
    const params = new URLSearchParams({
      name: query.trim(),
      limit: limit.toString(),
    });

    const response = await fetch(`${gbizApiUrl}?${params}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-hojinInfo-api-token': process.env.GBIZ_API_TOKEN || '',
      },
    });

    if (!response.ok) {
      console.error('Gbiz API error:', response.status, response.statusText);
      return NextResponse.json({ hojin_infos: [] });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to search companies:', error);
    return NextResponse.json({ hojin_infos: [] });
  }
}