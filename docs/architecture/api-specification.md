# 🔌 API Specification - Mokin Recruit

## 🎯 API設計概要

Mokin RecruitのREST APIは、**OpenAPI
3.1仕様**に準拠したエンタープライズ級APIとして設計されています。**RESTful原則**、**型安全性**、**セキュリティファースト**の設計思想に基づき、高度な拡張性と保守性を実現しています。

---

## 📊 API アーキテクチャ概要

### **設計原則**

```yaml
architecture:
  style: 'RESTful API'
  specification: 'OpenAPI 3.1'
  authentication: 'JWT Bearer Token + Supabase Auth'
  content_type: 'application/json'
  error_handling: 'RFC 7807 Problem Details'
  versioning: 'URI Versioning (/v1/)'
  rate_limiting: 'Token Bucket Algorithm'
  security: 'OWASP API Security Top 10 準拠'
```

### **ベースURL構造**

```
Production:  https://api.mokin-recruit.com/v1
Staging:     https://api-staging.mokin-recruit.com/v1
Development: http://localhost:3000/api/v1
```

---

## 🔒 認証・セキュリティ

### **認証方式**

```yaml
authentication:
  primary: 'JWT Bearer Token'
  secondary: 'Supabase Auth Integration'
  refresh: 'Refresh Token Rotation'
  session_duration: '24 hours'
  refresh_duration: '30 days'
```

### **セキュリティヘッダー**

```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
X-API-Version: v1
X-Request-ID: <uuid>
```

---

## 📋 API エンドポイント一覧

### **🔐 認証 API (Authentication)**

#### **POST /auth/login**

**目的**: ユーザーログイン認証

```yaml
summary: 'ユーザーログイン'
description: 'メールアドレスとパスワードによる認証を実行し、JWTトークンを発行'
operationId: 'authenticateUser'
tags: ['Authentication']

requestBody:
  required: true
  content:
    application/json:
      schema:
        type: object
        required: [email, password]
        properties:
          email:
            type: string
            format: email
            description: 'ユーザーのメールアドレス'
            example: 'user@example.com'
          password:
            type: string
            format: password
            minLength: 8
            description: 'ユーザーのパスワード'
            example: 'securePassword123'

responses:
  200:
    description: '認証成功'
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/AuthResult'
  400:
    description: 'リクエスト不正'
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/ErrorResponse'
  401:
    description: '認証失敗'
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/ErrorResponse'
  429:
    description: 'レート制限超過'
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/ErrorResponse'
```

#### **POST /auth/register/candidate**

**目的**: 候補者ユーザー登録

```yaml
summary: '候補者登録'
description: '新規候補者アカウントの作成'
operationId: 'registerCandidate'
tags: ['Authentication', 'Candidates']

requestBody:
  required: true
  content:
    application/json:
      schema:
        $ref: '#/components/schemas/CandidateRegistrationRequest'

responses:
  201:
    description: '登録成功'
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/AuthResult'
  400:
    description: 'バリデーションエラー'
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/ValidationErrorResponse'
  409:
    description: 'メールアドレス重複'
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/ErrorResponse'
```

#### **POST /auth/register/company**

**目的**: 企業ユーザー登録

```yaml
summary: '企業登録'
description: '新規企業アカウントとユーザーの作成'
operationId: 'registerCompany'
tags: ['Authentication', 'Companies']

requestBody:
  required: true
  content:
    application/json:
      schema:
        $ref: '#/components/schemas/CompanyRegistrationRequest'

responses:
  201:
    description: '登録成功'
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/AuthResult'
  400:
    description: 'バリデーションエラー'
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/ValidationErrorResponse'
```

#### **POST /auth/refresh**

**目的**: トークンリフレッシュ

```yaml
summary: 'トークンリフレッシュ'
description: 'リフレッシュトークンを使用してアクセストークンを更新'
operationId: 'refreshToken'
tags: ['Authentication']

requestBody:
  required: true
  content:
    application/json:
      schema:
        type: object
        required: [refreshToken]
        properties:
          refreshToken:
            type: string
            description: 'リフレッシュトークン'

responses:
  200:
    description: 'リフレッシュ成功'
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/AuthResult'
  401:
    description: '無効なリフレッシュトークン'
```

#### **POST /auth/logout**

**目的**: ログアウト

