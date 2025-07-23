// Type declarations for components
declare module '@/components/navbar' {
  import { FC } from 'react';
  
  interface NavbarProps {
    onMenuClick?: () => void;
  }
  
  export const Navbar: FC<NavbarProps>;
}

declare module '@/components/sidebar' {
  import { FC } from 'react';
  
  export const Sidebar: FC;
}
