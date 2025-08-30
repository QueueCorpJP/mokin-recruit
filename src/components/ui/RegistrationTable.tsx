import React from 'react';

interface RegistrationTableProps {
  data: {
    candidates: {
      total: number;
      thisMonth: number;
      lastMonth: number;
    };
    companies: {
      total: number;
      thisMonth: number;
      lastMonth: number;
    };
  };
}

export const RegistrationTable: React.FC<RegistrationTableProps> = ({ data }) => {
  return (
    <table className="border-collapse border border-gray-400">
      <tbody>
        <tr>
          <td className="w-[220px] h-[36px] border border-gray-400 bg-gray-300 text-center font-['Noto_Sans_JP'] text-[12px] font-bold text-[#323232]"></td>
          <td className="w-[220px] h-[36px] border border-gray-400 bg-gray-300 text-center font-['Noto_Sans_JP'] text-[12px] font-bold text-[#323232]">候補者</td>
          <td className="w-[220px] h-[36px] border border-gray-400 bg-gray-300 text-center font-['Noto_Sans_JP'] text-[12px] font-bold text-[#323232]">企業</td>
        </tr>
        <tr>
          <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#666666]">今月</td>
          <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">{data.candidates.thisMonth}</td>
          <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">{data.companies.thisMonth}</td>
        </tr>
        <tr>
          <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#666666]">先月</td>
          <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">{data.candidates.lastMonth}</td>
          <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">{data.companies.lastMonth}</td>
        </tr>
        <tr>
          <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#666666]">累計</td>
          <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">{data.candidates.total}</td>
          <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">{data.companies.total}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default RegistrationTable;