```yaml
summary: 'ログアウト'
description: '現在のセッションを無効化'
operationId: 'logout'
tags: ['Authentication']
security:
  - BearerAuth: []

responses:
  200:
    description: 'ログアウト成功'
    content:
      application/json:
        schema:
          type: object
          properties:
            success:
              type: boolean
              example: true
            message:
              type: string
              example: 'Successfully logged out'
```

---

### **👤 候補者 API (Candidates)**

#### **GET /candidates/profile**

**目的**: 候補者プロフィール取得

```yaml
summary: '候補者プロフィール取得'
description: '認証された候補者の詳細プロフィール情報を取得'
operationId: 'getCandidateProfile'
tags: ['Candidates']
security:
  - BearerAuth: []

responses:
  200:
    description: 'プロフィール取得成功'
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/Candidate'
  401:
    description: '認証が必要'
  403:
    description: '候補者権限が必要'
```

#### **PUT /candidates/profile**

**目的**: 候補者プロフィール更新

```yaml
summary: '候補者プロフィール更新'
description: '認証された候補者のプロフィール情報を更新'
operationId: 'updateCandidateProfile'
tags: ['Candidates']
security:
  - BearerAuth: []

requestBody:
  required: true
  content:
    application/json:
      schema:
        $ref: '#/components/schemas/CandidateProfileUpdateRequest'

responses:
  200:
    description: '更新成功'
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/Candidate'
  400:
    description: 'バリデーションエラー'
  401:
    description: '認証が必要'
```

#### **GET /candidates/search**

**目的**: 候補者検索（企業向け）

```yaml
summary: '候補者検索'
description: '企業が候補者を検索・スカウト対象を探索'
operationId: 'searchCandidates'
tags: ['Candidates', 'Search']
security:
  - BearerAuth: []

parameters:
  - name: skills
    in: query
    description: 'スキル検索（カンマ区切り）'
    schema:
      type: string
      example: 'JavaScript,React,Node.js'
  - name: industries
    in: query
    description: '希望業界（カンマ区切り）'
    schema:
      type: string
      example: 'IT,金融'
  - name: locations
    in: query
    description: '希望勤務地（カンマ区切り）'
    schema:
      type: string
      example: '東京,大阪'
  - name: experienceYears
    in: query
    description: '経験年数の範囲'
    schema:
      type: string
      example: '3-5'
  - name: page
    in: query
    description: 'ページ番号'
    schema:
      type: integer
      minimum: 1
      default: 1
  - name: limit
    in: query
    description: '1ページあたりの件数'
    schema:
      type: integer
      minimum: 1
      maximum: 100
      default: 20

responses:
  200:
    description: '検索結果'
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/CandidateSearchResult'
  401:
    description: '認証が必要'
  403:
    description: '企業権限が必要'
```

---

### **🏢 企業 API (Companies)**

#### **GET /companies/profile**

**目的**: 企業プロフィール取得

```yaml
summary: '企業プロフィール取得'
description: '認証された企業の詳細プロフィール情報を取得'
operationId: 'getCompanyProfile'
tags: ['Companies']
security:
  - BearerAuth: []

responses:
  200:
    description: '企業プロフィール取得成功'
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/CompanyAccount'
  401:
    description: '認証が必要'
  403:
    description: '企業権限が必要'
```

#### **PUT /companies/profile**

**目的**: 企業プロフィール更新

```yaml
summary: '企業プロフィール更新'
description: '認証された企業のプロフィール情報を更新'
operationId: 'updateCompanyProfile'
tags: ['Companies']
security:
  - BearerAuth: []

requestBody:
  required: true
  content:
    application/json:
      schema:
        $ref: '#/components/schemas/CompanyProfileUpdateRequest'

responses:
  200:
    description: '更新成功'
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/CompanyAccount'
  400:
    description: 'バリデーションエラー'
  401:
    description: '認証が必要'
```

---

### **💼 求人 API (Job Postings)**

#### **GET /jobs**

**目的**: 求人一覧取得

