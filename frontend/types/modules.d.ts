declare module '@/components/icons' {
  import { SVGProps } from 'react'
  
  type Icon = (props: SVGProps<SVGSVGElement>) => JSX.Element
  
  export const Icons: {
    [key: string]: Icon
    logo: Icon
    chart: Icon
    market: Icon
    analysis: Icon
    trades: Icon
    forum: Icon
    user: Icon
    settings: Icon
    bell: Icon
    search: Icon
    chevronDown: Icon
    chevronRight: Icon
    chevronLeft: Icon
    plus: Icon
    moreHorizontal: Icon
    arrowUp: Icon
    arrowDown: Icon
    externalLink: Icon
    menu: Icon
    close: Icon
    check: Icon
    alertCircle: Icon
    info: Icon
    logout: Icon
    spinner: Icon
    refreshCw: Icon
    barChart2: Icon
    lineChart: Icon
    trendingUp: Icon
  }
}

declare module '@/components/theme-toggle' {
  import { FC } from 'react'
  
  export const ThemeToggle: FC
}

declare module '@/components/ui/button' {
  import { ButtonHTMLAttributes, ForwardRefExoticComponent, RefAttributes } from 'react'
  
  interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
    size?: 'default' | 'sm' | 'lg' | 'icon'
    asChild?: boolean
  }
  
  export const Button: ForwardRefExoticComponent<
    ButtonProps & RefAttributes<HTMLButtonElement>
  >
  
  export const buttonVariants: (props: {
    variant?: ButtonProps['variant']
    size?: ButtonProps['size']
    className?: string
  }) => string
}

declare module '@/components/ui/dropdown-menu' {
  import { FC, ReactNode } from 'react'
  
  interface DropdownMenuProps {
    children: ReactNode
  }
  
  interface DropdownMenuTriggerProps {
    children: ReactNode
    asChild?: boolean
  }
  
  interface DropdownMenuContentProps {
    children: ReactNode
    className?: string
    sideOffset?: number
  }
  
  interface DropdownMenuItemProps {
    children: ReactNode
    className?: string
    onSelect?: () => void
    disabled?: boolean
  }
  
  export const DropdownMenu: FC<DropdownMenuProps>
  export const DropdownMenuTrigger: FC<DropdownMenuTriggerProps>
  export const DropdownMenuContent: FC<DropdownMenuContentProps>
  export const DropdownMenuItem: FC<DropdownMenuItemProps>
  export const DropdownMenuLabel: FC<{ children: ReactNode }>
  export const DropdownMenuSeparator: FC<{ className?: string }>
  export const DropdownMenuGroup: FC<{ children: ReactNode }>
  export const DropdownMenuPortal: FC<{ children: ReactNode }>
  export const DropdownMenuSub: FC<{ children: ReactNode }>
  export const DropdownMenuSubContent: FC<{ children: ReactNode, className?: string }>
  export const DropdownMenuSubTrigger: FC<{ children: ReactNode, className?: string }>
  export const DropdownMenuRadioGroup: FC<{ children: ReactNode }>
}
