#!/bin/bash
unused_count=0
used_count=0
declare -a unused_files
declare -a used_files

while IFS= read -r filepath; do
  # Extract the part after src/lib/ and remove .ts extension
  relative_path=$(echo "$filepath" | sed 's|src/lib/||' | sed 's|\.ts$||')
  
  # Check various import patterns
  pattern1="@/lib/$relative_path"
  pattern2="lib/$relative_path"
  pattern3="../lib/$relative_path"
  pattern4="../../lib/$relative_path"
  pattern5="../../../lib/$relative_path"
  
  count1=$(grep -r "$pattern1" src --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l)
  count2=$(grep -r "$pattern2" src --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l) 
  count3=$(grep -r "$pattern3" src --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l)
  count4=$(grep -r "$pattern4" src --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l)
  count5=$(grep -r "$pattern5" src --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l)
  
  total=$((count1 + count2 + count3 + count4 + count5))
  
  if [ $total -eq 0 ]; then
    unused_files+=("$filepath")
    unused_count=$((unused_count + 1))
    echo "UNUSED: $filepath"
  else
    used_files+=("$filepath") 
    used_count=$((used_count + 1))
    # echo "USED: $filepath ($total)"
  fi
  
done < all_lib_files.txt

echo ""
echo "=== FINAL SUMMARY ==="
echo "Total files checked: $((used_count + unused_count))"
echo "Used files: $used_count"
echo "Unused files: $unused_count"
echo ""
echo "=== UNUSED FILES LIST ==="
for file in "${unused_files[@]}"; do
  echo "$file"
done
