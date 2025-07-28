'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background relative overflow-hidden group',
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-r from-primary to-primary/90 text-white hover:from-primary hover:to-primary/80 hover:shadow-lg hover:shadow-primary/30',
        destructive: 'bg-gradient-to-r from-destructive to-destructive/90 text-white hover:from-destructive hover:to-destructive/80 hover:shadow-lg hover:shadow-destructive/30',
        outline: 'border-2 border-border/30 bg-transparent hover:bg-accent/70 hover:border-primary/50 text-foreground',
        secondary: 'bg-gradient-to-r from-secondary to-secondary/90 text-white hover:from-secondary hover:to-secondary/80 hover:shadow-lg hover:shadow-secondary/30',
        ghost: 'hover:bg-accent/70 hover:text-accent-foreground text-foreground',
        link: 'text-primary underline-offset-4 hover:underline bg-transparent p-0 h-auto',
        gradient: 'bg-gradient-to-r from-primary via-secondary to-accent text-white hover:shadow-lg hover:shadow-primary/30',
        glass: 'backdrop-blur-sm bg-white/20 border border-white/30 hover:bg-white/30 hover:border-white/40 text-white',
      },
      size: {
        default: 'h-11 px-6 py-2.5',
        sm: 'h-9 px-4 text-xs rounded-lg',
        lg: 'h-12 px-8 text-base rounded-xl',
        xl: 'h-14 px-10 text-lg rounded-2xl',
        icon: 'h-10 w-10 rounded-xl',
      },
      fullWidth: {
        true: 'w-full',
      },
      rounded: {
        full: 'rounded-full',
      },
    },
    compoundVariants: [
      {
        variant: ['gradient', 'glass'],
        className: 'hover:translate-y-[-2px] transform transition-transform',
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  rounded?: 'full';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant,
    size,
    asChild = false,
    isLoading = false,
    leftIcon,
    rightIcon,
    children,
    disabled,
    fullWidth,
    rounded,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : 'button';
    
    const buttonContent = (
      <>
        {isLoading && (
          <Loader2 className={cn(
            'h-4 w-4 animate-spin',
            children ? 'mr-2' : ''
          )} />
        )}
        {!isLoading && leftIcon && (
          <span className="mr-2">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && (
          <span className="ml-2">{rightIcon}</span>
        )}
        
        {/* Animated border effect */}
        {!asChild && variant === 'outline' && (
          <span className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-primary/20 transition-all duration-500 pointer-events-none" />
        )}
        
        {/* Ripple effect */}
        {!asChild && (
          <span className="absolute inset-0 overflow-hidden">
            <span className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </span>
        )}
      </>
    );

    if (asChild) {
      return (
        <div className={cn('inline-block', fullWidth && 'w-full', 'hover:scale-[1.02] active:scale-[0.98] transition-transform')}>
          {React.cloneElement(children as React.ReactElement, {
            className: cn(
              buttonVariants({
                variant,
                size,
                className,
                fullWidth,
                rounded,
              }),
              (children as React.ReactElement)?.props?.className
            ),
            ref,
            disabled: isLoading || disabled,
            ...props
          })}
        </div>
      );
    }

    return (
      <div className={cn('inline-block', fullWidth && 'w-full', 'hover:scale-[1.02] active:scale-[0.98] transition-transform')}>
        <Comp
          className={cn(
            buttonVariants({
              variant,
              size,
              className,
              fullWidth,
              rounded,
            })
          )}
          ref={ref}
          disabled={isLoading || disabled}
          {...props}
        >
          {buttonContent}
        </Comp>
      </div>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };