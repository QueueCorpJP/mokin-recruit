'use client';

import { useState, useCallback, memo } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { X, ChevronDown, User } from 'lucide-react';
import { Logo } from './logo';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { logoutAction } from '@/lib/auth/actions';
import { Modal } from './Modal';
import { CandidateProfileModal } from './candidate-profile-modal';
import { safeLog } from '@/lib/utils/pii-safe-logger';

// Custom Icon Components

const DownIcon = memo(({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        'relative w-[10px] h-[10px] transition-transform duration-300',
        className
      )}
    >
      <img
        width={10}
        height={10}
        className='object-contain w-full h-full'
        src='/images/down.svg'
        alt='down-icon'
      />
    </div>
  );
});
DownIcon.displayName = 'DownIcon';

const HomeIcon = memo(({ className }: { className?: string }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='20'
      height='18'
      viewBox='0 0 20 18'
      fill='none'
      className={className}
    >
      <path
        d='M19.9948 8.97985C19.9948 9.6078 19.4738 10.0997 18.8834 10.0997H17.772L17.7963 15.6885C17.7963 15.7827 17.7893 15.8769 17.7789 15.9711V16.5362C17.7789 17.3072 17.1572 17.9317 16.3897 17.9317H15.834C15.7958 17.9317 15.7575 17.9317 15.7193 17.9282C15.6707 17.9317 15.6221 17.9317 15.5735 17.9317L14.4447 17.9282H13.6112C12.8436 17.9282 12.2219 17.3037 12.2219 16.5327V15.6954V13.4627C12.2219 12.8452 11.7253 12.3464 11.1105 12.3464H8.88772C8.27297 12.3464 7.77632 12.8452 7.77632 13.4627V15.6954V16.5327C7.77632 17.3037 7.15463 17.9282 6.38707 17.9282H5.55352H4.44559C4.3935 17.9282 4.3414 17.9247 4.2893 17.9212C4.24763 17.9247 4.20595 17.9282 4.16427 17.9282H3.60857C2.84101 17.9282 2.21932 17.3037 2.21932 16.5327V12.6255C2.21932 12.5941 2.21932 12.5592 2.2228 12.5278V10.0962H1.1114C0.486237 10.0962 0 9.6078 0 8.97636C0 8.66238 0.104194 8.38329 0.347312 8.13909L9.24892 0.345496C9.49204 0.101293 9.76989 0.0664062 10.013 0.0664062C10.2561 0.0664062 10.534 0.136179 10.7424 0.31061L19.6127 8.14257C19.8906 8.38678 20.0295 8.66587 19.9948 8.97985Z'
        fill='currentColor'
      />
    </svg>
  );
});
HomeIcon.displayName = 'HomeIcon';

const MessageIcon = memo(({ className }: { className?: string }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='20'
      height='20'
      viewBox='0 0 20 20'
      fill='none'
      className={className}
    >
      <path
        d='M8.41406 3.75H5.625H4.21094H3.75V4.09375V5.625V7.20312V10.6797L0.0078125 7.91016C0.0703125 7.20312 0.433594 6.54688 1.01172 6.12109L1.875 5.48047V3.75C1.875 2.71484 2.71484 1.875 3.75 1.875H6.74219L8.69141 0.433594C9.07031 0.152344 9.52734 0 10 0C10.4727 0 10.9297 0.152344 11.3086 0.429688L13.2578 1.875H16.25C17.2852 1.875 18.125 2.71484 18.125 3.75V5.48047L18.9883 6.12109C19.5664 6.54688 19.9297 7.20312 19.9922 7.91016L16.25 10.6797V7.20312V5.625V4.09375V3.75H15.7891H14.375H11.5859H8.41016H8.41406ZM0 17.5V9.45703L8.5 15.7539C8.93359 16.0742 9.46094 16.25 10 16.25C10.5391 16.25 11.0664 16.0781 11.5 15.7539L20 9.45703V17.5C20 18.8789 18.8789 20 17.5 20H2.5C1.12109 20 0 18.8789 0 17.5ZM6.875 6.25H13.125C13.4688 6.25 13.75 6.53125 13.75 6.875C13.75 7.21875 13.4688 7.5 13.125 7.5H6.875C6.53125 7.5 6.25 7.21875 6.25 6.875C6.25 6.53125 6.53125 6.25 6.875 6.25ZM6.875 8.75H13.125C13.4688 8.75 13.75 9.03125 13.75 9.375C13.75 9.71875 13.4688 10 13.125 10H6.875C6.53125 10 6.25 9.71875 6.25 9.375C6.25 9.03125 6.53125 8.75 6.875 8.75Z'
        fill='currentColor'
      />
    </svg>
  );
});
MessageIcon.displayName = 'MessageIcon';

const SearchIcon = memo(({ className }: { className?: string }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='20'
      height='20'
      viewBox='0 0 20 20'
      fill='none'
      className={className}
    >
      <path
        d='M16.2508 8.12344C16.2508 9.9165 15.6687 11.5728 14.6882 12.9166L19.6338 17.8661C20.1221 18.3544 20.1221 19.1474 19.6338 19.6357C19.1455 20.124 18.3525 20.124 17.8642 19.6357L12.9186 14.6863C11.5748 15.6707 9.91845 16.2488 8.1254 16.2488C3.6369 16.2488 0 12.6119 0 8.12344C0 3.63494 3.6369 -0.00195312 8.1254 -0.00195312C12.6139 -0.00195312 16.2508 3.63494 16.2508 8.12344ZM8.1254 13.7487C8.86412 13.7487 9.59561 13.6032 10.2781 13.3205C10.9606 13.0378 11.5807 12.6235 12.1031 12.1011C12.6254 11.5788 13.0398 10.9586 13.3225 10.2761C13.6052 9.59365 13.7507 8.86217 13.7507 8.12344C13.7507 7.38472 13.6052 6.65323 13.3225 5.97074C13.0398 5.28825 12.6254 4.66813 12.1031 4.14577C11.5807 3.62342 10.9606 3.20906 10.2781 2.92637C9.59561 2.64367 8.86412 2.49817 8.1254 2.49817C7.38668 2.49817 6.65519 2.64367 5.9727 2.92637C5.29021 3.20906 4.67008 3.62342 4.14773 4.14577C3.62537 4.66813 3.21102 5.28825 2.92832 5.97074C2.64562 6.65323 2.50012 7.38472 2.50012 8.12344C2.50012 8.86217 2.64562 9.59365 2.92832 10.2761C3.21102 10.9586 3.62537 11.5788 4.14773 12.1011C4.67008 12.6235 5.29021 13.0378 5.9727 13.3205C6.65519 13.6032 7.38668 13.7487 8.1254 13.7487Z'
        fill='currentColor'
      />
    </svg>
  );
});
SearchIcon.displayName = 'SearchIcon';

const JobListIcon = memo(({ className }: { className?: string }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='20'
      height='20'
      viewBox='0 0 20 20'
      fill='none'
      className={className}
    >
      <path
        d='M9.9999 0C8.34532 0 6.93615 1.04297 6.41761 2.5H4.93324C3.53594 2.5 2.3999 3.62109 2.3999 5V17.5C2.3999 18.8789 3.53594 20 4.93324 20H15.0666C16.4639 20 17.5999 18.8789 17.5999 17.5V5C17.5999 3.62109 16.4639 2.5 15.0666 2.5H13.5822C13.0637 1.04297 11.6545 0 9.9999 0ZM9.9999 2.5C10.3358 2.5 10.658 2.6317 10.8956 2.86612C11.1331 3.10054 11.2666 3.41848 11.2666 3.75C11.2666 4.08152 11.1331 4.39946 10.8956 4.63388C10.658 4.8683 10.3358 5 9.9999 5C9.66396 5 9.34178 4.8683 9.10423 4.63388C8.86669 4.39946 8.73324 4.08152 8.73324 3.75C8.73324 3.41848 8.86669 3.10054 9.10423 2.86612C9.34178 2.6317 9.66396 2.5 9.9999 2.5ZM5.2499 10.625C5.2499 10.3764 5.34999 10.1379 5.52815 9.96209C5.70631 9.78627 5.94795 9.6875 6.1999 9.6875C6.45186 9.6875 6.69349 9.78627 6.87165 9.96209C7.04981 10.1379 7.1499 10.3764 7.1499 10.625C7.1499 10.8736 7.04981 11.1121 6.87165 11.2879C6.69349 11.4637 6.45186 11.5625 6.1999 11.5625C5.94795 11.5625 5.70631 11.4637 5.52815 11.2879C5.34999 11.1121 5.2499 10.8736 5.2499 10.625ZM9.36657 10H14.4332C14.7816 10 15.0666 10.2812 15.0666 10.625C15.0666 10.9688 14.7816 11.25 14.4332 11.25H9.36657C9.01824 11.25 8.73324 10.9688 8.73324 10.625C8.73324 10.2812 9.01824 10 9.36657 10ZM5.2499 14.375C5.2499 14.1264 5.34999 13.8879 5.52815 13.7121C5.70631 13.5363 5.94795 13.4375 6.1999 13.4375C6.45186 13.4375 6.69349 13.5363 6.87165 13.7121C7.04981 13.8879 7.1499 14.1264 7.1499 14.375C7.1499 14.6236 7.04981 14.8621 6.87165 15.0379C6.69349 15.2137 6.45186 15.3125 6.1999 15.3125C5.94795 15.3125 5.70631 15.2137 5.52815 15.0379C5.34999 14.8621 5.2499 14.6236 5.2499 14.375ZM8.73324 14.375C8.73324 14.0312 9.01824 13.75 9.36657 13.75H14.4332C14.7816 13.75 15.0666 14.0312 15.0666 14.375C15.0666 14.7188 14.7816 15 14.4332 15H9.36657C9.01824 15 8.73324 14.7188 8.73324 14.375Z'
        fill='currentColor'
      />
    </svg>
  );
});
JobListIcon.displayName = 'JobListIcon';

const ResponseListIcon = memo(({ className }: { className?: string }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='20'
      height='20'
      viewBox='0 0 20 20'
      fill='none'
      className={className}
    >
      <path
        d='M5.94278 2.1009C6.32946 2.44852 6.36071 3.03831 6.01308 3.42499L3.20086 6.54969C3.029 6.74107 2.78684 6.85434 2.52905 6.85825C2.27126 6.86215 2.02519 6.76451 1.84162 6.58484L0.275364 5.02249C-0.0878821 4.65534 -0.0878821 4.06165 0.275364 3.6945C0.63861 3.32734 1.23621 3.32734 1.59945 3.6945L2.46265 4.55769L4.61478 2.1673C4.96241 1.78062 5.55219 1.74937 5.93887 2.097L5.94278 2.1009ZM5.94278 8.35029C6.32946 8.69791 6.36071 9.2877 6.01308 9.67438L3.20086 12.7991C3.029 12.9905 2.78684 13.1037 2.52905 13.1076C2.27126 13.1115 2.02519 13.0139 1.84162 12.8342L0.275364 11.2719C-0.0917879 10.9047 -0.0917879 10.311 0.275364 9.94779C0.642515 9.58455 1.23621 9.58064 1.59945 9.94779L2.46265 10.811L4.61478 8.4206C4.96241 8.03392 5.55219 8.00267 5.93887 8.35029H5.94278ZM8.7511 4.35849C8.7511 3.66715 9.30964 3.10862 10.001 3.10862H18.7501C19.4415 3.10862 20 3.66715 20 4.35849C20 5.04983 19.4415 5.60837 18.7501 5.60837H10.001C9.30964 5.60837 8.7511 5.04983 8.7511 4.35849ZM8.7511 10.6079C8.7511 9.91654 9.30964 9.358 10.001 9.358H18.7501C19.4415 9.358 20 9.91654 20 10.6079C20 11.2992 19.4415 11.8578 18.7501 11.8578H10.001C9.30964 11.8578 8.7511 11.2992 8.7511 10.6079ZM6.25134 16.8573C6.25134 16.1659 6.80988 15.6074 7.50122 15.6074H18.7501C19.4415 15.6074 20 16.1659 20 16.8573C20 17.5486 19.4415 18.1072 18.7501 18.1072H7.50122C6.80988 18.1072 6.25134 17.5486 6.25134 16.8573ZM1.87677 14.9825C2.374 14.9825 2.85087 15.18 3.20247 15.5316C3.55406 15.8832 3.75159 16.36 3.75159 16.8573C3.75159 17.3545 3.55406 17.8314 3.20247 18.183C2.85087 18.5346 2.374 18.7321 1.87677 18.7321C1.37954 18.7321 0.90267 18.5346 0.551074 18.183C0.199478 17.8314 0.00195292 17.3545 0.00195292 16.8573C0.00195292 16.36 0.199478 15.8832 0.551074 15.5316C0.90267 15.18 1.37954 14.9825 1.87677 14.9825Z'
        fill='currentColor'
      />
    </svg>
  );
});
ResponseListIcon.displayName = 'ResponseListIcon';

const HelpIcon = memo(({ className }: { className?: string }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='20'
      height='20'
      viewBox='0 0 20 20'
      fill='none'
      className={className}
    >
      <path
        d='M18.125 10C18.125 7.84512 17.269 5.77849 15.7452 4.25476C14.2215 2.73102 12.1549 1.875 10 1.875C7.84512 1.875 5.77849 2.73102 4.25476 4.25476C2.73102 5.77849 1.875 7.84512 1.875 10C1.875 12.1549 2.73102 14.2215 4.25476 15.7452C5.77849 17.269 7.84512 18.125 10 18.125C12.1549 18.125 14.2215 17.269 15.7452 15.7452C17.269 14.2215 18.125 12.1549 18.125 10ZM0 10C0 7.34784 1.05357 4.8043 2.92893 2.92893C4.8043 1.05357 7.34784 0 10 0C12.6522 0 15.1957 1.05357 17.0711 2.92893C18.9464 4.8043 20 7.34784 20 10C20 12.6522 18.9464 15.1957 17.0711 17.0711C15.1957 18.9464 12.6522 20 10 20C7.34784 20 4.8043 18.9464 2.92893 17.0711C1.05357 15.1957 0 12.6522 0 10ZM6.63281 6.45703C6.94141 5.58594 7.76953 5 8.69531 5H10.9727C12.3359 5 13.4375 6.10547 13.4375 7.46484C13.4375 8.34766 12.9648 9.16406 12.1992 9.60547L10.9375 10.3281C10.9297 10.8359 10.5117 11.25 10 11.25C9.48047 11.25 9.0625 10.832 9.0625 10.3125V9.78516C9.0625 9.44922 9.24219 9.14062 9.53516 8.97266L11.2656 7.98047C11.4492 7.875 11.5625 7.67969 11.5625 7.46875C11.5625 7.14062 11.2969 6.87891 10.9727 6.87891H8.69531C8.5625 6.87891 8.44531 6.96094 8.40234 7.08594L8.38672 7.13281C8.21484 7.62109 7.67578 7.875 7.19141 7.70312C6.70703 7.53125 6.44922 6.99219 6.62109 6.50781L6.63672 6.46094L6.63281 6.45703ZM8.75 13.75C8.75 13.4185 8.8817 13.1005 9.11612 12.8661C9.35054 12.6317 9.66848 12.5 10 12.5C10.3315 12.5 10.6495 12.6317 10.8839 12.8661C11.1183 13.1005 11.25 13.4185 11.25 13.75C11.25 14.0815 11.1183 14.3995 10.8839 14.6339C10.6495 14.8683 10.3315 15 10 15C9.66848 15 9.35054 14.8683 9.11612 14.6339C8.8817 14.3995 8.75 14.0815 8.75 13.75Z'
        fill='currentColor'
      />
    </svg>
  );
});
HelpIcon.displayName = 'HelpIcon';

const HamburgerIcon = memo(({ className }: { className?: string }) => {
  return (
    <svg
      width='48'
      height='32'
      viewBox='0 0 48 32'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={cn('w-12 h-8', className)}
      style={{ minWidth: '48px', minHeight: '32px' }}
    >
      <rect y='4' width='48' height='2' rx='1' fill='#0F9058' />
      <rect y='15' width='48' height='2' rx='1' fill='#0F9058' />
      <rect y='26' width='48' height='2' rx='1' fill='#0F9058' />
    </svg>
  );
});
HamburgerIcon.displayName = 'HamburgerIcon';

// Profileアイコン
const ProfileIcon = memo(({ className }: { className?: string }) => (
  <svg
    width='21'
    height='20'
    viewBox='0 0 21 20'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    className={className}
  >
    <path
      d='M5.33963 6.10352e-05H11.985H12.4996L12.8637 0.363381L17.895 5.39467L18.2583 5.7583V6.27295V16.6446C18.2583 18.4945 16.7531 20.0001 14.9028 20.0001H5.33959C3.49006 20.0001 1.98483 18.4945 1.98483 16.6446V3.35483C1.98486 1.5049 3.49006 6.10352e-05 5.33963 6.10352e-05ZM3.22717 16.6446C3.22717 17.8116 4.17295 18.7577 5.33959 18.7577H14.9028C16.0698 18.7577 17.016 17.8116 17.016 16.6446V6.27299H13.7457C12.7737 6.27299 11.985 5.48459 11.985 4.51229V1.24233H5.33959C4.17295 1.24233 3.22717 2.1885 3.22717 3.35479V16.6446Z'
      fill='currentColor'
    />
    <path
      d='M6.73426 6.22748C7.0338 6.43713 7.39848 6.56095 7.79098 6.56095C8.1838 6.56095 8.54817 6.43713 8.84805 6.22748C9.37219 6.45306 9.69415 6.84865 9.89055 7.19806C10.1515 7.6615 9.94688 8.31756 9.49634 8.31756C9.04516 8.31756 7.79098 8.31756 7.79098 8.31756C7.79098 8.31756 6.53716 8.31756 6.08594 8.31756C5.63509 8.31756 5.4302 7.6615 5.69141 7.19806C5.88786 6.84861 6.20981 6.45306 6.73426 6.22748Z'
      fill='currentColor'
    />
    <path
      d='M7.79094 6.12196C7.02051 6.12196 6.39664 5.49809 6.39664 4.72801V4.39387C6.39664 3.62449 7.02051 2.99957 7.79094 2.99957C8.56102 2.99957 9.18555 3.62449 9.18555 4.39387V4.72801C9.18555 5.49809 8.56098 6.12196 7.79094 6.12196Z'
      fill='currentColor'
    />
    <path
      d='M5.66735 10.1708H14.6671V11.0447H5.66735V10.1708Z'
      fill='currentColor'
    />
    <path
      d='M5.62182 12.7925H14.6216V13.6667H5.62182V12.7925Z'
      fill='currentColor'
    />
    <path
      d='M5.65492 15.4144H11.955V16.288H5.65492V15.4144Z'
      fill='currentColor'
    />
  </svg>
));
ProfileIcon.displayName = 'ProfileIcon';

