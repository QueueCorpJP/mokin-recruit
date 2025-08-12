import React from 'react';

// --- やることリストの各アイテムのスタイルを流用 ---
const todoItemStyle: React.CSSProperties = {
  background: '#FFFFFF',
  padding: '16px 24px',
  boxSizing: 'border-box',
  borderRadius: '8px',
  boxShadow: '0 0 20px rgba(0,0,0,0.05)',
};

export interface Message {
  id: string;
  sender: string;
  body: string;
  date: string;
}

interface MessageListCardProps {
  messages: Message[];
  onClickMessage?: (message: Message) => void;
}

export const MessageListCard: React.FC<MessageListCardProps> = ({
  messages,
  onClickMessage,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {messages.map(msg => (
        <div
          key={msg.id}
          style={{
            ...todoItemStyle,
            cursor: onClickMessage ? 'pointer' : 'default',
          }}
          onClick={onClickMessage ? () => onClickMessage(msg) : undefined}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 16,
            }}
          >
            {/* 左カラム: 64x64の薄いグレー円形ダミー */}
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: '#E0E0E0',
                flexShrink: 0,
              }}
            />
            {/* 右カラム: 高さ64px・左上揃え */}
            <div
              style={{
                flex: 1,
                minWidth: 0,
                height: 64,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  minWidth: 0,
                }}
              >
                {/* 左: boldテキスト */}
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    lineHeight: '200%',
                    color: '#0F9058',
                    maxWidth: 630,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: 'block',
                    flexShrink: 1,
                  }}
                  title={msg.sender}
                >
                  {msg.sender}
                </span>
                {/* 右: 日付 */}
                <span
                  style={{
                    fontSize: 14,
                    lineHeight: '160%',
                    color: '#999999',
                    marginLeft: 'auto',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                >
                  2025/8/12
                </span>
              </div>
              {/* 下: メッセージ内容（2行まで、color #323232, ...省略） */}
              <div
                style={{
                  fontSize: 14,
                  lineHeight: '160%',
                  color: '#323232',
                  marginTop: 2,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'normal',
                  width: '100%',
                }}
                title={msg.body}
              >
                {msg.body}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
