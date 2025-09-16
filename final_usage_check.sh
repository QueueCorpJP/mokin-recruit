#!/bin/bash

# Function to check component usage
check_component() {
    local component_name="$1"
    local file_name="$2"
    
    echo "=== $component_name ==="
    
    # Count imports (excluding the component file itself)
    import_count=$(grep -r "import.*$component_name" src/ --include="*.tsx" --include="*.ts" 2>/dev/null | grep -v "$file_name" | wc -l)
    echo "Imports: $import_count"
    
    # Count JSX usage (excluding the component file itself)  
    jsx_count=$(grep -r "<$component_name" src/ --include="*.tsx" --include="*.ts" 2>/dev/null | grep -v "$file_name" | wc -l)
    echo "JSX usage: $jsx_count"
    
    # Show examples if found
    if [ $import_count -gt 0 ]; then
        echo "Import examples:"
        grep -r "import.*$component_name" src/ --include="*.tsx" --include="*.ts" 2>/dev/null | grep -v "$file_name" | head -2
    fi
    
    # Determine status
    if [ $import_count -eq 0 ] && [ $jsx_count -eq 0 ]; then
        echo "STATUS: UNUSED"
    else
        echo "STATUS: USED"
    fi
    echo ""
}

# Check all components
check_component "ColumnCard" "ColumnCard.tsx"
check_component "FVWrapper" "FVWrapper.tsx"
check_component "SectionLead" "SectionLead.tsx"
check_component "TagDisplay" "TagDisplay.tsx"
check_component "CandidateHeroSection" "candidate-hero-section.tsx"
check_component "CompanyHeroSection" "company-hero-section.tsx"
check_component "EmailInput" "email-input.tsx"
check_component "HeroSection" "hero-section.tsx"
check_component "InputField" "input-field.tsx"
check_component "PasswordInput" "password-input.tsx"
check_component "JobListCard" "JobListCard.tsx"
check_component "MessageListCard" "MessageListCard.tsx"
check_component "JobDetailCommonSection" "JobDetailCommonSection.tsx"
check_component "PublishedJobListSection" "PublishedJobListSection.tsx"
check_component "CandidateAuthBackground" "candidate-auth-background.tsx"
check_component "CompanyNameInput" "CompanyNameInput.tsx"
check_component "FaqBox" "FaqBox.tsx"
check_component "AutocompleteInput" "AutocompleteInput.tsx"
check_component "ScoutTable" "ScoutTable.tsx"
check_component "RegistrationTable" "RegistrationTable.tsx"
check_component "BaseInput" "base-input.tsx"
check_component "AttentionBanner" "AttentionBanner.tsx"
check_component "SectionHeading" "SectionHeading.tsx"
check_component "ImageUpload" "ImageUpload.tsx"
check_component "NewJobPostCard" "NewJobPostCard.tsx"
check_component "LoadingSpinner" "LoadingSpinner.tsx"

