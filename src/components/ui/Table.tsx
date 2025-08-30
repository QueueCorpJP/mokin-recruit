import React from 'react';

export const Table = () => {
  return (
    <table className="border-collapse border border-gray-400">
      <tbody>
        <tr>
          <td className="w-[220px] h-[36px] border border-gray-400 bg-gray-300 text-center font-['Noto_Sans_JP'] text-[12px] font-bold text-[#323232]"></td>
          <td className="w-[220px] h-[36px] border border-gray-400 bg-gray-300 text-center font-['Noto_Sans_JP'] text-[12px] font-bold text-[#323232]">スカウト送信数</td>
          <td className="w-[220px] h-[36px] border border-gray-400 bg-gray-300 text-center font-['Noto_Sans_JP'] text-[12px] font-bold text-[#323232]">開封数</td>
          <td className="w-[220px] h-[36px] border border-gray-400 bg-gray-300 text-center font-['Noto_Sans_JP'] text-[12px] font-bold text-[#323232]">返信数(返信率)</td>
          <td className="w-[220px] h-[36px] border border-gray-400 bg-gray-300 text-center font-['Noto_Sans_JP'] text-[12px] font-bold text-[#323232]">応募数(応募率)</td>
        </tr>
        <tr>
          <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#666666]">過去7日合計</td>
          <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">0</td>
          <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">0</td>
          <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">0 (0%)</td>
          <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">0 (0%)</td>
        </tr>
        <tr>
          <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#666666]">過去30日合計</td>
          <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">0</td>
          <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">0</td>
          <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">0 (0%)</td>
          <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">0 (0%)</td>
        </tr>
        <tr>
          <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#666666]">累計</td>
          <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">0</td>
          <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">0</td>
          <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">0 (0%)</td>
          <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">0 (0%)</td>
        </tr>
      </tbody>
    </table>
  );
};

export default Table;