```yaml
summary: '求人一覧取得'
description: '公開中の求人情報を検索・取得'
operationId: 'getJobPostings'
tags: ['Jobs']

parameters:
  - name: keywords
    in: query
    description: 'キーワード検索'
    schema:
      type: string
      example: 'エンジニア'
  - name: industries
    in: query
    description: '業界フィルター'
    schema:
      type: string
      example: 'IT,金融'
  - name: locations
    in: query
    description: '勤務地フィルター'
    schema:
      type: string
      example: '東京,大阪'
  - name: employmentTypes
    in: query
    description: '雇用形態フィルター'
    schema:
      type: string
      example: '正社員,契約社員'
  - name: page
    in: query
    schema:
      type: integer
      minimum: 1
      default: 1
  - name: limit
    in: query
    schema:
      type: integer
      minimum: 1
      maximum: 50
      default: 20

responses:
  200:
    description: '求人一覧取得成功'
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/JobPostingSearchResult'
```

#### **POST /jobs**

**目的**: 求人投稿作成

```yaml
summary: '求人投稿作成'
description: '新規求人情報の作成'
operationId: 'createJobPosting'
tags: ['Jobs']
security:
  - BearerAuth: []

requestBody:
  required: true
  content:
    application/json:
      schema:
        $ref: '#/components/schemas/JobPostingCreateRequest'

responses:
  201:
    description: '求人作成成功'
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/JobPosting'
  400:
    description: 'バリデーションエラー'
  401:
    description: '認証が必要'
  403:
    description: '企業権限が必要'
```

#### **GET /jobs/{jobId}**

**目的**: 求人詳細取得

```yaml
summary: '求人詳細取得'
description: '指定された求人の詳細情報を取得'
operationId: 'getJobPosting'
tags: ['Jobs']

parameters:
  - name: jobId
    in: path
    required: true
    description: '求人ID'
    schema:
      type: string
      format: uuid

responses:
  200:
    description: '求人詳細取得成功'
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/JobPosting'
  404:
    description: '求人が見つからない'
```

---

### **💬 メッセージ API (Messages)**

#### **GET /messages**

**目的**: メッセージ一覧取得

```yaml
summary: 'メッセージ一覧取得'
description: '認証されたユーザーのメッセージ履歴を取得'
operationId: 'getMessages'
tags: ['Messages']
security:
  - BearerAuth: []

parameters:
  - name: type
    in: query
    description: 'メッセージタイプフィルター'
    schema:
      type: string
      enum: [SCOUT, APPLICATION, GENERAL, SYSTEM]
  - name: status
    in: query
    description: 'ステータスフィルター'
    schema:
      type: string
      enum: [UNREAD, READ, ARCHIVED]
  - name: page
    in: query
    schema:
      type: integer
      minimum: 1
      default: 1
  - name: limit
    in: query
    schema:
      type: integer
      minimum: 1
      maximum: 100
      default: 20

responses:
  200:
    description: 'メッセージ一覧取得成功'
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/MessageSearchResult'
  401:
    description: '認証が必要'
```

#### **POST /messages**

**目的**: メッセージ送信

```yaml
summary: 'メッセージ送信'
description: '新規メッセージの送信'
operationId: 'sendMessage'
tags: ['Messages']
security:
  - BearerAuth: []

requestBody:
  required: true
  content:
    application/json:
      schema:
        $ref: '#/components/schemas/MessageSendRequest'

responses:
  201:
    description: 'メッセージ送信成功'
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/Message'
  400:
    description: 'バリデーションエラー'
  401:
    description: '認証が必要'
```

---

## 📦 スキーマ定義 (Components/Schemas)

### **認証関連スキーマ**

```yaml
components:
  schemas:
    AuthResult:
      type: object
      required: [success]
      properties:
        success:
          type: boolean
          description: '認証結果'
        user:
          $ref: '#/components/schemas/AuthUser'
        token:
          type: string
          description: 'JWTアクセストークン'
        refreshToken:
          type: string
          description: 'リフレッシュトークン'
        expiresIn:
          type: integer
          description: 'トークン有効期限（秒）'
        error:
          type: string
          description: 'エラーメッセージ'

    AuthUser:
      type: object
      required: [id, email, userType]
      properties:
        id:
          type: string
          format: uuid
          description: 'ユーザーID'
        email:
          type: string
          format: email
          description: 'メールアドレス'
        userType:
          type: string
          enum: [candidate, company_user, admin]
          description: 'ユーザータイプ'
        profile:
          type: object
          description: 'ユーザープロフィール情報'
```

### **候補者関連スキーマ**

