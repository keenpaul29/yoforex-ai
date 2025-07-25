import Link from "next/link"
import { Icons } from "@/components/icons"

export function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Icons.logo className="h-6 w-6" />
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {currentYear} YoForex AI. All rights reserved.
          </p>
        </div>
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-6 md:px-0">
          <Link
            href="/terms"
            className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground"
          >
            Terms
          </Link>
          <Link
            href="/privacy"
            className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground"
          >
            Privacy
          </Link>
          <Link
            href="/contact"
            className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  )
}
