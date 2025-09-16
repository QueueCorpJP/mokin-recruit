#!/bin/bash
unused_files=()
used_files=()

# Define all lib files with their full paths
lib_files=(
  "cache"
  "performance" 
  "errors/errorHandler"
  "errors/types"
  "utils"
  "utils/performance"
  "utils/noticeHelpers"
  "utils/noticeHelpers.client"
  "utils/search-history"
  "utils/salary-options"
  "utils/age-options" 
  "utils/api-client"
  "utils/article-content"
  "utils/candidateBadgeLogic"
  "utils/candidateSearch"
  "utils/fileUpload"
  "utils/font-optimizer"
  "utils/job-title-generator"
  "actions"
  "actions/article-views"
  "actions/candidate-detail"
  "actions/company-task-data"
  "actions/favoriteActions"
  "actions/get-room-id"
  "actions/joining-date"
  "actions/messages"
  "actions/search-history"
  "actions/selection-progress"
)

for file in "${lib_files[@]}"; do
  # Count references using multiple patterns
  count1=$(grep -r "@/lib/$file" src --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l)
  count2=$(grep -r "from.*[\"']@/lib/$file[\"']" src --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l)
  count3=$(grep -r "import.*from.*[\"']@/lib/$file[\"']" src --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l)
  
  total=$((count1 + count2 + count3))
  
  if [ $total -eq 0 ]; then
    unused_files+=("$file")
    echo "UNUSED: $file"
  else
    used_files+=("$file")
    echo "USED: $file ($total references)"
  fi
done

echo ""
echo "=== SUMMARY ==="
echo "Used files: ${#used_files[@]}"
echo "Unused files: ${#unused_files[@]}"
