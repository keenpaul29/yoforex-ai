// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
}

// WebSocket Configuration
export const WS_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws',
  RECONNECT_INTERVAL: 5000, // 5 seconds
  MAX_RECONNECT_ATTEMPTS: 5,
}

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  ENABLE_MAINTENANCE: process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true',
  ENABLE_SOCIAL_LOGIN: process.env.NEXT_PUBLIC_ENABLE_SOCIAL_LOGIN === 'true',
}

// App Configuration
export const APP_CONFIG = {
  NAME: 'YoForex AI',
  VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  ENV: process.env.NODE_ENV || 'development',
  DEFAULT_LOCALE: 'en-US',
  DATE_FORMAT: 'MMM d, yyyy',
  DATE_TIME_FORMAT: 'MMM d, yyyy h:mm a',
  TIME_FORMAT: 'h:mm a',
  ITEMS_PER_PAGE: 10,
  MAX_UPLOAD_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORT_EMAIL: 'support@yeforexai.com',
}

// Market Data Configuration
export const MARKET_CONFIG = {
  REFRESH_INTERVAL: 10000, // 10 seconds
  DEFAULT_SYMBOL: 'EURUSD',
  DEFAULT_TIMEFRAME: '1h',
  SUPPORTED_TIMEFRAMES: ['1m', '5m', '15m', '1h', '4h', '1d', '1w', '1M'],
  SUPPORTED_PAIRS: [
    'EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD', 
    'USD/CHF', 'NZD/USD', 'EUR/GBP', 'EUR/JPY', 'GBP/JPY',
  ],
}

// Trading Configuration
export const TRADING_CONFIG = {
  DEFAULT_ACCOUNT_BALANCE: 10000,
  DEFAULT_LEVERAGE: 30,
  MAX_LEVERAGE: 500,
  MIN_POSITION_SIZE: 0.01, // 0.01 lots
  MAX_POSITION_SIZE: 100, // 100 lots
  MARGIN_CALL_LEVEL: 100, // 100% margin level
  STOP_OUT_LEVEL: 50, // 50% margin level
  COMMISSION_RATE: 0.0002, // 0.02% per lot
  SWAP_RATE: 0.0001, // 0.01% per lot per day
}

// UI Configuration
export const UI_CONFIG = {
  THEME: {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system',
  },
  DEFAULT_THEME: 'system',
  SIDEBAR_WIDTH: 240,
  HEADER_HEIGHT: 64,
  FOOTER_HEIGHT: 60,
  CONTAINER_PADDING: 24,
  BORDER_RADIUS: 8,
  BOX_SHADOW: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  TRANSITION: 'all 0.2s ease-in-out',
}

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'yoforex-theme',
  AUTH_TOKEN: 'yoforex-auth-token',
  REFRESH_TOKEN: 'yoforex-refresh-token',
  USER_PREFERENCES: 'yoforex-user-preferences',
  RECENT_PAIRS: 'yoforex-recent-pairs',
  CHART_SETTINGS: 'yoforex-chart-settings',
  LAYOUT_SETTINGS: 'yoforex-layout-settings',
}

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your internet connection and try again.',
  SERVER: 'Server error. Please try again later or contact support.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check your input and try again.',
  TIMEOUT: 'Request timed out. Please try again.',
  UNKNOWN: 'An unknown error occurred. Please try again.',
  MAINTENANCE: 'The application is currently under maintenance. Please try again later.',
  RATE_LIMIT: 'Too many requests. Please try again later.',
}

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Successfully logged in.',
  LOGOUT: 'Successfully logged out.',
  REGISTER: 'Account created successfully. Please check your email to verify your account.',
  PASSWORD_RESET: 'Password reset successful. You can now log in with your new password.',
  PASSWORD_UPDATE: 'Password updated successfully.',
  PROFILE_UPDATE: 'Profile updated successfully.',
  TRADE_OPEN: 'Trade opened successfully.',
  TRADE_CLOSE: 'Trade closed successfully.',
  DEPOSIT: 'Deposit successful. Your account balance will be updated shortly.',
  WITHDRAWAL: 'Withdrawal request submitted successfully.',
  SETTINGS_SAVE: 'Settings saved successfully.',
}

// Validation Messages
export const VALIDATION_MESSAGES = {
  REQUIRED: (field: string) => `${field} is required.`,
  INVALID_EMAIL: 'Please enter a valid email address.',
  PASSWORD_MIN_LENGTH: (length: number) => `Password must be at least ${length} characters.`,
  PASSWORD_MISMATCH: 'Passwords do not match.',
  INVALID_NUMBER: 'Please enter a valid number.',
  MIN_VALUE: (field: string, value: number) => `${field} must be at least ${value}.`,
  MAX_VALUE: (field: string, value: number) => `${field} cannot exceed ${value}.`,
  INVALID_DATE: 'Please enter a valid date.',
  INVALID_PHONE: 'Please enter a valid phone number.',
  INVALID_URL: 'Please enter a valid URL.',
  INVALID_FILE_TYPE: (types: string[]) => `File type not supported. Please upload a ${types.join(', ')} file.`,
  FILE_TOO_LARGE: (size: number) => `File is too large. Maximum size is ${size / 1024 / 1024}MB.`,
}

// SEO Configuration
export const SEO_CONFIG = {
  TITLE: 'YoForex AI - Advanced Forex Trading Platform',
  DESCRIPTION: 'Trade forex with confidence using AI-powered analysis, real-time market data, and advanced trading tools.',
  KEYWORDS: 'forex, trading, AI, currency, exchange, market, analysis, signals, platform',
  AUTHOR: 'YoForex AI Team',
  SITE_NAME: 'YoForex AI',
  SITE_URL: 'https://yeforexai.com',
  TWITTER_HANDLE: '@yeforexai',
  DEFAULT_IMAGE: '/images/og-image.jpg',
}

// Social Media Links
export const SOCIAL_LINKS = {
  TWITTER: 'https://twitter.com/yeforexai',
  FACEBOOK: 'https://facebook.com/yeforexai',
  LINKEDIN: 'https://linkedin.com/company/yeforexai',
  INSTAGRAM: 'https://instagram.com/yeforexai',
  YOUTUBE: 'https://youtube.com/@yeforexai',
  DISCORD: 'https://discord.gg/yeforexai',
  TELEGRAM: 'https://t.me/yeforexai',
  GITHUB: 'https://github.com/yeforexai',
  MEDIUM: 'https://medium.com/@yeforexai',
  REDDIT: 'https://reddit.com/r/yeforexai',
}

// Navigation Links
export const NAV_LINKS = [
  { name: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { name: 'Markets', href: '/markets', icon: 'BarChart3' },
  { name: 'Trading', href: '/trading', icon: 'TrendingUp' },
  { name: 'Portfolio', href: '/portfolio', icon: 'PieChart' },
  { name: 'Analysis', href: '/analysis', icon: 'LineChart' },
  { name: 'News', href: '/news', icon: 'Newspaper' },
  { name: 'Forum', href: '/forum', icon: 'MessageSquare' },
  { name: 'Calendar', href: '/calendar', icon: 'Calendar' },
  { name: 'Education', href: '/education', icon: 'GraduationCap' },
  { name: 'Settings', href: '/settings', icon: 'Settings' },
]

// Footer Links
export const FOOTER_LINKS = [
  {
    title: 'Company',
    links: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
      { name: 'Blog', href: '/blog' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Risk Disclosure', href: '/risk-disclosure' },
      { name: 'Cookie Policy', href: '/cookies' },
    ],
  },
  {
    title: 'Support',
    links: [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Status', href: '/status' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { name: 'API Documentation', href: '/api-docs' },
      { name: 'Trading Guides', href: '/guides' },
      { name: 'Market Research', href: '/research' },
      { name: 'Webinars', href: '/webinars' },
    ],
  },
]

// Exchange Rates (for demo purposes)
export const EXCHANGE_RATES = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 150.25,
  AUD: 1.52,
  CAD: 1.35,
  CHF: 0.89,
  CNY: 7.19,
  NZD: 1.63,
  SGD: 1.34,
  HKD: 7.82,
  INR: 83.12,
  KRW: 1334.56,
  MXN: 17.23,
  RUB: 90.45,
  ZAR: 18.92,
  BTC: 0.000022,
  ETH: 0.00034,
}

// Available Languages
export const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', rtl: true },
]
