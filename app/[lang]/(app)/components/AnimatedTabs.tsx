'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface TabConfig {
 value: string;
 label: string;
 icon?: React.ComponentType<{ className?: string }>;
}

interface AnimatedTabsProps {
 tabs: TabConfig[];
 activeTab: string;
 onTabChange: (value: string) => void;
 disabled?: boolean;
 className?: string;
 activeBgColor?: string;
 activeTextColor?: string;
 inactiveBgColor?: string;
 inactiveTextColor?: string;
}

export function AnimatedTabs({
 tabs,
 activeTab,
 onTabChange,
 disabled = false,
 className,
 activeBgColor = 'bg-primary',
 activeTextColor = 'text-primary-foreground',
 inactiveBgColor = 'bg-muted',
 inactiveTextColor = 'text-muted-foreground',
}: AnimatedTabsProps) {
 return (
  <div
   className={cn(
    'w-full p-1 rounded-2xl flex border border-gray-700 dark:border-gray-300',
    inactiveBgColor,
    className,
   )}
  >
   {tabs.map((tab) => {
    const Icon = tab.icon;
    const isActive = tab.value === activeTab;

    return (
     <button
      key={tab.value}
      onClick={() => onTabChange(tab.value)}
      disabled={disabled}
      className={cn(
       'flex-1 relative py-2 px-4 rounded-2xl text-sm font-medium',
       'flex items-center justify-center gap-1.5 transition-all cursor-pointer',
       isActive
        ? activeTextColor
        : cn(inactiveTextColor, 'hover:text-foreground'),
       disabled && 'opacity-50 cursor-not-allowed',
      )}
     >
      {isActive && (
       <motion.div
        layoutId='activeTabBg'
        className={cn('absolute inset-0 rounded-2xl shadow-lg', activeBgColor)}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
       />
      )}

      <span className='relative z-10 flex items-center gap-1.5'>
       {Icon && <Icon className='w-4 h-4' />}
       {tab.label}
      </span>
     </button>
    );
   })}
  </div>
 );
}

interface AnimatedTabsWithContentProps extends AnimatedTabsProps {
 children: ReactNode;
 contentClassName?: string;
}

export function AnimatedTabsWithContent({
 children,
 contentClassName,
 ...tabsProps
}: AnimatedTabsWithContentProps) {
 return (
  <div className='w-full'>
   <AnimatedTabs {...tabsProps} />
   <div className={cn('mt-6', contentClassName)}>{children}</div>
  </div>
 );
}
