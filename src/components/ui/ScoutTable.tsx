import React from 'react';

interface ScoutTableProps {
  data: {
    last7Days: {
      sent: number;
      opened: number;
      replied: number;
      applied: number;
    };
    last30Days: {
      sent: number;
      opened: number;
      replied: number;
      applied: number;
    };
    total: {
      sent: number;
      opened: number;
      replied: number;
      applied: number;
    };
  };
}

export const ScoutTable: React.FC<ScoutTableProps> = ({ data }) => {
  const calculateRate = (value: number, total: number) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

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
          <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">{data.last7Days.sent}</td>
          <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">{data.last7Days.opened}</td>
          <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">
            {data.last7Days.replied} ({calculateRate(data.last7Days.replied, data.last7Days.sent)}%)
          </td>
          <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">
            {data.last7Days.applied} ({calculateRate(data.last7Days.applied, data.last7Days.sent)}%)
          </td>
        </tr>
        <tr>
          <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#666666]">過去30日合計</td>
          <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">{data.last30Days.sent}</td>
          <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">{data.last30Days.opened}</td>
          <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">
            {data.last30Days.replied} ({calculateRate(data.last30Days.replied, data.last30Days.sent)}%)
          </td>
          <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">
            {data.last30Days.applied} ({calculateRate(data.last30Days.applied, data.last30Days.sent)}%)
          </td>
        </tr>
        <tr>
          <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#666666]">累計</td>
          <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">{data.total.sent}</td>
          <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">{data.total.opened}</td>
          <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">
            {data.total.replied} ({calculateRate(data.total.replied, data.total.sent)}%)
          </td>
          <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">
            {data.total.applied} ({calculateRate(data.total.applied, data.total.sent)}%)
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default ScoutTable;