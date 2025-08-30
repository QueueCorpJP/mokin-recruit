# Mokin Recruit - コーディングレギュレーション / ルール

## 技術スタック概要

```yaml
framework: "Next.js 15 (App Router)"
runtime: "React 19 + Node.js 20+"
language: "TypeScript 5.x"
styling: "Tailwind CSS v4"
database: "Supabase (PostgreSQL)"
authentication: "Supabase Auth + JWT"
dependency_injection: "Inversify.js"
validation: "Zod"
state_management: "Zustand + React Query"
monorepo: "npm workspaces"
```

## 命名規則

- **変数名・関数名**: キャメルケース（camelCase）
  ```typescript
  const userName = 'example';
  const getUserProfile = async () => {};
  ```
- **コンポーネント名**: パスカルケース（PascalCase）
  ```typescript
  const CandidateProfileForm = () => {};
  const AdminDashboardClient = () => {};
  ```
- **定数**: スネークケース大文字（UPPER_SNAKE_CASE）
  ```typescript
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  ```
- **ファイル名**: ケバブケース（kebab-case）またはパスカルケース
  ```
  components/candidate/profile-form.tsx
  components/AdminDashboard.tsx
  ```

## ディレクトリ構成

```
mokin-recruit/
├── client/src/               # フロントエンド・APIルート
│   ├── app/                  # Next.js App Router
│   │   ├── admin/           # 管理者機能
│   │   ├── candidate/       # 候補者機能
│   │   ├── company/         # 企業機能
│   │   └── api/             # APIルート
│   ├── components/          # 再利用可能コンポーネント
│   │   ├── ui/              # 汎用UIコンポーネント
│   │   ├── candidate/       # 候補者専用コンポーネント
│   │   ├── company/         # 企業専用コンポーネント
│   │   └── admin/           # 管理者専用コンポーネント
│   ├── lib/                 # ビジネスロジック・ユーティリティ
│   │   ├── server/          # サーバーサイドロジック
│   │   ├── supabase/        # Supabase関連処理
│   │   ├── auth/            # 認証関連
│   │   └── utils/           # ユーティリティ関数
│   ├── hooks/               # カスタムReactフック
│   ├── types/               # TypeScript型定義
│   ├── stores/              # Zustand状態管理
│   └── config/              # 設定ファイル
└── packages/shared-types/   # 共有型定義
```

## コンポーネント設計原則

### Server Components vs Client Components
```typescript
// Server Component（デフォルト）
export default async function CandidateProfile({ params }: Props) {
  const data = await getCandidateProfile(params.id);
  return <ProfileDisplay data={data} />;
}

// Client Component（'use client'ディレクティブ）
'use client';
export default function InteractiveForm() {
  const [state, setState] = useState();
  // ...
}
```

### Props型定義
```typescript
interface CandidateProfileProps {
  candidate: Database['public']['Tables']['candidates']['Row'];
  isEditable?: boolean;
  onUpdate?: (data: CandidateUpdateData) => Promise<void>;
}
```

## エラーハンドリング

### Next.js API Routes
```typescript
// app/api/candidates/route.ts
export async function GET(request: Request) {
  try {
    const data = await candidateService.getAll();
    return NextResponse.json(data);
  } catch (error) {
    logger.error('Failed to fetch candidates', { error });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Client Side Error Boundaries
```typescript
// components/ui/error-boundary.tsx
'use client';
export default function ErrorBoundary({ 
  error, 
  reset 
}: { 
  error: Error; 
  reset: () => void; 
}) {
  return (
    <div className="error-container">
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

## 認証・認可

### Supabase Auth + Row Level Security
```typescript
// lib/auth/supabase-auth.ts
export const createClientAuth = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

// Middleware for protected routes
export async function authMiddleware(request: NextRequest) {
  const supabase = createServerClient(/* ... */);
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
}
```

### 権限チェック
```typescript
// lib/auth/permissions.ts
export const checkUserPermission = async (
  userId: string, 
  resource: string, 
  action: string
) => {
  const { data } = await supabase
    .from('user_permissions')
    .select('*')
    .eq('user_id', userId)
    .eq('resource', resource)
    .eq('action', action);
    
  return data?.length > 0;
};
```

## データベース操作

### Supabase Client パターン
```typescript
// lib/supabase/candidates.ts
export class CandidateRepository {
  constructor(private supabase: SupabaseClient) {}
  
  async findById(id: string): Promise<Candidate | null> {
    const { data, error } = await this.supabase
      .from('candidates')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw new DatabaseError(error.message);
    return data;
  }
}
```

### 型安全性の確保
```typescript
// Supabase型定義の活用
type Candidate = Database['public']['Tables']['candidates']['Row'];
type CandidateInsert = Database['public']['Tables']['candidates']['Insert'];
type CandidateUpdate = Database['public']['Tables']['candidates']['Update'];
```

## バリデーション

### Zod スキーマ
```typescript
// lib/schema/candidate.ts
export const candidateProfileSchema = z.object({
  firstName: z.string().min(1, '名前は必須です'),
  lastName: z.string().min(1, '苗字は必須です'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  skills: z.array(z.string()).min(1, 'スキルを少なくとも1つ選択してください'),
});

export type CandidateProfileFormData = z.infer<typeof candidateProfileSchema>;
```

## 状態管理

### Zustand Store
```typescript
// stores/auth-store.ts
interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },
}));
```

### React Query
```typescript
// hooks/use-candidates.ts
export const useCandidates = () => {
  return useQuery({
    queryKey: ['candidates'],
    queryFn: () => candidateService.getAll(),
    staleTime: 5 * 60 * 1000, // 5分
  });
};
```

## 環境変数管理

### 必須環境変数
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

### 型安全な環境変数
```typescript
// config/env.ts
const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  SUPABASE_SERVICE_ROLE_KEY: z.string(),
});

export const env = envSchema.parse(process.env);
```

## パフォーマンス最適化

### 画像最適化
```typescript
// Next.js Image コンポーネント使用
import Image from 'next/image';

<Image
  src="/candidate-avatar.jpg"
  alt="候補者プロフィール"
  width={150}
  height={150}
  priority={isAboveTheFold}
/>
```

### 動的インポート
```typescript
// 重いコンポーネントの遅延読み込み
const AdminAnalytics = dynamic(() => import('@/components/admin/analytics'), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});
```

## テスト戦略

### Unit Testing (Jest + Testing Library)
```typescript
// __tests__/components/candidate-form.test.tsx
describe('CandidateForm', () => {
  it('validates required fields', async () => {
    render(<CandidateForm />);
    
    const submitButton = screen.getByRole('button', { name: /送信/ });
    await user.click(submitButton);
    
    expect(screen.getByText('名前は必須です')).toBeInTheDocument();
  });
});
```

## セキュリティ

### Row Level Security (RLS)
```sql
-- Supabase RLS ポリシー例
CREATE POLICY "Users can only view their own profile" ON candidates
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Companies can only view approved candidates" ON candidates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM company_users 
      WHERE user_id = auth.uid() 
      AND company_id IN (SELECT company_id FROM candidate_company_permissions WHERE candidate_id = candidates.id)
    )
  );
```

### XSS対策
```typescript
// HTMLコンテンツのサニタイズ
import DOMPurify from 'dompurify';

const sanitizedContent = DOMPurify.sanitize(userGeneratedContent);
```