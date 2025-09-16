#!/bin/bash

check_component() {
    local component_name="$1"
    local file_name="$2"
    
    echo "=== $component_name ==="
    
    import_count=$(grep -r "import.*$component_name" src/ --include="*.tsx" --include="*.ts" 2>/dev/null | grep -v "$file_name" | wc -l)
    echo "Imports: $import_count"
    
    jsx_count=$(grep -r "<$component_name" src/ --include="*.tsx" --include="*.ts" 2>/dev/null | grep -v "$file_name" | wc -l)
    echo "JSX usage: $jsx_count"
    
    if [ $import_count -gt 0 ]; then
        echo "Import examples:"
        grep -r "import.*$component_name" src/ --include="*.tsx" --include="*.ts" 2>/dev/null | grep -v "$file_name" | head -2
    fi
    
    if [ $import_count -eq 0 ] && [ $jsx_count -eq 0 ]; then
        echo "STATUS: UNUSED"
    else
        echo "STATUS: USED"
    fi
    echo ""
}

# Components not checked yet
check_component "Tag" "Tag.tsx"
check_component "Alert" "alert.tsx"
check_component "Card" "card.tsx"  
check_component "Form" "form.tsx"
check_component "Input" "input.tsx"
check_component "Label" "label.tsx"
check_component "Logo" "logo.tsx"
check_component "Radio" "radio.tsx"
check_component "ScrollArea" "scroll-area.tsx"
check_component "Toast" "toast.tsx"
check_component "Table" "Table.tsx"
check_component "Textarea" "textarea.tsx"
check_component "Pagination" "Pagination.tsx"
check_component "Button" "button.tsx"
check_component "Checkbox" "checkbox.tsx"
check_component "Modal" "mo-dal.tsx"
check_component "JobPostCard" "JobPostCard.tsx"
check_component "Loading" "Loading.tsx"
check_component "Footer" "footer.tsx"
check_component "Navigation" "navigation.tsx"
check_component "SelectInput" "select-input.tsx"
check_component "EmailFormField" "email-form-field.tsx"
check_component "PasswordFormField" "password-form-field.tsx"

