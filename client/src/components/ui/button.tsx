// Button.tsx
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Safari でも確実に描画されるよう、
 * - すべての gradient 系 variant を `bg-[linear-gradient(...)]` へ置換
 * - hover 状態も同様に `hover:bg-[linear-gradient(...)]` で直指定
 * - CSS 変数ベースの色は fallback を併記（例: `var(--xxx,#fallback)`）
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-80 ' +
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 " +
    'outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] ' +
    'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
  {
    variants: {
      variant: {
        /* ───────── BASIC ───────── */
        default:
          'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
        
        primary:
          'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',

        destructive:
          'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',

        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',

        secondary:
          'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',

        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',

        link: 'text-primary underline-offset-4 hover:underline',

        /* ───────── GRADIENTS (Safari‑safe) ───────── */
        'green-gradient':
          'bg-[linear-gradient(to_right,#198D76,#1CA74F)] text-white font-bold tracking-[0.1em] shadow-[0px_5px_10px_0px_rgba(0,0,0,0.15)] ' +
          'hover:bg-[linear-gradient(to_right,#12614E,#1A8946)] focus-visible:ring-[#198D76]/30 transition-all duration-200 ease-in-out ' +
          'font-[family-name:var(--font-noto-sans-jp)]',

        'green-square':
          'bg-[linear-gradient(to_right,var(--green-gradient-start,#198D76),var(--green-gradient-end,#1CA74F))] text-white font-bold tracking-[0.1em] ' +
          'shadow-[var(--green-button-shadow,0px_5px_10px_rgba(0,0,0,0.15))] ' +
          'hover:bg-[linear-gradient(to_right,var(--green-gradient-hover-start,#12614E),var(--green-gradient-hover-end,#1A8946))] ' +
          'focus-visible:ring-[var(--green-gradient-start,#198D76)]/30 transition-all duration-200 ease-in-out ' +
          'font-[family-name:var(--font-noto-sans-jp)]',

        'blue-gradient':
          'bg-[linear-gradient(to_right,var(--blue-gradient-start,#0066FF),var(--blue-gradient-end,#00C3FF))] text-white font-bold tracking-[0.1em] ' +
          'shadow-[var(--blue-button-shadow,0px_5px_10px_rgba(0,0,0,0.15))] ' +
          'hover:bg-[linear-gradient(to_right,var(--blue-gradient-hover-start,#0052CC),var(--blue-gradient-hover-end,#0099CC))] ' +
          'focus-visible:ring-[var(--blue-gradient-start,#0066FF)]/30 transition-all duration-200 ease-in-out ' +
          'font-[family-name:var(--font-noto-sans-jp)]',

        'blue-outline':
          'border border-[var(--blue-outline-border,#0066FF)] bg-transparent text-[var(--blue-outline-text,#0066FF)] font-bold tracking-[0.1em] ' +
          'hover:bg-[var(--blue-outline-hover-bg,rgba(0,102,255,0.1))] focus-visible:ring-[var(--blue-outline-border,#0066FF)]/30 ' +
          'transition-all duration-200 ease-in-out font-[family-name:var(--font-noto-sans-jp)]',

        'yellow-gradient':
          'bg-[linear-gradient(to_right,var(--yellow-gradient-start,#FFD700),var(--yellow-gradient-end,#FFC300))] text-[var(--yellow-button-text,#4A3B00)] font-bold tracking-[0.1em] ' +
          'shadow-[var(--yellow-button-shadow,0px_5px_10px_rgba(0,0,0,0.15))] ' +
          'hover:bg-[linear-gradient(to_right,var(--yellow-gradient-hover-start,#CCAA00),var(--yellow-gradient-hover-end,#E0B800))] ' +
          'focus-visible:ring-[var(--yellow-gradient-start,#FFD700)]/30 transition-all duration-200 ease-in-out ' +
          'font-[family-name:var(--font-noto-sans-jp)] [&_svg]:text-[var(--yellow-button-icon,#4A3B00)]',

        'yellow-outline':
          'border border-[var(--yellow-outline-border,#FFC300)] bg-transparent text-[var(--yellow-outline-text,#4A3B00)] font-bold tracking-[0.1em] ' +
          'hover:bg-[var(--yellow-outline-hover-bg,rgba(255,195,0,0.1))] focus-visible:ring-[var(--yellow-outline-border,#FFC300)]/30 ' +
          'transition-all duration-200 ease-in-out font-[family-name:var(--font-noto-sans-jp)] [&_svg]:text-[var(--yellow-button-icon,#4A3B00)]',

        'white-outline-square':
          'border-2 border-[var(--white-outline-border,#FFFFFF)] bg-transparent text-[var(--white-outline-text,#FFFFFF)] font-bold tracking-[0.1em] ' +
          'hover:bg-[var(--white-outline-hover-bg,rgba(255,255,255,0.1))] focus-visible:ring-[var(--white-outline-border,#FFFFFF)]/30 ' +
          'transition-all duration-200 ease-in-out font-[family-name:var(--font-noto-sans-jp)] [&_svg]:text-[var(--white-outline-icon,#FFFFFF)] flex-col',

        /* ───────── SMALL / COMPACT ───────── */
        'small-green':
          'bg-[var(--small-button-bg,#198D76)] text-[var(--small-button-text,#FFFFFF)] font-bold tracking-[var(--small-button-letter-spacing,0.1em)] ' +
          'transition-all duration-200 ease-in-out font-[family-name:var(--font-noto-sans-jp)] text-[14px] ' +
          'leading-[var(--small-button-line-height,1.6)]',

        'green-outline':
          'border border-[var(--green-outline-border,#0f9058)] bg-transparent text-[var(--green-outline-text,#0f9058)] font-bold tracking-[0.1em] ' +
          'hover:bg-[var(--green-outline-hover-bg,rgba(15,144,88,0.2))] focus-visible:ring-[var(--green-outline-border,#0f9058)]/30 ' +
          'transition-all duration-200 ease-in-out font-[family-name:var(--font-noto-sans-jp)]',

        'small-green-outline':
          'border border-[var(--small-outline-border,#198D76)] bg-transparent text-[var(--small-outline-text,#198D76)] font-bold ' +
          'tracking-[var(--small-button-letter-spacing,0.1em)] hover:bg-[var(--small-outline-hover-bg,rgba(25,141,118,0.1))] ' +
          'focus-visible:ring-[var(--small-outline-border,#198D76)]/30 transition-all duration-200 ease-in-out ' +
          'font-[family-name:var(--font-noto-sans-jp)] text-[14px] leading-[var(--small-button-line-height,1.6)]',
      },

      /* ───────── SIZE VARIANTS ───────── */
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',

        /* Figma sizes */
        'figma-default': 'h-auto px-10 py-3.5 rounded-[32px] has-[>svg]:px-8',
        'figma-square':
          'h-auto px-10 py-3.5 rounded-[var(--green-button-square-radius,8px)] has-[>svg]:px-8',
        'figma-outline':
          'h-auto px-10 py-3.5 rounded-[var(--green-outline-radius,8px)] has-[>svg]:px-8',
        'figma-blue':
          'h-auto px-10 py-3.5 rounded-[var(--blue-button-radius,8px)] has-[>svg]:px-8',
        'figma-blue-outline':
          'h-auto px-10 py-3.5 rounded-[var(--blue-outline-radius,8px)] has-[>svg]:px-8',
        'figma-yellow':
          'h-auto px-10 py-3.5 rounded-[var(--yellow-button-radius,8px)] has-[>svg]:px-8 gap-2.5 [&_svg]:size-6',
        'figma-yellow-outline':
          'h-auto px-10 py-3.5 rounded-[var(--yellow-outline-radius,8px)] has-[>svg]:px-8 gap-2.5 [&_svg]:size-6',
        'figma-white-square':
          'h-auto p-3.5 rounded-[var(--white-outline-radius,8px)] gap-2.5 [&_svg]:size-6 min-w-[80px]',

        'figma-small':
          'h-auto px-[var(--small-button-padding-x,14px)] py-[var(--small-button-padding-y,6px)] rounded-[var(--small-button-radius,6px)]',

        'figma-small-outline':
          'h-auto px-[var(--small-button-padding-x,14px)] py-[var(--small-button-padding-y,6px)] rounded-[var(--small-outline-radius,6px)]',
      },
    },

    /* ───────── DEFAULTS ───────── */
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
