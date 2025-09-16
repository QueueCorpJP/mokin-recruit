#!/bin/bash

# List of components to check
components=(
    "ColumnCard"
    "FVWrapper"
    "SectionLead"
    "Tag"
    "TagDisplay"
    "alert"
    "candidate-hero-section"
    "card"
    "company-hero-section"
    "email-input"
    "form"
    "hero-section"
    "input-field"
    "input"
    "label"
    "logo"
    "password-input"
    "radio"
    "scroll-area"
    "toast"
    "JobListCard"
    "MessageListCard"
    "JobDetailCommonSection"
    "PublishedJobListSection"
    "candidate-auth-background"
    "CompanyNameInput"
    "FaqBox"
    "AutocompleteInput"
    "Table"
    "ScoutTable"
    "RegistrationTable"
    "textarea"
    "base-input"
    "AttentionBanner"
    "SectionHeading"
    "ImageUpload"
    "Pagination"
    "candidate-profile-modal"
    "email-form-field"
    "NewJobPostCard"
    "selection-result-modal"
    "figma-modal-example"
    "figma-modal"
    "joining-date-modal"
    "button"
    "LoadingSpinner"
    "checkbox"
    "mo-dal"
    "JobPostCard"
    "Loading"
    "footer"
    "navigation"
    "password-form-field"
    "select-input"
)

echo "=== COMPONENT USAGE ANALYSIS ==="
echo "================================="

for component in "${components[@]}"; do
    echo ""
    echo "--- $component ---"
    
    # Search for imports (convert kebab-case to PascalCase for component names)
    if [[ "$component" == *"-"* ]]; then
        # Convert kebab-case to PascalCase
        pascal_name=$(echo "$component" | sed 's/-\([a-z]\)/\U\1/g' | sed 's/^./\U&/')
    else
        pascal_name="$component"
    fi
    
    # Search for imports
    import_count=$(grep -r "import.*$pascal_name" src/ --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l)
    echo "Imports found: $import_count"
    
    if [ $import_count -gt 0 ]; then
        echo "Import examples:"
        grep -r "import.*$pascal_name" src/ --include="*.tsx" --include="*.ts" 2>/dev/null | head -3
    fi
    
    # Search for JSX usage
    jsx_count=$(grep -r "<$pascal_name" src/ --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l)
    echo "JSX usage found: $jsx_count"
    
    if [ $jsx_count -gt 0 ]; then
        echo "JSX examples:"
        grep -r "<$pascal_name" src/ --include="*.tsx" --include="*.ts" 2>/dev/null | head -2
    fi
    
done
