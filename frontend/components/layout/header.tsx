import Link from "next/link"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { MainNav } from "./main-nav"
import { MobileNav } from "./mobile-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "./user-nav"

export function Header() {
  const { theme } = useTheme()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Icons.logo className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">YoForex AI</span>
          </Link>
          <MainNav />
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Search bar can be added here */}
          </div>
          <nav className="flex items-center space-x-2">
            <ThemeToggle />
            <UserNav />
          </nav>
        </div>
      </div>
    </header>
  )
}
