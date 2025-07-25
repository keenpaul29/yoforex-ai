import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

const mainNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Icons.dashboard,
  },
  {
    title: "Markets",
    href: "/markets",
    icon: Icons.market,
  },
  {
    title: "Analysis",
    href: "/analysis",
    icon: Icons.analysis,
  },
  {
    title: "Signals",
    href: "/signals",
    icon: Icons.bell,
  },
  {
    title: "Account",
    href: "/account",
    icon: Icons.user,
  },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {mainNavItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname?.startsWith(item.href)
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center text-sm font-medium transition-colors hover:text-primary",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Icon className="mr-2 h-4 w-4" />
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
}
