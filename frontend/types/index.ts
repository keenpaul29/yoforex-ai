export interface NavItem {
  href: string;
  label: string;
  icon?: string;
  title?: string; // For backward compatibility
}

export interface MainNavItem extends NavItem {
  title: string;
  icon: string;
}

export interface SiteConfig {
  name: string;
  description: string;
  mainNav: MainNavItem[];
  links: {
    twitter: string;
    github: string;
    docs: string;
  };
}
