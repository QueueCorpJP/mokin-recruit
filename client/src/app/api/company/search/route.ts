import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('name');
  const limit = parseInt(searchParams.get('limit') || '10');

  console.log('Company search request:', { query, limit });

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ hojin_infos: [] });
  }

  try {
    // Create mock data for now since Gbiz API is having issues
    const mockCompanies = [
      {
        hojin_bangou: '1234567890123',
        name: query.includes('東京') ? '東京電力株式会社' : 
              query.includes('山田') ? '山田商事株式会社' :
              query.includes('ヤマダ') ? 'ヤマダ電機株式会社' :
              `${query}株式会社`,
        location: '東京都',
        corporate_number: '1234567890123'
      },
      {
        hojin_bangou: '1234567890124',
        name: query.includes('東京') ? '東京ガス株式会社' : 
              query.includes('山田') ? '山田工業株式会社' :
              query.includes('ヤマダ') ? 'ヤマダホームズ株式会社' :
              `${query}工業株式会社`,
        location: '東京都',
        corporate_number: '1234567890124'
      },
      {
        hojin_bangou: '1234567890125',
        name: query.includes('東京') ? '東京メトロ株式会社' : 
              query.includes('山田') ? '山田建設株式会社' :
              query.includes('ヤマダ') ? 'ヤマダフィナンシャル株式会社' :
              `${query}サービス株式会社`,
        location: '東京都',
        corporate_number: '1234567890125'
      }
    ].slice(0, limit);

    console.log('Returning mock companies:', mockCompanies.length);
    
    return NextResponse.json({
      hojin_infos: mockCompanies
    });
  } catch (error) {
    console.error('Failed to search companies:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}