// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { cn } from '@/lib/utils';
// import {
//   BarChart3,
//   TrendingUp,
//   Zap,
//   Brain,
//   Activity,
//   Bell,
//   History,
//   BookOpen,
//   GraduationCap,
//   Users,
//   HelpCircle,
//   Settings,
//   LifeBuoy,
//   ChevronLeft,
//   ChevronRight,
// } from 'lucide-react';

// const navigation = [
//   { name: 'Dashboard', href: '/', icon: BarChart3 },
//   { name: 'Swing Trading', href: '/swing', icon: TrendingUp },
//   { name: 'Scalp Trading', href: '/scalp', icon: Zap },
//   // { name: 'AI Analysis', href: '/analysis', icon: Brain },
//   // { name: 'Active Trades', href: '/active-trades', icon: Activity },
//   // { name: 'Alerts', href: '/alerts', icon: Bell },
//   { name: 'Trade History', href: '/history', icon: History },
//   // { name: 'Trade Journal', href: '/journal', icon: BookOpen },
//   // { name: 'Learning Center', href: '/learning', icon: GraduationCap },
//   // { name: 'Creator Hub', href: '/creator-hub', icon: Users },
//   // { name: 'Support', href: '/support', icon: HelpCircle },
// ];

// // const bottomNavigation = [
// //   { name: 'Settings', href: '/settings', icon: Settings },
// //   { name: 'Support', href: '/support', icon: LifeBuoy },
// // ];

// export function Sidebar() {
//   const [collapsed, setCollapsed] = useState(false);
//   const pathname = usePathname();

//   return (
//     <div className={cn(
//       "bg-slate-900/50 border-r border-slate-800 flex flex-col h-full transition-all duration-300",
//       collapsed ? "w-16" : "w-64"
//     )}>
//       {/* Logo and Collapse Button */}
//       <div className="flex items-center justify-between p-4 border-b border-slate-800">
//         {!collapsed && (
//           <div className="flex items-center space-x-2">
//             <div className="flex items-center space-x-2">
//               <BarChart3 className="h-6 w-6 text-blue-500" />
//               <span className="text-lg font-bold text-white">YoForex AI</span>
//             </div>
//           </div>
//         )}
//         <button
//           onClick={() => setCollapsed(!collapsed)}
//           className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
//         >
//           {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
//         </button>
//       </div>

//       {/* Main Navigation */}
//       <nav className="flex-1 px-2 py-4 space-y-1">
//         {navigation.map((item) => {
//           const isActive = pathname === item.href;
//           return (
//             <Link
//               key={item.name}
//               href={item.href}
//               className={cn(
//                 "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors group",
//                 isActive
//                   ? "bg-blue-600 text-white"
//                   : "text-slate-300 hover:bg-slate-800 hover:text-white"
//               )}
//             >
//               <item.icon className={cn("h-4 w-4 flex-shrink-0", collapsed ? "mr-0" : "mr-3")} />
//               {!collapsed && <span>{item.name}</span>}
//               {collapsed && (
//                 <div className="absolute left-16 ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
//                   {item.name}
//                 </div>
//               )}
//             </Link>
//           );
//         })}
//       </nav>

//       {/* Bottom Navigation */}
//       {/* <div className="px-2 py-4 border-t border-slate-800 space-y-1">
//         {bottomNavigation.map((item) => {
//           const isActive = pathname === item.href;
//           return (
//             <Link
//               key={item.name}
//               href={item.href}
//               className={cn(
//                 "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors group",
//                 isActive
//                   ? "bg-blue-600 text-white"
//                   : "text-slate-300 hover:bg-slate-800 hover:text-white"
//               )}
//             >
//               <item.icon className={cn("h-4 w-4 flex-shrink-0", collapsed ? "mr-0" : "mr-3")} />
//               {!collapsed && <span>{item.name}</span>}
//               {collapsed && (
//                 <div className="absolute left-16 ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
//                   {item.name}
//                 </div>
//               )}
//             </Link>
//           );
//         })}
//       </div> */}
//     </div>
//   );
// }









































































'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  TrendingUp,
  Zap,
  History,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: BarChart3 },
  { name: 'Swing Trading', href: '/swing', icon: TrendingUp },
  { name: 'Scalp Trading', href: '/scalp', icon: Zap },
  { name: 'Trade History', href: '/history', icon: History },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Detect screen size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1100);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  return (
    <>
      {/* Mobile Topbar */}
      {/* {isMobile && (
        <div className="flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 lg:hidden">
          <div className="text-white text-lg font-bold">YoForex AI</div>
          <button onClick={() => setDrawerOpen(true)} className="text-white">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      )} */}

      {isMobile && (
        <div className="py-4 ml-4 fixed flex justify-center items-center gap-[1.2rem] z-50 p-2 rounded-md text-white shadow-md">
          <button onClick={() => setDrawerOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-blue-500" />
            <span className="ml-2 text-lg font-bold text-white">YoForex AI</span>
          </div>
        </div>
      )}


      {/* Overlay on mobile */}
      {isMobile && drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Sidebar Drawer on Mobile OR Sticky Sidebar on Desktop */}
      <div
        className={cn(
          'h-full z-50 transition-all duration-300 bg-slate-900 border-r border-slate-800',
          collapsed ? 'w-16' : 'w-64',
          isMobile
            ? `fixed top-0 left-0 ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`
            : 'sticky top-0'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-6 w-6 text-blue-500" />
              <span className="text-lg font-bold text-white">YoForex AI</span>
            </div>
          )}
          <div className="flex space-x-2 items-center">
            {!isMobile && <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>}
            {isMobile && (
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors group relative',
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                )}
              >
                <item.icon className={cn('h-4 w-4 flex-shrink-0', collapsed ? 'mr-0' : 'mr-3')} />
                {!collapsed && <span>{item.name}</span>}
                {collapsed && (
                  <div className="absolute left-16 ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;