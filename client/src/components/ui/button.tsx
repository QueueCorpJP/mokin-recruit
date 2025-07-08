import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
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
        'green-gradient':
          'bg-gradient-to-r from-[#198D76] to-[#1CA74F] text-white font-bold tracking-[0.1em] shadow-[0px_5px_10px_0px_rgba(0,0,0,0.15)] hover:from-[#12614E] hover:to-[#1A8946] focus-visible:ring-[#198D76]/30 transition-all duration-200 ease-in-out font-[family-name:var(--font-noto-sans-jp)]',
        'green-square':
          'bg-gradient-to-r from-[var(--green-gradient-start)] to-[var(--green-gradient-end)] text-white font-bold tracking-[0.1em] shadow-[var(--green-button-shadow)] hover:from-[var(--green-gradient-hover-start)] hover:to-[var(--green-gradient-hover-end)] focus-visible:ring-[var(--green-gradient-start)]/30 transition-all duration-200 ease-in-out font-[family-name:var(--font-noto-sans-jp)]',
        'green-outline':
          'border border-[var(--green-outline-border)] bg-transparent text-[var(--green-outline-text)] font-bold tracking-[0.1em] hover:bg-[var(--green-outline-hover-bg)] focus-visible:ring-[var(--green-outline-border)]/30 transition-all duration-200 ease-in-out font-[family-name:var(--font-noto-sans-jp)]',
        'blue-gradient':
          'bg-gradient-to-r from-[var(--blue-gradient-start)] to-[var(--blue-gradient-end)] text-white font-bold tracking-[0.1em] shadow-[var(--blue-button-shadow)] hover:from-[var(--blue-gradient-hover-start)] hover:to-[var(--blue-gradient-hover-end)] focus-visible:ring-[var(--blue-gradient-start)]/30 transition-all duration-200 ease-in-out font-[family-name:var(--font-noto-sans-jp)]',
        'blue-outline':
          'border border-[var(--blue-outline-border)] bg-transparent text-[var(--blue-outline-text)] font-bold tracking-[0.1em] hover:bg-[var(--blue-outline-hover-bg)] focus-visible:ring-[var(--blue-outline-border)]/30 transition-all duration-200 ease-in-out font-[family-name:var(--font-noto-sans-jp)]',
        'yellow-gradient':
          'bg-gradient-to-r from-[var(--yellow-gradient-start)] to-[var(--yellow-gradient-end)] text-[var(--yellow-button-text)] font-bold tracking-[0.1em] shadow-[var(--yellow-button-shadow)] hover:from-[var(--yellow-gradient-hover-start)] hover:to-[var(--yellow-gradient-hover-end)] focus-visible:ring-[var(--yellow-gradient-start)]/30 transition-all duration-200 ease-in-out font-[family-name:var(--font-noto-sans-jp)] [&_svg]:text-[var(--yellow-button-icon)]',
        'yellow-outline':
          'border border-[var(--yellow-outline-border)] bg-transparent text-[var(--yellow-outline-text)] font-bold tracking-[0.1em] hover:bg-[var(--yellow-outline-hover-bg)] focus-visible:ring-[var(--yellow-outline-border)]/30 transition-all duration-200 ease-in-out font-[family-name:var(--font-noto-sans-jp)] [&_svg]:text-[var(--yellow-button-icon)]',
        'white-outline-square':
          'border-2 border-[var(--white-outline-border)] bg-transparent text-[var(--white-outline-text)] font-bold tracking-[0.1em] hover:bg-[var(--white-outline-hover-bg)] focus-visible:ring-[var(--white-outline-border)]/30 transition-all duration-200 ease-in-out font-[family-name:var(--font-noto-sans-jp)] [&_svg]:text-[var(--white-outline-icon)] flex-col',
        'small-green':
          'bg-[var(--small-button-bg)] text-[var(--small-button-text)] font-bold tracking-[var(--small-button-letter-spacing)] transition-all duration-200 ease-in-out font-[family-name:var(--font-noto-sans-jp)] text-[14px] leading-[var(--small-button-line-height)]',
        'small-green-outline':
          'border border-[var(--small-outline-border)] bg-transparent text-[var(--small-outline-text)] font-bold tracking-[var(--small-button-letter-spacing)] hover:bg-[var(--small-outline-hover-bg)] focus-visible:ring-[var(--small-outline-border)]/30 transition-all duration-200 ease-in-out font-[family-name:var(--font-noto-sans-jp)] text-[14px] leading-[var(--small-button-line-height)]',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
        'figma-default': 'h-auto px-10 py-3.5 rounded-[32px] has-[>svg]:px-8',
        'figma-square':
          'h-auto px-10 py-3.5 rounded-[var(--green-button-square-radius)] has-[>svg]:px-8',
        'figma-outline':
          'h-auto px-10 py-3.5 rounded-[var(--green-outline-radius)] has-[>svg]:px-8',
        'figma-blue':
          'h-auto px-10 py-3.5 rounded-[var(--blue-button-radius)] has-[>svg]:px-8',
        'figma-blue-outline':
          'h-auto px-10 py-3.5 rounded-[var(--blue-outline-radius)] has-[>svg]:px-8',
        'figma-yellow':
          'h-auto px-10 py-3.5 rounded-[var(--yellow-button-radius)] has-[>svg]:px-8 gap-2.5 [&_svg]:size-6',
        'figma-yellow-outline':
          'h-auto px-10 py-3.5 rounded-[var(--yellow-outline-radius)] has-[>svg]:px-8 gap-2.5 [&_svg]:size-6',
        'figma-white-square':
          'h-auto p-3.5 rounded-[var(--white-outline-radius)] gap-2.5 [&_svg]:size-6 min-w-[80px]',
        'figma-small':
          'h-auto px-[var(--small-button-padding-x)] py-[var(--small-button-padding-y)] rounded-[var(--small-button-radius)]',
        'figma-small-outline':
          'h-auto px-[var(--small-button-padding-x)] py-[var(--small-button-padding-y)] rounded-[var(--small-outline-radius)]',
      },
    },
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
      data-slot='button'
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