interface NavigationProps {
  className?: string;
  variant?: 'default' | 'transparent' | 'company' | 'candidate';
  isLoggedIn?: boolean;
  userInfo?: {
    companyName?: string;
    userName?: string;
  };
  customCTAButton?: {
    label: string;
    href: string;
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  };
}

// アイコン色を動的に付与する関数
function getNavIconColorClass(isActive: boolean, isHovered: boolean) {
  return isActive || isHovered ? 'text-[#0F9058]' : 'text-[#323232]';
}

export function Navigation({
  className,
  variant = 'default',
  isLoggedIn = false,
  userInfo,
  customCTAButton,
}: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  // ドロップダウンメニューの切り替え
  const toggleDropdown = useCallback((dropdown: string) => {
    setOpenDropdown(prev => (prev === dropdown ? null : dropdown));
    setIsMenuOpen(false);
  }, []);

  // ログアウト処理
  const handleLogout = useCallback(async () => {
    try {
      const result = await logoutAction();

      if (result.success) {
        // すべてのUIを閉じる
        setIsMenuOpen(false);
        setOpenDropdown(null);
        // 適切なログイン画面にリダイレクト
        if (variant === 'company') {
          router.push('/company/auth/login');
        } else if (variant === 'candidate') {
          router.push('/candidate/auth/login');
        } else {
          router.push('/');
        }
      } else {
        safeLog('error', 'ログアウト失敗', { error: result.error });
      }
    } catch (error) {
      safeLog('error', 'ログアウト処理エラー', { error: error instanceof Error ? error.message : String(error) });
      setOpenDropdown(null);
    }
  }, [variant, router]);

  // メモ化されたnavigationItems
  const candidateNavigationItems = useCallback(
    () => [
      {
        label: 'マイページ',
        href: '/candidate/mypage',
        icon: HomeIcon,
        hasDropdown: false,
        isActive: pathname === '/candidate/mypage',
        prefetch: true,
      },
      {
        label: 'メッセージ',
        href: '/candidate/message',
        icon: MessageIcon,
        hasDropdown: false,
        isActive: pathname.startsWith('/candidate/message'),
        prefetch: false,
      },
      {
        label: '求人を探す',
        href: '/candidate/search/setting',
        icon: SearchIcon,
        hasDropdown: true,
        isActive: pathname.startsWith('/candidate/search/setting'),
        prefetch: false,
        dropdownItems: [
          {
            label: '求人一覧',
            href: '/candidate/search/setting',
            prefetch: false,
          },
          {
            label: 'お気に入り求人',
            href: '/candidate/job/favorite',
            prefetch: false,
          },
        ],
      },
      {
        label: 'プロフィール確認・編集',
        href: '/candidate/account',
        icon: ProfileIcon,
        hasDropdown: false,
        isActive: pathname.startsWith('/candidate/account'),
        prefetch: false,
      },
      {
        label: 'やることリスト',
        href: '/candidate/task',
        icon: ResponseListIcon,
        hasDropdown: false,
        isActive: pathname.startsWith('/candidate/task'),
        prefetch: false,
      },
    ],
    [pathname]
  );

  const companyNavigationItems = useCallback(
    () => [
      {
        label: 'マイページ',
        href: '/company/mypage',
        icon: HomeIcon,
        hasDropdown: false,
        isActive: pathname === '/company/mypage',
        prefetch: true,
      },
      {
        label: 'メッセージ',
        href: '/company/message',
        icon: MessageIcon,
        hasDropdown: true,
        isActive: pathname.startsWith('/company/message'),
        prefetch: false,
        dropdownItems: [
          {
            label: '受信メッセージ',
            href: '/company/message',
            prefetch: false,
          },
          {
            label: '送信メッセージ',
            href: '/company/message/sent',
            prefetch: false,
          },
        ],
      },
      {
        label: '候補者を探す',
        href: '/company/candidates',
        icon: SearchIcon,
        hasDropdown: true,
        isActive: pathname.startsWith('/company/candidates'),
        prefetch: false,
        dropdownItems: [
          {
            label: '候補者検索',
            href: '/company/search/result',
            prefetch: false,
          },
          {
            label: 'スカウト履歴',
            href: '/company/candidates/scout-history',
            prefetch: false,
          },
        ],
      },
      {
        label: '求人一覧',
        href: '/company/job',
        icon: JobListIcon,
        hasDropdown: false,
        isActive: pathname.startsWith('/company/job'),
        prefetch: false,
      },
      {
        label: '対応リスト',
        href: '/company/task',
        icon: ResponseListIcon,
        hasDropdown: false,
        isActive: pathname.startsWith('/company/task'),
        prefetch: false,
      },
      {
        label: 'ヘルプ',
        href: '/company/help',
        icon: HelpIcon,
        hasDropdown: true,
        isActive: pathname.startsWith('/company/help'),
        dropdownItems: [
          { label: 'よくある質問', href: '/company/help/faq' },
          { label: 'お問い合わせ', href: '/company/contact' },
        ],
      },
    ],
    [pathname]
  );

  const toggleMenuCallback = useCallback(() => {
    setIsMenuOpen(!isMenuOpen);
  }, [isMenuOpen]);

  const closeMenuCallback = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const closeDropdownCallback = useCallback(() => {
    setOpenDropdown(null);
  }, []);

  // variant に応じたCTAボタンの設定
  // --- ここから拡張 ---
  if ((variant as string) === 'candidate' && !isLoggedIn) {
    // Figma準拠: 会員登録（filled/gradient）・ログイン（outline/ghost）
    const candidateButtons = [
      {
        href: '/signup',
        label: '会員登録',
        variant: 'green-gradient',
        size: 'lg',
        className:
          'rounded-[32px] px-8 font-bold tracking-[0.1em] h-[60px] max-h-[60px] transition-all duration-200 ease-in-out hover:shadow-lg',
      },
      {
        href: '/candidate/auth/login',
        label: 'ログイン',
        variant: 'green-outline',
        size: 'lg',
        className:
          'rounded-[32px] px-8 font-bold tracking-[0.1em] h-[60px] max-h-[60px] border-2 border-[#0F9058] text-[#0F9058] hover:bg-[#F3FBF7] transition-all duration-200 ease-in-out',
      },
    ];
    return (
      <header
        className={cn(
          'w-full border-b border-gray-200 navigation-header',
          (variant as string) === 'transparent' ? 'bg-transparent' : 'bg-white',
          className
        )}
        style={{ height: '80px' }}
      >
        <div className='w-full mx-auto px-4 sm:px-6 lg:px-8'>
          <div
            className='flex justify-between items-center navigation-container'
            style={{ height: '80px' }}
          >
            {/* Logo */}
            <div className='flex-shrink-0 flex items-center h-full'>
              <Logo className=' w-auto h-[32px] md:w-[180px] md:h-[32px]' />
            </div>

            {/* Desktop Buttons */}
            <div className='hidden lg:flex items-center gap-[16px]'>
              {candidateButtons.map((btn, index) => (
                <Button
                  key={`${btn.label}-${index}`}
                  variant={btn.variant as any}
                  size={btn.size as any}
                  className={btn.className}
                  asChild
                >
                  <Link href={btn.href} prefetch={false}>
                    {btn.label}
                  </Link>
                </Button>
              ))}
            </div>

            {/* Mobile menu button */}
            <div className='lg:hidden'>
              <Button
                variant='ghost'
                className='p-2'
                onClick={toggleMenuCallback}
                aria-label='メニューを開く'
              >
                {isMenuOpen ? <X className='h-6 w-6' /> : <HamburgerIcon />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className='lg:hidden bg-white shadow-lg border-t border-gray-100'>
              <div className='px-6 py-6 space-y-3'>
                {/* 会員登録ボタン（グラデーション） */}
                <Button
                  variant='green-gradient'
                  size='lg'
                  className='w-full rounded-full px-6 font-semibold h-[48px] text-[15px] text-white shadow-md hover:shadow-lg transition-all duration-200 ease-in-out active:scale-[0.98]'
                  asChild
                >
                  <Link
                    href='/signup'
                    prefetch={false}
                    onClick={closeMenuCallback}
                  >
                    会員登録
                  </Link>
                </Button>

                {/* ログインボタン（アウトライン） */}
                <Button
                  variant='outline'
                  size='lg'
                  className='w-full rounded-full px-6 font-semibold h-[48px] text-[15px] border-2 border-[#0F9058] text-[#0F9058] bg-white hover:bg-[#F8FDF9] transition-all duration-200 ease-in-out active:scale-[0.98]'
                  asChild
                >
                  <Link
                    href='/candidate/auth/login'
                    prefetch={false}
                    onClick={closeMenuCallback}
                  >
                    ログイン
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>
    );
  }

  // Company variant でログイン後のヘッダー
  if (variant === 'company' && isLoggedIn) {
    const navigationItems = companyNavigationItems();

    return (
      <header
        className={cn('w-full border-b border-[#E5E5E5] bg-white', className)}
      >
        <div className='w-full flex justify-center'>
          <div className='flex items-center h-[80px] w-full px-[40px] justify-between w-full'>
            {/* ロゴ：左端に配置 */}
            <div className='flex-shrink-0'>
              <Logo className='w-[32px] h-auto md:w-[180px] md:h-[32px]' />
            </div>

            {/* デスクトップ用メニュー項目とアカウント情報 */}
            <nav className='hidden lg:flex items-center ml-[40px]'>
              {/* すべてのナビゲーション項目を配置 */}
              <div className='flex items-center gap-10'>
                {navigationItems.map((item, index) => (
                  <div
                    key={`${item.label}-${index}`}
                    className='relative group'
                    onMouseEnter={() => {
                      if (item.hasDropdown) {
                        if (hoverTimeout) {
                          clearTimeout(hoverTimeout);
                          setHoverTimeout(null);
                        }
                        setOpenDropdown(item.label);
                      }
                    }}
                    onMouseLeave={() => {
                      if (item.hasDropdown) {
                        const timeout = setTimeout(() => {
                          setOpenDropdown(null);
                        }, 400);
                        setHoverTimeout(timeout);
                      }
                    }}
                  >
                    {item.hasDropdown ? (
                      <div>
                        <button
                          className={cn(
                            'flex items-center gap-1 py-2 font-noto-sans-jp font-bold leading-[200%] tracking-[1.6px] text-[16px] relative',
                            openDropdown === item.label || item.isActive
                              ? 'text-[#0F9058]'
                              : 'text-[var(--text-primary,#323232)] hover:text-[#0F9058]',
                            item.isActive &&
                              'after:content-[""] after:absolute after:left-0 after:bottom-[-20px] after:w-full after:h-[3px] after:bg-[#0F9058]'
                          )}
                        >
                          <item.icon className='w-5 h-5' />
                          <span>{item.label}</span>
                          <DownIcon
                            className={cn(
                              'ml-1',
                              openDropdown === item.label && 'rotate-180'
                            )}
                          />
                        </button>
                        {/* ドロップダウンメニュー */}
                        {openDropdown === item.label && (
                          <div className='absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50'>
                            {item.dropdownItems?.map(
                              (dropdownItem, dropdownIndex) => (
                                <Link
                                  key={`${dropdownItem.label}-${dropdownIndex}`}
                                  href={dropdownItem.href}
                                  prefetch={false}
                                  className={cn(
                                    'block px-4 py-2 text-[16px] font-noto-sans-jp font-bold leading-[200%] tracking-[1.6px]',
                                    pathname === dropdownItem.href
                                      ? 'text-[#0F9058] bg-[#F3FBF7]'
                                      : 'text-[var(--text-primary,#323232)] hover:bg-[#F3FBF7] hover:text-[#0F9058]'
                                  )}
                                  onClick={closeDropdownCallback}
                                >
                                  {dropdownItem.label}
                                </Link>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        prefetch={item.prefetch}
                        className={cn(
                          'flex items-center gap-1 py-2 font-noto-sans-jp font-bold leading-[200%] tracking-[1.6px] text-[16px] relative',
                          item.isActive
                            ? 'text-[#0F9058] after:content-[""] after:absolute after:left-0 after:bottom-[-20px] after:w-full after:h-[3px] after:bg-[#0F9058]'
                            : 'text-[var(--text-primary,#323232)] hover:text-[#0F9058]'
                        )}
                      >
                        <item.icon className='w-5 h-5' />
                        <span>{item.label}</span>
                      </Link>
                    )}
                  </div>
                ))}

                {/* アカウント情報も他のメニュー項目と同様に配置 */}
                <div
                  className='relative group'
                  onMouseEnter={() => {
                    if (hoverTimeout) {
                      clearTimeout(hoverTimeout);
                      setHoverTimeout(null);
                    }
                    setOpenDropdown('account');
                  }}
                  onMouseLeave={() => {
                    const timeout = setTimeout(() => {
                      setOpenDropdown(null);
                    }, 400);
                    setHoverTimeout(timeout);
                  }}
                >
                  <button
                    className={cn(
                      'flex items-center gap-1 py-2 font-noto-sans-jp font-bold leading-[200%] tracking-[1.6px] text-[16px]',
                      openDropdown === 'account'
                        ? 'text-[#0F9058]'
                        : 'text-[var(--text-primary,#323232)] hover:text-[#0F9058]'
                    )}
                  >
                    <User className='w-5 h-5' />
                    <span>アカウント</span>
                    <DownIcon
                      className={cn(
                        'ml-1',
                        openDropdown === 'account' && 'rotate-180'
                      )}
                    />
                  </button>
                  {/* アカウントドロップダウン */}
                  {openDropdown === 'account' && (
                    <div className='absolute top-full right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50'>
                      <Link
                        href='/company/setting'
                        className={cn(
                          'block px-4 py-2 text-[16px] font-noto-sans-jp font-bold leading-[200%] tracking-[1.6px]',
                          pathname === '/company/setting'
                            ? 'text-[#0F9058] bg-[#F3FBF7]'
                            : 'text-[var(--text-primary,#323232)] hover:bg-[#F3FBF7] hover:text-[#0F9058]'
                        )}
                      >
                        アカウント設定
                      </Link>
                      <button
                        onClick={handleLogout}
                        className='w-full text-left px-4 py-2 text-[16px] font-noto-sans-jp font-bold leading-[200%] tracking-[1.6px] text-[var(--text-primary,#323232)] hover:bg-[#F3FBF7] hover:text-[#0F9058]'
                      >
                        ログアウト
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </nav>

            {/* モバイル用ハンバーガーメニューボタン */}
            <div className='lg:hidden'>
              <Button
                variant='ghost'
                className='p-2'
                onClick={toggleMenuCallback}
                aria-label='メニューを開く'
              >
                {isMenuOpen ? <X className='h-6 w-6' /> : <HamburgerIcon />}
              </Button>
            </div>
          </div>

          {/* モバイル用ナビゲーション */}
          {isMenuOpen && (
            <div className='lg:hidden border-t border-gray-200 bg-white'>
              <div className='px-4 py-2 space-y-1'>
                {navigationItems.map((item, index) => (
                  <div key={`nav-${item.label}-${index}`}>
                    {item.hasDropdown ? (
                      <div>
                        <button
                          onClick={() => toggleDropdown(item.label)}
                          className='w-full flex items-center justify-between px-3 py-2 text-[16px] font-noto-sans-jp font-bold text-[var(--text-primary,#323232)] hover:text-[#0F9058] hover:bg-[#F3FBF7] rounded-md'
                        >
                          <div className='flex items-center gap-2'>
                            <item.icon className='w-5 h-5' />
                            <span>{item.label}</span>
                          </div>
                          <DownIcon
                            className={cn(
                              'transform transition-transform',
                              openDropdown === item.label && 'rotate-180'
                            )}
                          />
                        </button>
                        {openDropdown === item.label && (
                          <div className='ml-6 mt-1 space-y-1'>
                            {item.dropdownItems?.map(
                              (dropdownItem, dropdownIndex) => (
                                <Link
                                  key={`dropdown-${dropdownItem.label}-${dropdownIndex}`}
                                  href={dropdownItem.href}
                                  prefetch={false}
                                  className='block px-3 py-2 text-[14px] font-noto-sans-jp text-[var(--text-primary,#323232)] hover:text-[#0F9058] hover:bg-[#F3FBF7] rounded-md'
                                  onClick={() => {
                                    setIsMenuOpen(false);
                                    setOpenDropdown(null);
                                  }}
                                >
                                  {dropdownItem.label}
                                </Link>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        prefetch={item.prefetch}
                        className='flex items-center gap-2 px-3 py-2 text-[16px] font-noto-sans-jp font-bold text-[var(--text-primary,#323232)] hover:text-[#0F9058] hover:bg-[#F3FBF7] rounded-md'
                        onClick={closeMenuCallback}
                      >
                        <item.icon className='w-5 h-5' />
                        <span>{item.label}</span>
                      </Link>
                    )}
                  </div>
                ))}

                {/* モバイル用アカウント情報 */}
                <div className='border-t border-gray-200 pt-2 mt-2'>
                  <button
                    onClick={() => toggleDropdown('account')}
                    className='w-full flex items-center justify-between px-3 py-2 text-[16px] font-noto-sans-jp font-bold text-[var(--text-primary,#323232)] hover:text-[#0F9058] hover:bg-[#F3FBF7] rounded-md'
                  >
                    <div className='flex items-center gap-2'>
                      <User className='w-5 h-5' />
                      <span>アカウント</span>
                    </div>
                    <DownIcon
                      className={cn(
                        'transform transition-transform',
                        openDropdown === 'account' && 'rotate-180'
                      )}
                    />
                  </button>
                  {openDropdown === 'account' && (
                    <div className='ml-6 mt-1 space-y-1'>
                      <Link
                        href='/company/setting'
                        className={cn(
                          'block px-3 py-2 text-[14px] font-noto-sans-jp text-[var(--text-primary,#323232)] hover:text-[#0F9058] hover:bg-[#F3FBF7] rounded-md'
                        )}
                      >
                        アカウント設定
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className='w-full text-left px-3 py-2 text-[14px] font-noto-sans-jp text-[var(--text-primary,#323232)] hover:text-[#0F9058] hover:bg-[#F3FBF7] rounded-md'
                      >
                        ログアウト
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    );
  }

  // 候補者ログイン後ナビゲーションを企業用と同等構成で新規追加し、違いとして指摘された点を厳密に反映する。
  if ((variant as string) === 'candidate' && isLoggedIn) {
    const navigationItems = candidateNavigationItems();

    return (
      <>
        <header
          className={cn('w-full border-b border-[#E5E5E5] bg-white', className)}
        >
          <div className='w-full flex justify-center'>
            <div className='flex items-center h-[80px] w-full px-[40px] justify-between w-full'>
              {/* ロゴ：左端に配置 */}
              <div className='flex-shrink-0'>
                <Logo className='w-[32px] h-auto md:w-[180px] md:h-[32px]' />
              </div>
              {/* デスクトップ用メニュー項目とアカウント情報 */}
              <nav className='hidden lg:flex items-center ml-[40px]'>
                <div className='flex items-center gap-10'>
                  {navigationItems.map(item => {
                    const isHovered = openDropdown === item.label;
                    const iconColorClass = getNavIconColorClass(
                      item.isActive,
                      isHovered
                    );
                    return (
                      <div
                        key={item.label}
                        className='relative group'
                        onMouseEnter={() => {
                          if (item.hasDropdown) {
                            if (hoverTimeout) {
                              clearTimeout(hoverTimeout);
                              setHoverTimeout(null);
                            }
                            setOpenDropdown(item.label);
                          }
                        }}
                        onMouseLeave={() => {
                          if (item.hasDropdown) {
                            const timeout = setTimeout(() => {
                              setOpenDropdown(null);
                            }, 400);
                            setHoverTimeout(timeout);
                          }
                        }}
                      >
                        {item.label === 'プロフィール確認・編集' ? (
                          <button
                            type='button'
                            className={cn(
                              'flex items-center gap-1 py-2 font-noto-sans-jp font-bold leading-[200%] tracking-[1.6px] text-[16px] relative',
                              iconColorClass,
                              item.isActive
                                ? 'after:content-["" ] after:absolute after:left-0 after:bottom-[-20px] after:w-full after:h-[3px] after:bg-[#0F9058]'
                                : 'hover:text-[#0F9058]'
                            )}
                            onClick={() => setIsProfileModalOpen(true)}
                          >
                            <item.icon className='w-5 h-5' />
                            <span>{item.label}</span>
                          </button>
                        ) : item.hasDropdown ? (
                          <div>
                            <button
                              className={cn(
                                'flex items-center gap-1 py-2 font-noto-sans-jp font-bold leading-[200%] tracking-[1.6px] text-[16px] relative',
                                iconColorClass,
                                openDropdown === item.label || item.isActive
                                  ? 'text-[#0F9058]'
                                  : 'hover:text-[#0F9058]',
                                item.isActive &&
                                  'after:content-[] after:absolute after:left-0 after:bottom-[-20px] after:w-full after:h-[3px] after:bg-[#0F9058]'
                              )}
                            >
                              <item.icon className='w-5 h-5' />
                              <span>{item.label}</span>
                              <DownIcon
                                className={cn(
                                  'ml-1',
                                  openDropdown === item.label && 'rotate-180'
                                )}
                              />
                            </button>
                            {/* ドロップダウンメニュー */}
                            {openDropdown === item.label && (
                              <div className='absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50'>
                                {item.dropdownItems?.map(
                                  (dropdownItem, dropdownIndex) => (
                                    <Link
                                      key={`${dropdownItem.label}-${dropdownIndex}`}
                                      href={dropdownItem.href}
                                      prefetch={false}
                                      className={cn(
                                        'block px-4 py-2 text-[16px] font-noto-sans-jp font-bold leading-[200%] tracking-[1.6px]',
                                        pathname === dropdownItem.href
                                          ? 'text-[#0F9058] bg-[#F3FBF7]'
                                          : 'text-[var(--text-primary,#323232)] hover:bg-[#F3FBF7] hover:text-[#0F9058]'
                                      )}
                                      onClick={closeDropdownCallback}
                                    >
                                      {dropdownItem.label}
                                    </Link>
                                  )
                                )}
                              </div>
                            )}
                          </div>
                        ) : (
                          <Link
                            href={item.href}
                            prefetch={item.prefetch}
                            className={cn(
                              'flex items-center gap-1 py-2 font-noto-sans-jp font-bold leading-[200%] tracking-[1.6px] text-[16px] relative',
                              iconColorClass,
                              item.isActive
                                ? 'after:content-[] after:absolute after:left-0 after:bottom-[-20px] after:w-full after:h-[3px] after:bg-[#0F9058]'
                                : 'hover:text-[#0F9058]'
                            )}
                          >
                            <item.icon className='w-5 h-5' />
                            <span>{item.label}</span>
                          </Link>
                        )}
                      </div>
                    );
                  })}
                  {/* アカウント情報 */}
                  <div
                    className='relative group'
                    onMouseEnter={() => {
                      if (hoverTimeout) {
                        clearTimeout(hoverTimeout);
                        setHoverTimeout(null);
                      }
                      setOpenDropdown('account');
                    }}
                    onMouseLeave={() => {
                      const timeout = setTimeout(() => {
                        setOpenDropdown(null);
                      }, 600);
                      setHoverTimeout(timeout);
                    }}
                  >
                    <button
                      className={cn(
                        'flex items-center gap-1 py-2 font-noto-sans-jp font-bold leading-[200%] tracking-[1.6px] text-[16px]',
                        openDropdown === 'account'
                          ? 'text-[#0F9058]'
                          : 'text-[var(--text-primary,#323232)] hover:text-[#0F9058]'
                      )}
                    >
                      <User className='w-5 h-5' />
                      <span>アカウント</span>
                      <DownIcon
                        className={cn(
                          'ml-1',
                          openDropdown === 'account' && 'rotate-180'
                        )}
                      />
                    </button>
                    {/* アカウントドロップダウン */}
                    {openDropdown === 'account' && (
                      <div className='absolute top-full right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50'>
                        <Link
                          href='/candidate/setting'
                          className={cn(
                            'block px-4 py-2 text-[16px] font-noto-sans-jp font-bold leading-[200%] tracking-[1.6px]',
                            pathname === '/candidate/setting'
                              ? 'text-[#0F9058] bg-[#F3FBF7]'
                              : 'text-[var(--text-primary,#323232)] hover:bg-[#F3FBF7] hover:text-[#0F9058]'
                          )}
                        >
                          アカウント設定
                        </Link>
                        <button
                          onClick={handleLogout}
                          className='w-full text-left px-4 py-2 text-[16px] font-noto-sans-jp font-bold leading-[200%] tracking-[1.6px] text-[var(--text-primary,#323232)] hover:bg-[#F3FBF7] hover:text-[#0F9058]'
                        >
                          ログアウト
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </nav>

              {/* モバイル用ハンバーガーメニューボタン */}
              <div className='lg:hidden'>
                <Button
                  variant='ghost'
                  className='p-2'
                  onClick={toggleMenuCallback}
                  aria-label='メニューを開く'
                >
                  {isMenuOpen ? <X className='h-6 w-6' /> : <HamburgerIcon />}
                </Button>
              </div>
            </div>

            {/* モバイル用ナビゲーション */}
            {isMenuOpen && (
              <div className='lg:hidden border-t border-gray-200 bg-white'>
                <div className='px-4 py-2 space-y-1'>
                  {navigationItems.map((item, index) => (
                    <div key={`nav-${item.label}-${index}`}>
                      {item.hasDropdown ? (
                        <div>
                          <button
                            onClick={() => toggleDropdown(item.label)}
                            className='w-full flex items-center justify-between px-3 py-2 text-[16px] font-noto-sans-jp font-bold text-[var(--text-primary,#323232)] hover:text-[#0F9058] hover:bg-[#F3FBF7] rounded-md'
                          >
                            <div className='flex items-center gap-2'>
                              <item.icon className='w-5 h-5' />
                              <span>{item.label}</span>
                            </div>
                            <DownIcon
                              className={cn(
                                'transform transition-transform',
                                openDropdown === item.label && 'rotate-180'
                              )}
                            />
                          </button>
                          {openDropdown === item.label && (
                            <div className='ml-6 mt-1 space-y-1'>
                              {item.dropdownItems?.map(
                                (dropdownItem, dropdownIndex) => (
                                  <Link
                                    key={`dropdown-${dropdownItem.label}-${dropdownIndex}`}
                                    href={dropdownItem.href}
                                    prefetch={dropdownItem.prefetch}
                                    className='block px-3 py-2 text-[14px] font-noto-sans-jp text-[var(--text-primary,#323232)] hover:text-[#0F9058] hover:bg-[#F3FBF7] rounded-md'
                                    onClick={() => {
                                      setIsMenuOpen(false);
                                      setOpenDropdown(null);
                                    }}
                                  >
                                    {dropdownItem.label}
                                  </Link>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Link
                          href={item.href}
                          prefetch={item.prefetch}
                          className='flex items-center gap-2 px-3 py-2 text-[16px] font-noto-sans-jp font-bold text-[var(--text-primary,#323232)] hover:text-[#0F9058] hover:bg-[#F3FBF7] rounded-md'
                          onClick={closeMenuCallback}
                        >
                          <item.icon className='w-5 h-5' />
                          <span>{item.label}</span>
                        </Link>
                      )}
                    </div>
                  ))}

                  {/* モバイル用アカウント情報 */}
                  <div className='border-t border-gray-200 pt-2 mt-2'>
                    <button
                      onClick={() => toggleDropdown('account')}
                      className='w-full flex items-center justify-between px-3 py-2 text-[16px] font-noto-sans-jp font-bold text-[var(--text-primary,#323232)] hover:text-[#0F9058] hover:bg-[#F3FBF7] rounded-md'
                    >
                      <div className='flex items-center gap-2'>
                        <User className='w-5 h-5' />
                        <span>アカウント</span>
                      </div>
                      <DownIcon
                        className={cn(
                          'transform transition-transform',
                          openDropdown === 'account' && 'rotate-180'
                        )}
                      />
                    </button>
                    {openDropdown === 'account' && (
                      <div className='ml-6 mt-1 space-y-1'>
                        <Link
                          href='/candidate/setting'
                          className='block px-3 py-2 text-[14px] font-noto-sans-jp text-[var(--text-primary,#323232)] hover:text-[#0F9058] hover:bg-[#F3FBF7] rounded-md'
                          onClick={() => {
                            setIsMenuOpen(false);
                            setOpenDropdown(null);
                          }}
                        >
                          アカウント設定
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsMenuOpen(false);
                          }}
                          className='w-full text-left px-3 py-2 text-[14px] font-noto-sans-jp text-[var(--text-primary,#323232)] hover:text-[#0F9058] hover:bg-[#F3FBF7] rounded-md'
                        >
                          ログアウト
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>
        {/* プロフィール確認・編集モーダル */}
        <CandidateProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />
      </>
    );
  }
  // --- ここまで拡張 ---

  // variant に応じたCTAボタンの設定
  const getCTAButton = () => {
    // カスタムボタンが指定されていればそれを使用
    if (customCTAButton) {
      return customCTAButton;
    }

    switch (variant as string) {
      case 'company':
        return {
          href: '/company/auth/login',
          label: '企業ログイン',
        };
      case 'candidate':
        return {
          href: '/candidate/auth/login',
          label: '候補者ログイン',
        };
      default:
        return {
          href: '/signup',
          label: '資料請求',
        };
    }
  };

  const ctaButton = getCTAButton();

  // --- ここから全variant共通の「モバイルメニューが開いているときは白い画面だけを表示」 ---
  if (isMenuOpen) {
    return (
      <div
        className='lg:hidden fixed inset-0 bg-white z-50'
        onClick={closeMenuCallback}
        aria-label='メニューを閉じる'
      >
        {/* 画面全体を白く覆うだけ。クリックで閉じる。 */}
      </div>
    );
  }
  // --- ここまで追加 ---

  return (
    <header
      className={cn(
        'w-full border-b border-gray-200 navigation-header',
        variant === 'transparent' ? 'bg-transparent' : 'bg-white',
        className
      )}
      style={{ height: '80px' }}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div
          className='flex justify-between items-center navigation-container'
          style={{ height: '80px' }}
        >
          {/* Logo */}
          <div className='flex-shrink-0 flex items-center h-full'>
            <Logo className='w-[32px] h-auto md:w-[180px] md:h-[32px]' />
          </div>

          {/* Desktop Auth Buttons */}
          <div className='hidden lg:flex items-center'>
            <Button
              variant='green-gradient'
              size='lg'
              className='rounded-[32px] px-8 font-bold tracking-[0.1em] h-[60px] max-h-[60px] transition-all duration-200 ease-in-out hover:shadow-lg hover:scale-[1.02]'
              asChild
            >
              <Link
                href={ctaButton.href}
                prefetch={false}
                onClick={ctaButton.onClick}
              >
                {ctaButton.label}
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className='lg:hidden'>
            <Button
              variant='ghost'
              className='p-2'
              onClick={toggleMenuCallback}
              aria-label='メニューを開く'
            >
              {isMenuOpen ? <X className='h-6 w-6' /> : <HamburgerIcon />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div
            className='lg:hidden fixed inset-0 bg-white z-50'
            onClick={closeMenuCallback}
            aria-label='メニューを閉じる'
          >
            {/* 画面全体を白く覆うだけ。クリックで閉じる。 */}
          </div>
        )}
      </div>
    </header>
  );
}
