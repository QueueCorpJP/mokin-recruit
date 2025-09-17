'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/Pagination';
import type { TaskData, TaskItem } from '@/types';

interface TaskListProps {
  initialTaskData?: TaskData;
  tasks?: any[];
}

export default function TaskList({ initialTaskData, tasks }: TaskListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const userState = {
    profileIncomplete: false,
    hasNewScout: false,
    hasUnreadScout: false,
    ...initialTaskData,
  };

  const is72HoursPassed = (date?: Date): boolean => {
    if (!date) return false;
    const seventyTwoHoursInMs = 72 * 60 * 60 * 1000;
    return Date.now() - date.getTime() >= seventyTwoHoursInMs;
  };

  const isWithin72Hours = (date?: Date): boolean => {
    if (!date) return false;
    const seventyTwoHoursInMs = 72 * 60 * 60 * 1000;
    return Date.now() - date.getTime() < seventyTwoHoursInMs;
  };

  const checkProfileIncomplete = () => userState.profileIncomplete;
  const checkNewScout = () => false;
  const checkUnreadScout = () => false;
  const checkNewMessage = (): boolean =>
    Boolean(
      userState.hasNewMessage && isWithin72Hours(userState.newMessageDate)
    );
  const checkUnreadMessage = (): boolean =>
    Boolean(
      userState.hasUnreadMessage && is72HoursPassed(userState.unreadMessageDate)
    );

  const generateSubText = (companyName?: string, jobTitle?: string): string => {
    if (companyName && jobTitle) {
      return `${companyName} | ${jobTitle}`;
    }
    return '企業名 | 求人タイトル';
  };

  const taskItems: TaskItem[] = [
    {
      id: '1',
      title: '会員情報を充実させましょう。スカウトが届きやすくなります。',
      description: 'スカウトが届きやすくなります',
      iconSrc: '/images/check.svg',
      triggerFunction: checkProfileIncomplete,
      navigateTo: '/candidate/profile',
    },
    {
      id: '2',
      title: 'あなたにスカウトが届きました！内容を確認しましょう。',
      description: generateSubText(undefined, undefined),
      iconSrc: '/images/check.svg',
      triggerFunction: checkNewScout,
      navigateTo: `/candidate/message`,
    },
    {
      id: '3',
      title: '未読のスカウトがあります。早めに確認しましょう。',
      description: generateSubText(undefined, undefined),
      iconSrc: '/images/check.svg',
      triggerFunction: checkUnreadScout,
      navigateTo: `/candidate/message`,
    },
    {
      id: '4',
      title: '企業からメッセージが届きました！内容を確認しましょう。',
      description: generateSubText(
        userState.newMessageCompanyName,
        userState.newMessageJobTitle
      ),
      iconSrc: '/images/check.svg',
      triggerFunction: checkNewMessage,
      navigateTo: `/candidate/message`,
    },
    {
      id: '5',
      title: '未読のメッセージがあります。早めに確認しましょう。',
      description: generateSubText(
        userState.unreadMessageCompanyName,
        userState.unreadMessageJobTitle
      ),
      iconSrc: '/images/check.svg',
      triggerFunction: checkUnreadMessage,
      navigateTo: `/candidate/message`,
    },
  ];

  const visibleItems = tasks
    ? tasks
    : taskItems.filter(item => item.triggerFunction());

  const itemsPerPage = 5;
  const totalPages = Math.ceil(visibleItems.length / itemsPerPage);
  const displayedItems = visibleItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleTaskItemClick = (item: TaskItem | any) => {
    // 新しい形式のタスクアイテムの場合
    if (item.id && typeof item.id === 'string') {
      const taskRoutes: Record<string, string> = {
        'profile-name': '/candidate/account/profile',
        'profile-phone': '/candidate/account/profile',
        'profile-current-job': '/candidate/account/career-status',
        'profile-expectations': '/candidate/account/expectation',
        'profile-summary': '/candidate/account/summary',
        'resume-upload': '/candidate/account/resume',
        'education-info': '/candidate/account/education',
        'skills-info': '/candidate/account/skills',
        'work-experience': '/candidate/account/recent-job',
        'expectations-settings': '/candidate/account/expectation',
        'scout-reply': '/candidate/message',
        'application-response': '/candidate/message',
        'selection-status': '/candidate/message',
        'notification-settings': '/candidate/setting/notification',
        'unread-messages': '/candidate/message',
      };

      const route = taskRoutes[item.id];
      if (route) {
        router.push(route);
      }
      return;
    }

    // 既存の形式のタスクアイテムの場合
    if (item.navigateTo) {
      if (item.id === '4' && userState.newMessageRoomId) {
        router.push(`/candidate/message?room=${userState.newMessageRoomId}`);
      } else if (item.id === '5' && userState.unreadMessageRoomId) {
        router.push(`/candidate/message?room=${userState.unreadMessageRoomId}`);
      } else {
        router.push(item.navigateTo);
      }
    }
  };

  const todoListWrapperStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const todoItemStyle: React.CSSProperties = {
    background: '#FFFFFF',
    padding: '16px 24px',
    boxSizing: 'border-box',
    borderRadius: '8px',
    boxShadow: '0 0 20px rgba(0,0,0,0.05)',
    transition: 'background 0.2s ease',
  };

  const todoItemRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
  };

  const todoTextsWrapperStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    minWidth: 0,
    flex: 1,
  };

  const todoBodyTextStyle: React.CSSProperties = {
    fontSize: '10px',
    lineHeight: '160%',
    color: '#999999',
    margin: 0,
  };

  const qaLinkTextStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 700,
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    color: '#0F9058',
    lineHeight: '200%',
    margin: 0,
    whiteSpace: 'normal',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    wordBreak: 'break-word',
  };

  return (
    <div style={todoListWrapperStyle}>
      {displayedItems.length > 0 ? (
        <>
          {displayedItems.map(item => (
            <div
              key={item.id}
              style={{
                ...todoItemStyle,
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#E9E9E9';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#FFFFFF';
              }}
              onClick={() => handleTaskItemClick(item)}
            >
              <div style={todoItemRowStyle}>
                <Image
                  src={item.iconSrc || '/images/check.svg'}
                  alt={item.completed ? '完了チェック' : 'タスクアイコン'}
                  width={48}
                  height={48}
                  loading='lazy'
                />
                <div style={todoTextsWrapperStyle}>
                  <span
                    style={{
                      ...qaLinkTextStyle,
                      whiteSpace: 'normal',
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                    }}
                  >
                    {item.title}
                  </span>
                  <p
                    style={{
                      ...todoBodyTextStyle,
                      fontSize: '10px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div style={{ marginTop: '40px' }}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: '80px',
            padding: '0',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '40px',
              alignItems: 'center',
              justifyContent: 'flex-start',
              padding: '80px 0',
              width: '100%',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '120px',
                height: '120px',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: 'auto',
                  aspectRatio: '50.0049/42.1957',
                  left: '0',
                  right: '0',
                  top: 'calc(50% + 0.293px)',
                  transform: 'translateY(-50%)',
                }}
              >
                <Image
                  src='/images/list.svg'
                  alt=''
                  width={120}
                  height={101}
                  style={{
                    maxWidth: 'none',
                    width: '100%',
                    height: '100%',
                    filter:
                      'brightness(0) saturate(100%) invert(87%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(95%)',
                  }}
                  loading='lazy'
                />
              </div>
            </div>

            <div
              style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontWeight: 500,
                lineHeight: 2,
                fontStyle: 'normal',
                position: 'relative',
                color: '#323232',
                fontSize: '16px',
                textAlign: 'center',
                whiteSpace: 'normal',
                letterSpacing: '1.6px',
              }}
            >
              <p
                style={{
                  display: 'block',
                  margin: 0,
                  marginBottom: '0',
                }}
              >
                企業からの新しいスカウトやメッセージがあると、
              </p>
              <p
                style={{
                  display: 'block',
                  margin: 0,
                }}
              >
                こちらに一覧で表示されます。
              </p>
            </div>

            <Button
              variant='blue-gradient'
              size='figma-default'
              onClick={() => router.push('/candidate/search/setting')}
              style={{
                paddingTop: '20px',
                paddingBottom: '20px',
                fontSize: '16px',
              }}
              className='w-full md:w-auto'
            >
              求人を探す
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
