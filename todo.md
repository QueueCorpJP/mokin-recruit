Error: src/app/signup/profile/ProfileClient.tsx(440,31): error TS2367: This comparison appears to be
unintentional because the types '"male" | "female" | "unspecified"' and '"男性" | "女性" | "未回答"'
have no overlap. Error: src/app/signup/profile/ProfileClient.tsx(822,43): error TS2345: Argument of
type '(prev: { gender: "male" | "female" | "unspecified"; prefecture: string; lastName: string;
firstName: string; lastNameKana: string; firstNameKana: string; birthYear: string; birthMonth:
string; birthDay: string; phoneNumber: string; currentIncome: string; }) => { ...; }' is not
assignable to parameter of type 'SetStateAction<{ gender: "male" | "female" | "unspecified";
prefecture: string; lastName: string; firstName: string; lastNameKana: string; firstNameKana:
string; birthYear: string; birthMonth: string; birthDay: string; phoneNumber: string; currentIncome:
string; }>'. Type '(prev: { gender: "male" | "female" | "unspecified"; prefecture: string; lastName:
string; firstName: string; lastNameKana: string; firstNameKana: string; birthYear: string;
birthMonth: string; birthDay: string; phoneNumber: string; currentIncome: string; }) => { ...; }' is
not assignable to type '(prevState: { gender: "male" | "female" | "unspecified"; prefecture: string;
lastName: string; firstName: string; lastNameKana: string; firstNameKana: string; birthYear: string;
birthMonth: string; birthDay: string; phoneNumber: string; currentIncome: string; }) => { ...; }'.
Call signature return types '{ gender: "男性" | "女性" | "未回答"; prefecture: string; lastName:
string; firstName: string; lastNameKana: string; firstNameKana: string; birthYear: string;
birthMonth: string; birthDay: string; phoneNumber: string; currentIncome: string; }' and '{ gender:
"male" | "female" | "unspecified"; prefecture: string; lastName: string; firstName: string;
lastNameKana: string; firstNameKana: string; birthYear: string; birthMonth: string; birthDay:
string; phoneNumber: string; currentIncome: string; }' are incompatible. The types of 'gender' are
incompatible between these types. Type '"男性" | "女性" | "未回答"' is not assignable to type
'"male" | "female" | "unspecified"'. Type '"男性"' is not assignable to type '"male" | "female" |
"unspecified"'. Error: src/app/signup/profile/ProfileClient.tsx(828,31): error TS2367: This
comparison appears to be unintentional because the types '"male" | "female" | "unspecified"' and
'"男性" | "女性" | "未回答"' have no overlap. Error: src/app/signup/skills/page.tsx(376,21): error
TS4104: The type 'readonly [{ readonly value: ""; readonly label: "レベルを選択"; }, { readonly
value: "ネイティブ"; readonly label: "ネイティブ"; }, { readonly value: "ビジネスレベル"; readonly
label: "ビジネスレベル"; }, { readonly value: "日常会話"; readonly label: "日常会話"; }, { ...; }, {
...; }]' is 'readonly' and cannot be assigned to the mutable type 'SelectOption[]'. Error:
src/app/signup/skills/page.tsx(411,25): error TS4104: The type 'readonly [{ readonly value: "";
readonly label: "言語を選択"; }, { readonly value: "インドネシア語"; readonly label:
"インドネシア語"; }, { readonly value: "イタリア語"; readonly label: "イタリア語"; }, { readonly
value: "スペイン語"; readonly label: "スペイン語"; }, ... 20 more ..., { ...; }]' is 'readonly' and
cannot be assigned to the mutable type 'SelectOption[]'. Error:
src/app/signup/skills/page.tsx(420,25): error TS4104: The type 'readonly [{ readonly value: "";
readonly label: "レベルを選択"; }, { readonly value: "ネイティブ"; readonly label: "ネイティブ"; },
{ readonly value: "ビジネスレベル"; readonly label: "ビジネスレベル"; }, { readonly value:
"日常会話"; readonly label: "日常会話"; }, { ...; }, { ...; }]' is 'readonly' and cannot be assigned
to the mutable type 'SelectOption[]'. Error: src/app/signup/skills/page.tsx(760,19): error TS4104:
The type 'readonly [{ readonly value: ""; readonly label: "レベルを選択"; }, { readonly value:
"ネイティブ"; readonly label: "ネイティブ"; }, { readonly value: "ビジネスレベル"; readonly label:
"ビジネスレベル"; }, { readonly value: "日常会話"; readonly label: "日常会話"; }, { ...; }, { ...;
}]' is 'readonly' and cannot be assigned to the mutable type 'SelectOption[]'. Error:
src/app/signup/skills/page.tsx(788,23): error TS4104: The type 'readonly [{ readonly value: "";
readonly label: "言語を選択"; }, { readonly value: "インドネシア語"; readonly label:
"インドネシア語"; }, { readonly value: "イタリア語"; readonly label: "イタリア語"; }, { readonly
value: "スペイン語"; readonly label: "スペイン語"; }, ... 20 more ..., { ...; }]' is 'readonly' and
cannot be assigned to the mutable type 'SelectOption[]'. Error:
src/app/signup/skills/page.tsx(797,23): error TS4104: The type 'readonly [{ readonly value: "";
readonly label: "レベルを選択"; }, { readonly value: "ネイティブ"; readonly label: "ネイティブ"; },
{ readonly value: "ビジネスレベル"; readonly label: "ビジネスレベル"; }, { readonly value:
"日常会話"; readonly label: "日常会話"; }, { ...; }, { ...; }]' is 'readonly' and cannot be assigned
to the mutable type 'SelectOption[]'. Error: src/components/FontLoader.tsx(6,13): error TS7030: Not
all code paths return a value. Error: src/components/auth/LoginForm.tsx(73,51): error TS2554:
Expected 1 arguments, but got 3. Error: src/components/auth/LoginForm.tsx(75,20): error TS2339:
Property 'success' does not exist on type '{ error?: string | undefined; }'. Error:
src/components/company/CompanyTaskSidebar.tsx(131,53): error TS2339: Property 'company_accounts'
does not exist on type 'never'. Error: src/components/company_account/CreateGroupModal.tsx(45,5):
error TS2322: Type 'string' is not assignable to type '"admin" | "scout" | "recruiter"'. Error:
src/components/dashboard/AuthStatus.tsx(7,17): error TS2339: Property 'accessToken' does not exist
on type 'AuthContextType'. Error: src/components/dashboard/AuthStatus.tsx(11,22): error TS2551:
Property 'last_sign_in_at' does not exist on type 'AuthUser'. Did you mean 'lastSignIn'? Error:
src/components/dashboard/AuthStatus.tsx(12,34): error TS2551: Property 'last_sign_in_at' does not
exist on type 'AuthUser'. Did you mean 'lastSignIn'? Error:
src/components/education/EducationSection.tsx(10,10): error TS2305: Module '"./common/FormSelect"'
has no exported member 'FormSelect'. Error: src/components/education/EducationSection.tsx(42,58):
error TS2345: Argument of type 'string' is not assignable to parameter of type 'Path<T>'. Error:
src/components/education/EducationSection.tsx(57,26): error TS2345: Argument of type 'string' is not
assignable to parameter of type 'Path<T>'. Error:
src/components/education/EducationSection.tsx(69,26): error TS2345: Argument of type 'string' is not
assignable to parameter of type 'Path<T>'. Error:
src/components/education/EducationSection.tsx(79,60): error TS2345: Argument of type 'string' is not
assignable to parameter of type 'Path<T>'. Error:
src/components/education/EducationSection.tsx(92,61): error TS2345: Argument of type 'string' is not
assignable to parameter of type 'Path<T>'. Error:
src/components/education/EducationSection.tsx(119,58): error TS2345: Argument of type 'string' is
not assignable to parameter of type 'Path<T>'. Error:
src/components/education/EducationSection.tsx(137,28): error TS2345: Argument of type 'string' is
not assignable to parameter of type 'Path<T>'. Error:
src/components/education/EducationSection.tsx(153,28): error TS2345: Argument of type 'string' is
not assignable to parameter of type 'Path<T>'. Error:
src/components/education/EducationSection.tsx(166,60): error TS2345: Argument of type 'string' is
not assignable to parameter of type 'Path<T>'. Error:
src/components/education/EducationSection.tsx(179,61): error TS2345: Argument of type 'string' is
not assignable to parameter of type 'Path<T>'. Error:
src/components/education/IndustrySection.tsx(3,41): error TS2307: Cannot find module
'../../app/candidate/account/education/edit/constants/education' or its corresponding type
declarations. Error: src/components/education/JobTypeSection.tsx(3,41): error TS2307: Cannot find
module '../../app/candidate/account/education/edit/constants/education' or its corresponding type
declarations. Error: src/components/education/JobTypeSection.tsx(32,35): error TS2304: Cannot find
name 'FieldValues'. Error: src/components/education/JobTypeSection.tsx(39,4): error TS2315: Type
'JobTypeSectionProps' is not generic. Error: src/components/education/JobTypeSection.tsx(122,37):
error TS7006: Parameter 'jobType' implicitly has an 'any' type. Error:
src/components/layout/AuthAwareNavigationServer.tsx(40,9): error TS2322: Type '{ label: string;
href: string; onClick?: ((e: MouseEvent<HTMLAnchorElement, MouseEvent>) => void) | undefined; } |
undefined' is not assignable to type '{ label: string; href: string; onClick?: (() => void) |
undefined; } | undefined'. Type '{ label: string; href: string; onClick?: ((e:
MouseEvent<HTMLAnchorElement, MouseEvent>) => void) | undefined; }' is not assignable to type '{
label: string; href: string; onClick?: (() => void) | undefined; }'. Types of property 'onClick' are
incompatible. Type '((e: MouseEvent<HTMLAnchorElement, MouseEvent>) => void) | undefined' is not
assignable to type '(() => void) | undefined'. Type '(e: MouseEvent<HTMLAnchorElement, MouseEvent>)
=> void' is not assignable to type '() => void'. Target signature provides too few arguments.
Expected 1 or more, but got 0. Error: src/components/layout/AuthAwareNavigationServer.tsx(59,7):
error TS2322: Type '{ label: string; href: string; onClick?: ((e: MouseEvent<HTMLAnchorElement,
MouseEvent>) => void) | undefined; } | undefined' is not assignable to type '{ label: string; href:
string; onClick?: (() => void) | undefined; } | undefined'. Type '{ label: string; href: string;
onClick?: ((e: MouseEvent<HTMLAnchorElement, MouseEvent>) => void) | undefined; }' is not assignable
to type '{ label: string; href: string; onClick?: (() => void) | undefined; }'. Types of property
'onClick' are incompatible. Type '((e: MouseEvent<HTMLAnchorElement, MouseEvent>) => void) |
undefined' is not assignable to type '(() => void) | undefined'. Type '(e:
MouseEvent<HTMLAnchorElement, MouseEvent>) => void' is not assignable to type '() => void'. Target
signature provides too few arguments. Expected 1 or more, but got 0. Error:
src/components/media/PopularArticlesSidebar.tsx(4,15): error TS2724:
'"@/app/candidate/media/actions"' has no exported member named 'PopularArticle'. Did you mean
'getPopularArticles'? Error: src/components/media/PopularArticlesSidebar.tsx(4,31): error TS2459:
Module '"@/app/candidate/media/actions"' declares 'ArticleCategory' locally, but it is not exported.
Error: src/components/media/PopularArticlesSidebar.tsx(4,48): error TS2459: Module
'"@/app/candidate/media/actions"' declares 'ArticleTag' locally, but it is not exported. Error:
src/components/message/MessageDetailContent.tsx(75,21): error TS2551: Property
'sender_company_group' does not exist on type 'ChatMessage'. Did you mean 'sender_company_user'?
Error: src/components/message/MessageDetailContent.tsx(82,39): error TS2339: Property 'sent_at' does
not exist on type 'ChatMessage'. Error: src/components/message/MessageDetailContent.tsx(83,32):
error TS2339: Property 'sent_at' does not exist on type 'ChatMessage'. Error:
src/components/message/MessageDetailContent.tsx(174,28): error TS2339: Property 'file_urls' does not
exist on type 'ChatMessage'. Error: src/components/message/MessageDetailContent.tsx(174,49): error
TS2339: Property 'file_urls' does not exist on type 'ChatMessage'. Error:
src/components/message/MessageDetailContent.tsx(184,32): error TS2339: Property 'file_urls' does not
exist on type 'ChatMessage'. Error: src/components/message/MessageDetailContent.tsx(184,47): error
TS7006: Parameter 'fileUrl' implicitly has an 'any' type. Error:
src/components/message/MessageDetailContent.tsx(184,56): error TS7006: Parameter 'index' implicitly
has an 'any' type. Error: src/components/message/MessageInputBoxServer.tsx(50,24): error TS2339:
Property 'body' does not exist on type 'ScoutTemplate'. Error:
src/components/message/MessageLayout.tsx(172,17): error TS2322: Type 'boolean | undefined' is not
assignable to type 'boolean'. Type 'undefined' is not assignable to type 'boolean'. Error:
src/components/message/MessageLayout.tsx(525,19): error TS2322: Type 'boolean | undefined' is not
assignable to type 'boolean'. Type 'undefined' is not assignable to type 'boolean'. Error:
src/components/news/PopularNewsSidebar.tsx(4,15): error TS2459: Module
'"@/app/candidate/news/actions"' declares 'PopularArticle' locally, but it is not exported. Error:
src/components/news/PopularNewsSidebar.tsx(4,31): error TS2459: Module
'"@/app/candidate/news/actions"' declares 'ArticleCategory' locally, but it is not exported. Error:
src/components/news/PopularNewsSidebar.tsx(4,48): error TS2459: Module
'"@/app/candidate/news/actions"' declares 'ArticleTag' locally, but it is not exported. Error:
src/contexts/AuthContext.tsx(11,32): error TS2440: Import declaration conflicts with local
declaration of 'UserType'. Error: src/contexts/AuthContext.tsx(208,16): error TS2322: Type 'User |
null' is not assignable to type 'AuthUser | null'. Type 'User' is missing the following properties
from type 'AuthUser': userType, emailConfirmed Error: src/contexts/AuthContext.tsx(208,44): error
TS2322: Type '(email: string, password: string, userType?: "candidate" | "company" | "admin") =>
Promise<{ success: boolean; error?: undefined; } | { success: boolean; error: string; }>' is not
assignable to type '(\_credentials: LoginData) => Promise<{ error?: string | undefined; }>'. Target
signature provides too few arguments. Expected 2 or more, but got 1. Error:
src/contexts/CandidateContext.tsx(14,3): error TS2305: Module '"@/types"' has no exported member
'SelectionEntry'. Error: src/contexts/CandidateContext.tsx(15,3): error TS2305: Module '"@/types"'
has no exported member 'ModalState'. Error: src/contexts/NewsCacheContext.tsx(4,10): error TS2459:
Module '"@/app/candidate/news/actions"' declares 'PopularArticle' locally, but it is not exported.
Error: src/contexts/NewsCacheContext.tsx(4,26): error TS2459: Module
'"@/app/candidate/news/actions"' declares 'ArticleCategory' locally, but it is not exported. Error:
src/contexts/NewsCacheContext.tsx(4,43): error TS2459: Module '"@/app/candidate/news/actions"'
declares 'ArticleTag' locally, but it is not exported. Error: src/hooks/useAuthApi.ts(26,15): error
TS2345: Argument of type 'ApiResponse<SessionResponse>' is not assignable to parameter of type
'SetStateAction<SessionResponse | undefined>'. Type 'ApiResponse<SessionResponse>' is missing the
following properties from type 'SessionResponse': user, session Error:
src/hooks/useCandidateData.ts(4,3): error TS2459: Module '"@/contexts/CandidateContext"' declares
'CandidateFormData' locally, but it is not exported. Error: src/hooks/useCompanyDetail.ts(5,15):
error TS2724: '"@/app/candidate/company/[company_id]/actions"' has no exported member named
'CompanyDetailData'. Did you mean 'getCompanyDetailData'? Error: src/hooks/useFavoriteApi.ts(8,8):
error TS2459: Module '"../lib/actions/favoriteActions"' declares 'FavoriteActionResult' locally, but
it is not exported. Error: src/hooks/useFavoriteApi.ts(9,8): error TS2459: Module
'"../lib/actions/favoriteActions"' declares 'FavoriteListResult' locally, but it is not exported.
Error: src/hooks/useFavoriteApi.ts(10,8): error TS2459: Module '"../lib/actions/favoriteActions"'
declares 'FavoriteStatusResult' locally, but it is not exported. Error:
src/hooks/useRealTimeMessages.ts(29,20): error TS2339: Property 'messages' does not exist on type '{
id: string; senderType: "CANDIDATE" | "COMPANY_USER"; senderName: string; subject: any; content:
any; createdAt: string; }[]'. Error: src/hooks/useRealTimeMessages.ts(30,51): error TS2339: Property
'messages' does not exist on type '{ id: string; senderType: "CANDIDATE" | "COMPANY_USER";
senderName: string; subject: any; content: any; createdAt: string; }[]'. Error:
src/hooks/useRealTimeMessages.ts(31,30): error TS2339: Property 'messages' does not exist on type '{
id: string; senderType: "CANDIDATE" | "COMPANY_USER"; senderName: string; subject: any; content:
any; createdAt: string; }[]'. Error: src/hooks/useRealTimeMessages.ts(32,27): error TS2339: Property
'error' does not exist on type '{ id: string; senderType: "CANDIDATE" | "COMPANY_USER"; senderName:
string; subject: any; content: any; createdAt: string; }[]'. Error:
src/hooks/useRealTimeMessages.ts(33,63): error TS2339: Property 'error' does not exist on type '{
id: string; senderType: "CANDIDATE" | "COMPANY_USER"; senderName: string; subject: any; content:
any; createdAt: string; }[]'. Error: src/hooks/useRealTimeMessages.ts(117,7): error TS2353: Object
literal may only specify known properties, and 'file_urls' does not exist in type 'ChatMessage'.
Error: src/hooks/useSearchHistory.ts(72,17): error TS2345: Argument of type '{ is_saved: boolean;
updated_at: string; }' is not assignable to parameter of type 'never'. Error:
src/lib/actions/article-views.ts(33,35): error TS2339: Property 'views_count' does not exist on type
'never'. Error: src/lib/actions/article-views.ts(39,15): error TS2345: Argument of type '{
views_count: number; updated_at: string; }' is not assignable to parameter of type 'never'. Error:
src/lib/actions/company-task-data.ts(46,21): error TS2339: Property 'plan' does not exist on type '{
id: any; company_name: any; plan: any; scout_limit: any; created_at: any; }[]'. Error:
src/lib/actions/company-task-data.ts(47,27): error TS2339: Property 'scout_limit' does not exist on
type '{ id: any; company_name: any; plan: any; scout_limit: any; created_at: any; }[]'. Error:
src/lib/actions/company-task-data.ts(49,26): error TS2339: Property 'created_at' does not exist on
type '{ id: any; company_name: any; plan: any; scout_limit: any; created_at: any; }[]'. Error:
src/lib/actions/company-task-data.ts(50,28): error TS2339: Property 'created_at' does not exist on
type '{ id: any; company_name: any; plan: any; scout_limit: any; created_at: any; }[]'. Error:
src/lib/actions/favoriteActions.ts(83,9): error TS2322: Type '{ id: any; job_posting_id: any;
candidate_id: any; created_at: any; job_postings: { id: any; title: any; job_description: any;
salary_min: any; salary_max: any; work_location: any; company_accounts: { ...; }[]; }[]; }[]' is not
assignable to type 'FavoriteItem[]'. Property 'job_id' is missing in type '{ id: any;
job_posting_id: any; candidate_id: any; created_at: any; job_postings: { id: any; title: any;
job_description: any; salary_min: any; salary_max: any; work_location: any; company_accounts: { ...;
}[]; }[]; }' but required in type 'FavoriteItem'. Error: src/lib/actions/messages.ts(56,11): error
TS2322: Type '{ id: any; room_id: any; content: any; sender_type: any; sender_candidate_id: any;
sender_company_group_id: any; message_type: any; subject: any; status: any; sent_at: any; read_at:
any; file_urls: any; created_at: any; updated_at: any; sender_candidate: any; sender_company_group:
any; }[]' is not assignable to type 'ChatMessage[]'. Property 'receiver_type' is missing in type '{
id: any; room_id: any; content: any; sender_type: any; sender_candidate_id: any;
sender_company_group_id: any; message_type: any; subject: any; status: any; sent_at: any; read_at:
any; file_urls: any; created_at: any; updated_at: any; sender_candidate: any; sender_company_group:
any; }' but required in type 'ChatMessage'. Error: src/lib/email/sender.ts(5,28): error TS7016:
Could not find a declaration file for module 'html-to-text'.
'/home/runner/work/mokin-recruit/mokin-recruit/node_modules/html-to-text/lib/html-to-text.mjs'
implicitly has an 'any' type. Try `npm i --save-dev @types/html-to-text` if it exists or add a new
declaration (.d.ts) file containing `declare module 'html-to-text';` Error:
src/lib/image-polyfill.ts(10,11): error TS2683: 'this' implicitly has type 'any' because it does not
have a type annotation. Error: src/lib/server/container/bindings.ts(45,3): error TS2353: Object
literal may only specify known properties, and 'autoBindInjectable' does not exist in type
'ContainerOptions'. Error: src/lib/server/container/container.ts(17,7): error TS2353: Object literal
may only specify known properties, and 'skipBaseClassChecks' does not exist in type
'ContainerOptions'. Error: src/lib/server/infrastructure/database/CompanyUserRepository.ts(108,42):
error TS2339: Property 'client' does not exist on type 'CompanyUserRepository'. Error:
src/lib/server/infrastructure/database/CompanyUserRepository.ts(131,36): error TS2339: Property
'client' does not exist on type 'CompanyUserRepository'. Error:
src/lib/server/infrastructure/database/CompanyUserRepository.ts(155,42): error TS2339: Property
'client' does not exist on type 'CompanyUserRepository'. Error:
src/lib/server/infrastructure/database/CompanyUserRepository.ts(182,42): error TS2339: Property
'client' does not exist on type 'CompanyUserRepository'. Error:
src/lib/server/infrastructure/database/CompanyUserRepository.ts(205,36): error TS2339: Property
'client' does not exist on type 'CompanyUserRepository'. Error:
src/lib/server/infrastructure/database/CompanyUserRepository.ts(270,42): error TS2339: Property
'client' does not exist on type 'CompanyAccountRepository'. Error:
src/lib/server/infrastructure/database/CompanyUserRepository.ts(300,42): error TS2339: Property
'client' does not exist on type 'CompanyAccountRepository'. Error:
src/lib/server/infrastructure/database/CompanyUserRepository.ts(323,36): error TS2339: Property
'client' does not exist on type 'CompanyAccountRepository'. Error:
src/lib/utils/api-client.ts(285,3): error TS2440: Import declaration conflicts with local
declaration of 'JobDetailResponse'. Error: src/types/index.ts(22,3): error TS2724: '"./forms"' has
no exported member named 'CompanyAccountFormData'. Did you mean 'CompanyFormData'? Error:
src/types/index.ts(23,3): error TS2305: Module '"./forms"' has no exported member
'PasswordFormData'. Error: src/types/index.ts(25,3): error TS2305: Module '"./forms"' has no
exported member 'WorkExperienceFormData'. Error: src/types/index.ts(27,3): error TS2305: Module
'"./forms"' has no exported member 'CareerStatusFormData'. Error: src/types/index.ts(28,3): error
TS2724: '"./forms"' has no exported member named 'ExpectationsFormData'. Did you mean
'EducationFormData'? Error: src/types/index.ts(29,3): error TS2305: Module '"./forms"' has no
exported member 'ResumeFormData'. Error: src/types/index.ts(30,3): error TS2305: Module '"./forms"'
has no exported member 'ProfileFormData'. Error: src/types/index.ts(31,3): error TS2305: Module
'"./forms"' has no exported member 'JobFormData'. Error: src/types/index.ts(32,3): error TS2305:
Module '"./forms"' has no exported member 'NotificationFormData'. Error: src/types/index.ts(33,3):
error TS2305: Module '"./forms"' has no exported member 'EmailChangeFormData'. Error: Process
completed with exit code 2.