```yaml
Candidate:
  type: object
  required: [id, email, lastName, firstName, status]
  properties:
    id:
      type: string
      format: uuid
    email:
      type: string
      format: email
    lastName:
      type: string
      maxLength: 50
    firstName:
      type: string
      maxLength: 50
    lastNameKana:
      type: string
      maxLength: 50
    firstNameKana:
      type: string
      maxLength: 50
    gender:
      $ref: '#/components/schemas/Gender'
    currentResidence:
      type: string
      maxLength: 100
    birthDate:
      type: string
      format: date
    phoneNumber:
      type: string
      pattern: "^[0-9-+()\\s]+$"
    currentSalary:
      type: string
      maxLength: 50
    hasJobChangeExperience:
      type: boolean
    desiredChangeTiming:
      type: string
      maxLength: 100
    jobSearchStatus:
      type: string
      maxLength: 50
    skills:
      type: array
      items:
        type: string
      maxItems: 50
    desiredIndustries:
      type: array
      items:
        type: string
      maxItems: 20
    desiredJobTypes:
      type: array
      items:
        type: string
      maxItems: 10
    desiredLocations:
      type: array
      items:
        type: string
      maxItems: 20
    emailNotificationSettings:
      type: object
      additionalProperties:
        type: boolean
    scoutReceptionEnabled:
      type: boolean
    status:
      $ref: '#/components/schemas/UserStatus'
    createdAt:
      type: string
      format: date-time
    updatedAt:
      type: string
      format: date-time
    lastLoginAt:
      type: string
      format: date-time

CandidateRegistrationRequest:
  type: object
  required:
    [
      email,
      password,
      lastName,
      firstName,
      lastNameKana,
      firstNameKana,
      gender,
      birthDate,
      phoneNumber,
      currentResidence,
      currentSalary,
      hasJobChangeExperience,
      desiredChangeTiming,
      jobSearchStatus,
    ]
  properties:
    email:
      type: string
      format: email
      maxLength: 255
    password:
      type: string
      format: password
      minLength: 8
      maxLength: 128
    lastName:
      type: string
      maxLength: 50
    firstName:
      type: string
      maxLength: 50
    lastNameKana:
      type: string
      maxLength: 50
    firstNameKana:
      type: string
      maxLength: 50
    gender:
      $ref: '#/components/schemas/Gender'
    birthDate:
      type: string
      format: date
    phoneNumber:
      type: string
      pattern: "^[0-9-+()\\s]+$"
    currentResidence:
      type: string
      maxLength: 100
    currentSalary:
      type: string
      maxLength: 50
    hasJobChangeExperience:
      type: boolean
    desiredChangeTiming:
      type: string
      maxLength: 100
    jobSearchStatus:
      type: string
      maxLength: 50

CandidateProfileUpdateRequest:
  type: object
  properties:
    lastName:
      type: string
      maxLength: 50
    firstName:
      type: string
      maxLength: 50
    lastNameKana:
      type: string
      maxLength: 50
    firstNameKana:
      type: string
      maxLength: 50
    gender:
      $ref: '#/components/schemas/Gender'
    currentResidence:
      type: string
      maxLength: 100
    phoneNumber:
      type: string
      pattern: "^[0-9-+()\\s]+$"
    currentSalary:
      type: string
      maxLength: 50
    hasJobChangeExperience:
      type: boolean
    desiredChangeTiming:
      type: string
      maxLength: 100
    jobSearchStatus:
      type: string
      maxLength: 50
    skills:
      type: array
      items:
        type: string
      maxItems: 50
    desiredIndustries:
      type: array
      items:
        type: string
      maxItems: 20
    desiredJobTypes:
      type: array
      items:
        type: string
      maxItems: 10
    desiredLocations:
      type: array
      items:
        type: string
      maxItems: 20
    scoutReceptionEnabled:
      type: boolean
    emailNotificationSettings:
      type: object
      additionalProperties:
        type: boolean

CandidateSearchResult:
  type: object
  required: [items, pagination]
  properties:
    items:
      type: array
      items:
        $ref: '#/components/schemas/CandidateProfile'
    pagination:
      $ref: '#/components/schemas/PaginationInfo'
    filters:
      $ref: '#/components/schemas/CandidateSearchFilters'

CandidateProfile:
  type: object
  description: '企業向け候補者プロフィール（個人情報制限版）'
  required: [id, lastName, firstName, gender, currentResidence, skills]
  properties:
    id:
      type: string
      format: uuid
    lastName:
      type: string
    firstName:
      type: string
    lastNameKana:
      type: string
    firstNameKana:
      type: string
    gender:
      $ref: '#/components/schemas/Gender'
    age:
      type: integer
      minimum: 18
      maximum: 100
    currentResidence:
      type: string
    currentSalary:
      type: string
    hasJobChangeExperience:
      type: boolean
    desiredChangeTiming:
      type: string
    jobSearchStatus:
      type: string
    skills:
      type: array
      items:
        type: string
    desiredIndustries:
      type: array
      items:
        type: string
    desiredJobTypes:
      type: array
      items:
        type: string
    desiredLocations:
      type: array
      items:
        type: string
    careerSummary:
      type: string
    selfPr:
      type: string

CandidateSearchFilters:
  type: object
  properties:
    industries:
      type: array
      items:
        type: string
    jobTypes:
      type: array
      items:
        type: string
    locations:
      type: array
      items:
        type: string
    salaryRange:
      type: object
      properties:
        min:
          type: integer
        max:
          type: integer
    experienceYears:
      type: object
      properties:
        min:
          type: integer
        max:
          type: integer
    englishLevel:
      type: array
      items:
        type: string
    skills:
      type: array
      items:
        type: string
    education:
      type: array
      items:
        type: string
    gender:
      type: array
      items:
        $ref: '#/components/schemas/Gender'
    ageRange:
      type: object
      properties:
        min:
          type: integer
        max:
          type: integer
    hasJobChangeExperience:
      type: boolean
    jobSearchStatus:
      type: array
      items:
        type: string
    keywords:
      type: string
```

