// import React from 'react';
import { redirect } from 'next/navigation';

export default function AdminJobNewConfirmPage() {
  // 求人作成完了後はリダイレクト
  redirect('/admin/job/new');
}
