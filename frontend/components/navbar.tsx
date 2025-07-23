'use client';

import { Menu, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  onMenuClick?: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden mr-2"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
          <div className="flex items-center">
            <span className="text-lg font-semibold text-foreground md:block hidden">
              YoForex AI
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground flex items-center"
            onClick={() => router.push('/dashboard/settings')}
          >
            <Settings className="h-4 w-4 mr-1.5" />
            <span className="hidden sm:inline">Settings</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground flex items-center"
            onClick={() => router.push('/api/auth/signout')}
          >
            <LogOut className="h-4 w-4 mr-1.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