### **企業関連スキーマ**

```yaml
CompanyAccount:
  type: object
  required: [id, companyName, industry, status]
  properties:
    id:
      type: string
      format: uuid
    companyName:
      type: string
      maxLength: 100
    headquartersAddress:
      type: string
      maxLength: 200
    representativeName:
      type: string
      maxLength: 100
    industry:
      type: string
      maxLength: 50
    companyOverview:
      type: string
      maxLength: 2000
    appealPoints:
      type: string
      maxLength: 1000
    logoImagePath:
      type: string
      maxLength: 500
    contractPlan:
      $ref: '#/components/schemas/CompanyContractPlan'
    status:
      $ref: '#/components/schemas/CompanyStatus'
    createdAt:
      type: string
      format: date-time
    updatedAt:
      type: string
      format: date-time

CompanyContractPlan:
  type: object
  required: [planType, maxJobPostings, maxScoutMessages, features, monthlyFee, startDate]
  properties:
    planType:
      type: string
      enum: [BASIC, STANDARD, PREMIUM, ENTERPRISE]
    maxJobPostings:
      type: integer
      minimum: 1
    maxScoutMessages:
      type: integer
      minimum: 1
    features:
      type: array
      items:
        type: string
    monthlyFee:
      type: number
      minimum: 0
    startDate:
      type: string
      format: date-time
    endDate:
      type: string
      format: date-time

CompanyRegistrationRequest:
  type: object
  required:
    [
      companyName,
      headquartersAddress,
      representativeName,
      industry,
      userFullName,
      userEmail,
      userPassword,
    ]
  properties:
    companyName:
      type: string
      maxLength: 100
    headquartersAddress:
      type: string
      maxLength: 200
    representativeName:
      type: string
      maxLength: 100
    industry:
      type: string
      maxLength: 50
    companyOverview:
      type: string
      maxLength: 2000
    appealPoints:
      type: string
      maxLength: 1000
    userFullName:
      type: string
      maxLength: 100
    userEmail:
      type: string
      format: email
      maxLength: 255
    userPassword:
      type: string
      format: password
      minLength: 8
      maxLength: 128
    userPositionTitle:
      type: string
      maxLength: 100

CompanyProfileUpdateRequest:
  type: object
  properties:
    companyName:
      type: string
      maxLength: 100
    headquartersAddress:
      type: string
      maxLength: 200
    representativeName:
      type: string
      maxLength: 100
    industry:
      type: string
      maxLength: 50
    companyOverview:
      type: string
      maxLength: 2000
    appealPoints:
      type: string
      maxLength: 1000
    logoImagePath:
      type: string
      maxLength: 500
```

### **求人関連スキーマ**

