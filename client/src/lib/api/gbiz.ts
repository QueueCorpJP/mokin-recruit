// Gbiz API client for company name suggestions
const GBIZ_API_KEY = '8OkrmyrMcPzyJSbJWepoq5QCnH8gSjQP';
const GBIZ_BASE_URL = 'https://info.gbiz.go.jp/hojin/v1';

export interface CompanySuggestion {
  id: string;
  name: string;
  address?: string;
  corporateNumber?: string;
}

export interface GbizSearchResponse {
  hojin_infos: Array<{
    hojin_bangou: string;
    name: string;
    location: string;
    corporate_number: string;
  }>;
}

export class GbizApiClient {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = GBIZ_API_KEY;
    this.baseUrl = GBIZ_BASE_URL;
  }

  async searchCompanies(query: string, limit = 10): Promise<CompanySuggestion[]> {
    if (!query || query.trim().length < 2) {
      return [];
    }

    try {
      const params = new URLSearchParams({
        name: query.trim(),
        limit: limit.toString(),
        key: this.apiKey,
      });

      const response = await fetch(`${this.baseUrl}/hojin?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn('Gbiz API request failed:', response.status, response.statusText);
        return [];
      }

      const data: GbizSearchResponse = await response.json();
      
      return data.hojin_infos?.map((company) => ({
        id: company.corporate_number || company.hojin_bangou,
        name: company.name,
        address: company.location,
        corporateNumber: company.corporate_number,
      })) || [];
    } catch (error) {
      console.error('Failed to search companies:', error);
      return [];
    }
  }
}

export const gbizApiClient = new GbizApiClient();