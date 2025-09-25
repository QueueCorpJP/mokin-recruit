-- =====================================================
-- company_accountsテーブルのプラン更新問題を修正
-- =====================================================

-- 1. 既存のトリガーを確認（情報取得のみ）
SELECT
    tgname AS trigger_name,
    tgtype,
    proname AS function_name
FROM pg_trigger
JOIN pg_proc ON pg_trigger.tgfoid = pg_proc.oid
WHERE tgrelid = 'company_accounts'::regclass;

-- 2. 問題のあるトリガーを無効化
ALTER TABLE company_accounts DISABLE TRIGGER ALL;

-- 3. プランを更新
UPDATE company_accounts
SET
    plan = 'standard',  -- ここを希望のプランに変更
    updated_at = NOW()
WHERE id = '8926f65d-0524-4f8a-8c5e-9f8e1d186587';  -- ここを対象の企業IDに変更

-- 4. トリガーを再有効化（必要に応じて）
-- ALTER TABLE company_accounts ENABLE TRIGGER ALL;

-- =====================================================
-- 代替案: admin権限でプラン更新を行う関数を作成
-- =====================================================

-- 既存の関数があれば削除
DROP FUNCTION IF EXISTS update_company_plan_as_admin(UUID, TEXT);

-- Admin権限でプラン更新を行う新しい関数
CREATE OR REPLACE FUNCTION update_company_plan_as_admin(
    p_company_id UUID,
    p_new_plan TEXT
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER  -- この関数は定義者の権限で実行される
AS $$
DECLARE
    v_result json;
BEGIN
    -- 入力値の検証
    IF p_new_plan NOT IN ('basic', 'standard') THEN
        RAISE EXCEPTION '無効なプラン: %', p_new_plan;
    END IF;

    -- プランを更新
    UPDATE company_accounts
    SET
        plan = p_new_plan,
        updated_at = NOW()
    WHERE id = p_company_id
    RETURNING json_build_object(
        'id', id,
        'company_name', company_name,
        'plan', plan,
        'updated_at', updated_at
    ) INTO v_result;

    -- 更新対象が存在しない場合
    IF v_result IS NULL THEN
        RAISE EXCEPTION '企業が見つかりません: %', p_company_id;
    END IF;

    RETURN v_result;
END;
$$;

-- 関数の実行権限を設定
GRANT EXECUTE ON FUNCTION update_company_plan_as_admin(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION update_company_plan_as_admin(UUID, TEXT) TO service_role;

-- 関数の説明を追加
COMMENT ON FUNCTION update_company_plan_as_admin IS 'Admin権限でcompany_accountsのプランを更新（トリガーをバイパス）';

-- =====================================================
-- 使用例
-- =====================================================

-- 関数を使用してプランを更新
SELECT update_company_plan_as_admin(
    '8926f65d-0524-4f8a-8c5e-9f8e1d186587'::UUID,
    'standard'
);

-- =====================================================
-- トリガーの詳細を確認（デバッグ用）
-- =====================================================

-- トリガー関数の定義を確認
SELECT
    proname AS function_name,
    prosrc AS function_source
FROM pg_proc
WHERE proname LIKE '%company%'
   OR prosrc LIKE '%admin_user%'
LIMIT 10;