```yaml
JobPosting:
  type: object
  required: [id, companyAccountId, title, jobDescription, publicationStatus]
  properties:
    id:
      type: string
      format: uuid
    companyAccountId:
      type: string
      format: uuid
    title:
      type: string
      maxLength: 100
    departmentName:
      type: string
      maxLength: 100
    jobDescription:
      type: string
      maxLength: 5000
    requiredSkills:
      type: array
      items:
        type: string
      maxItems: 50
    preferredSkills:
      type: array
      items:
        type: string
      maxItems: 50
    employmentType:
      type: string
      maxLength: 50
    salaryRange:
      type: string
      maxLength: 100
    workLocation:
      type: string
      maxLength: 200
    workStyle:
      type: array
      items:
        type: string
      maxItems: 10
    benefits:
      type: string
      maxLength: 2000
    selectionProcess:
      type: string
      maxLength: 2000
    applicationRequirements:
      type: string
      maxLength: 2000
    visibilityScope:
      type: string
      enum: [PUBLIC, PRIVATE]
      default: PUBLIC
    targetCandidateConditions:
      type: object
      description: 'AI マッチング用条件'
    publicationStatus:
      $ref: '#/components/schemas/PublicationStatus'
    publishedAt:
      type: string
      format: date-time
    applicationDeadline:
      type: string
      format: date-time
    createdAt:
      type: string
      format: date-time
    updatedAt:
      type: string
      format: date-time

JobPostingCreateRequest:
  type: object
  required: [title, jobDescription]
  properties:
    title:
      type: string
      maxLength: 100
    departmentName:
      type: string
      maxLength: 100
    jobDescription:
      type: string
      maxLength: 5000
    requiredSkills:
      type: array
      items:
        type: string
      maxItems: 50
    preferredSkills:
      type: array
      items:
        type: string
      maxItems: 50
    employmentType:
      type: string
      maxLength: 50
    salaryRange:
      type: string
      maxLength: 100
    workLocation:
      type: string
      maxLength: 200
    workStyle:
      type: array
      items:
        type: string
      maxItems: 10
    benefits:
      type: string
      maxLength: 2000
    selectionProcess:
      type: string
      maxLength: 2000
    applicationRequirements:
      type: string
      maxLength: 2000
    visibilityScope:
      type: string
      enum: [PUBLIC, PRIVATE]
      default: PUBLIC
    targetCandidateConditions:
      type: object
    applicationDeadline:
      type: string
      format: date-time

JobPostingSearchResult:
  type: object
  required: [items, pagination]
  properties:
    items:
      type: array
      items:
        $ref: '#/components/schemas/JobPosting'
    pagination:
      $ref: '#/components/schemas/PaginationInfo'
    filters:
      type: object
```

### **メッセージ関連スキーマ**

```yaml
Message:
  type: object
  required: [id, senderType, receiverType, messageType, subject, content, status]
  properties:
    id:
      type: string
      format: uuid
    senderType:
      type: string
      enum: [candidate, company_user]
    senderCandidateId:
      type: string
      format: uuid
    senderCompanyUserId:
      type: string
      format: uuid
    receiverType:
      type: string
      enum: [candidate, company_user]
    receiverCandidateId:
      type: string
      format: uuid
    receiverCompanyUserId:
      type: string
      format: uuid
    messageType:
      $ref: '#/components/schemas/MessageType'
    subject:
      type: string
      maxLength: 200
    content:
      type: string
      maxLength: 10000
    attachmentFilePaths:
      type: array
      items:
        type: string
      maxItems: 10
    status:
      $ref: '#/components/schemas/MessageStatus'
    readAt:
      type: string
      format: date-time
    repliedAt:
      type: string
      format: date-time
    createdAt:
      type: string
      format: date-time
    updatedAt:
      type: string
      format: date-time

MessageSendRequest:
  type: object
  required: [receiverType, messageType, subject, content]
  properties:
    receiverType:
      type: string
      enum: [candidate, company_user]
    receiverCandidateId:
      type: string
      format: uuid
    receiverCompanyUserId:
      type: string
      format: uuid
    messageType:
      $ref: '#/components/schemas/MessageType'
    subject:
      type: string
      maxLength: 200
    content:
      type: string
      maxLength: 10000
    attachmentFilePaths:
      type: array
      items:
        type: string
      maxItems: 10

MessageSearchResult:
  type: object
  required: [items, pagination]
  properties:
    items:
      type: array
      items:
        $ref: '#/components/schemas/Message'
    pagination:
      $ref: '#/components/schemas/PaginationInfo'
    unreadCount:
      type: integer
      minimum: 0
```

