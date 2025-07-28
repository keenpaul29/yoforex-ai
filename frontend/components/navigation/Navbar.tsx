import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import Image from 'next/image';

interface NavItem {
  href: string;
  label: string;
  icon?: string;
}

const mainNavItems: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: 'dashboard',
  },
  {
    href: '/markets',
    label: 'Markets',
    icon: 'barChart',
  },
  {
    href: '/trading',
    label: 'Trading',
    icon: 'trending-up',
  },
  {
    href: '/portfolio',
    label: 'Portfolio',
    icon: 'briefcase',
  },
  {
    href: '/news',
    label: 'News',
    icon: 'newspaper',
  },
];

const Navbar = () => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <div className="relative h-8 w-8">
              <Image 
                src="/logo.svg" 
                alt="Logo" 
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="hidden font-bold sm:inline-block">YoForex AI</span>
          </Link>
          <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-foreground/60 transition-colors hover:text-foreground/80',
                  pathname === item.href && 'text-foreground'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Search bar can go here */}
          </div>
          <nav className="flex items-center space-x-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon">
              <span className="sr-only">Notifications</span>
              <div className="h-4 w-4">
                <Image
                  src="/icons/bell.svg"
                  alt="Notifications"
                  width={16}
                  height={16}
                  className="h-4 w-4"
                />
              </div>
            </Button>
            <Button variant="ghost" size="icon">
              <span className="sr-only">User menu</span>
              <div className="h-6 w-6 rounded-full bg-muted">
                <Image
                  src="/icons/user.svg"
                  alt="User"
                  width={24}
                  height={24}
                  className="h-6 w-6 rounded-full"
                />
              </div>
            </Button>
            <Button variant="outline" size="sm" className="ml-1 h-9">
              Sign In
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
