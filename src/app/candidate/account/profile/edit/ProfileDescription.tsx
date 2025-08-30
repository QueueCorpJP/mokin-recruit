import React from 'react';

const ProfileDescription: React.FC = () => (
  <div className='mb-6 md:mb-10'>
    <p className='text-[#323232] text-[16px] leading-8 tracking-[1.6px] font-bold'>
      ご本人確認やご連絡のための基本情報を編集できます。
      <br />
      ※氏名はスカウトに返信した場合のみ企業に開示されます
      <br />
      ※電話番号は企業には公開されません
    </p>
  </div>
);

export default ProfileDescription;