### **共通スキーマ**

```yaml
    # Enums
    Gender:
      type: string
      enum: [MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY]

    UserStatus:
      type: string
      enum: [ACTIVE, INACTIVE, SUSPENDED, DELETED]

    CompanyStatus:
      type: string
      enum: [ACTIVE, INACTIVE, SUSPENDED]

    MessageType:
      type: string
      enum: [SCOUT, APPLICATION, GENERAL, SYSTEM]

    MessageStatus:
      type: string
      enum: [UNREAD, READ, ARCHIVED]

    PublicationStatus:
      type: string
      enum: [DRAFT, PENDING, PUBLISHED, SUSPENDED, EXPIRED]

    # Pagination
    PaginationInfo:
      type: object
      required: [page, limit, total, totalPages]
      properties:
        page:
          type: integer
          minimum: 1
        limit:
          type: integer
          minimum: 1
          maximum: 100
        total:
          type: integer
          minimum: 0
        totalPages:
          type: integer
          minimum: 0
        hasNextPage:
          type: boolean
        hasPreviousPage:
          type: boolean

    # Error Responses
    ErrorResponse:
      type: object
      required: [error]
      properties:
        error:
          type: object
          required: [code, message]
          properties:
            code:
              type: string
              description: "エラーコード"
            message:
              type: string
              description: "エラーメッセージ"
            details:
              type: string
              description: "詳細情報"
            timestamp:
              type: string
              format: date-time
            requestId:
              type: string
              format: uuid

    ValidationErrorResponse:
      type: object
      required: [error]
      properties:
        error:
          type: object
          required: [code, message, validationErrors]
          properties:
            code:
              type: string
              example: "VALIDATION_ERROR"
            message:
              type: string
              example: "リクエストデータが不正です"
            validationErrors:
              type: array
              items:
                type: object
                required: [field, message]
                properties:
                  field:
                    type: string
                    description: "エラーフィールド名"
                  message:
                    type: string
                    description: "フィールド固有エラーメッセージ"
                  code:
                    type: string
                    description: "バリデーションエラーコード"
            timestamp:
              type: string
              format: date-time
            requestId:
              type: string
              format: uuid

  # Security Schemes
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: "JWT Bearer Token認証"
```

---

## 🔒 セキュリティ仕様

### **認証・認可**

```yaml
security:
  authentication:
    - type: 'JWT Bearer Token'
    - algorithm: 'HS256'
    - expiration: '24 hours'
    - refresh: '30 days'

  authorization:
    - role_based: true
    - resource_based: true
    - scopes: ['read', 'write', 'admin']

  rate_limiting:
    - algorithm: 'Token Bucket'
    - default_limit: '100 req/min'
    - burst_limit: '200 req/min'
    - auth_endpoints: '10 req/min'
```

### **データ保護**

```yaml
data_protection:
  encryption:
    - in_transit: 'TLS 1.3'
    - at_rest: 'AES-256'
    - passwords: 'bcrypt (cost: 12)'

  privacy:
    - pii_masking: true
    - gdpr_compliance: true
    - data_retention: '7 years'
```

---

## 📊 パフォーマンス仕様

### **レスポンス時間**

```yaml
performance:
  response_times:
    - p50: '< 200ms'
    - p95: '< 500ms'
    - p99: '< 1000ms'

  throughput:
    - peak_rps: '1000 req/sec'
    - sustained_rps: '500 req/sec'

  availability:
    - uptime: '99.9%'
    - maintenance_window: 'Sunday 2-4 AM JST'
```

---

## 🚀 バージョニング戦略

### **APIバージョニング**

```yaml
versioning:
  strategy: 'URI Versioning'
  current_version: 'v1'
  deprecation_policy: '12 months notice'
  backward_compatibility: '2 major versions'

  version_history:
    - v1.0: 'Initial release'
    - v1.1: 'Enhanced search features'
    - v1.2: 'Message attachments support'
```

---

## 📚 関連ドキュメント

- [Database Design](./database-design.md) - データベース設計
- [Security Architecture](./security-architecture.md) - セキュリティ設計
- [Technical Constraints](./technical-constraints.md) - 技術制約
- [Architecture Overview](./overview.md) - システム全体アーキテクチャ

---

_最終更新: 2024年12月_  
_作成者: API Architecture Team_
