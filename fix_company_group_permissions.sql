-- company_user_group_permissionsの間違ったcompany_group_idを修正
-- test@gmail.comユーザーのグループIDを正しい値に更新

UPDATE company_user_group_permissions 
SET company_group_id = '4f1ed1e1-42b6-4b8b-b52f-f51f7cfa3b3c'
WHERE company_user_id = '7210230f-3fa6-4563-af11-eaf65dc57078'
  AND company_group_id = '7210230f-3fa6-4563-af11-eaf65dc57078';

-- 確認用クエリ  
SELECT 
  cugp.company_user_id,
  cugp.company_group_id,
  cu.email
FROM company_user_group_permissions cugp
JOIN company_users cu ON cugp.company_user_id = cu.id
WHERE cu.email = 'test@gmail.com';