import React from 'react';

interface SelectionStatusRowProps {
  companyName: string;
  industryTags: string[];
  jobTitle: string;
  interviewResult: string;
  withdrawalReason?: string;
}

const SelectionStatusRow: React.FC<SelectionStatusRowProps> = ({
  companyName,
  industryTags,
  jobTitle,
  interviewResult,
  withdrawalReason,
}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 16,
      height: 60,
    }}
  >
    {/* 企業名 */}
    <span
      style={{
        width: 200,
        height: 60,
        maxHeight: 60,
        fontSize: 14,
        fontWeight: 'bold',
        lineHeight: '160%',
        color: '#0F9058',
        display: '-webkit-box',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'normal',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
      }}
    >
      <span
        style={{
          textDecoration: 'underline',
          textDecorationColor: '#0F9058',
          textUnderlineOffset: 2,
        }}
      >
        {companyName}
      </span>
    </span>
    {/* 業種タグ */}
    <span
      style={{
        width: 200,
        height: 60,
        maxHeight: 60,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        alignItems: 'flex-start',
        overflow: 'hidden',
      }}
    >
      {industryTags.map((tag, idx) => (
        <span
          key={idx}
          style={{
            fontSize: 14,
            fontWeight: 500,
            lineHeight: '160%',
            color: '#0F9058',
            background: '#D2F1DA',
            padding: '2px 8px',
            borderRadius: 8,
          }}
        >
          {tag}
        </span>
      ))}
    </span>
    {/* 職種テキスト */}
    <span
      style={{
        width: 200,
        height: 60,
        maxHeight: 60,
        fontSize: 14,
        fontWeight: 500,
        lineHeight: '160%',
        color: '#323232',
        display: '-webkit-box',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'normal',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
      }}
    >
      {jobTitle}
    </span>
    {/* 面接結果 */}
    <span
      style={{
        width: 107,
        fontSize: 14,
        fontWeight: 500,
        lineHeight: 1,
        color: '#fff',
        background: '#0F9058',
        padding: '2px 8px',
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 26,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      {interviewResult}
    </span>
    {/* 辞退理由 */}
    <span
      style={{
        width: 149,
        height: 60,
        maxHeight: 60,
        fontSize: 10,
        fontWeight: 500,
        lineHeight: '160%',
        color: '#323232',
        display: '-webkit-box',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'normal',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
      }}
    >
      {withdrawalReason ? withdrawalReason : '未記載'}
    </span>
  </div>
);

export default SelectionStatusRow;
