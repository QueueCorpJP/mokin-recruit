@echo off
echo Checking for unused components...
echo.

echo Checking ResumePreview...
findstr /s /i /c:"ResumePreview" src\app\*.tsx src\app\*.ts 2>nul | findstr /v /c:"ResumePreview.tsx" || echo UNUSED: ResumePreview

echo Checking SignupResumePreview...
findstr /s /i /c:"SignupResumePreview" src\app\*.tsx src\app\*.ts 2>nul | findstr /v /c:"SignupResumePreview.tsx" || echo UNUSED: SignupResumePreview

echo Checking DashboardHeader...
findstr /s /i /c:"DashboardHeader" src\app\*.tsx src\app\*.ts 2>nul | findstr /v /c:"DashboardHeader.tsx" || echo UNUSED: DashboardHeader

echo Checking CandidateHeroSection...
findstr /s /i /c:"CandidateHeroSection" src\app\*.tsx src\app\*.ts 2>nul | findstr /v /c:"candidate-hero-section.tsx" || echo UNUSED: CandidateHeroSection

echo Checking CompanyHeroSection...
findstr /s /i /c:"CompanyHeroSection" src\app\*.tsx src\app\*.ts 2>nul | findstr /v /c:"company-hero-section.tsx" || echo UNUSED: CompanyHeroSection

echo.
echo Done checking key components.