'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface AnimatedTabsProps<T> {
 tabs: T[];
 activeTab?: T;
 onTabChange?: (value: T) => void;
 getTabLabel: (value: T) => string;
 getTabId: (value: T) => string | number;
 disabled?: boolean;
 className?: string;
 activeBgColor?: string;
 activeTextColor?: string;
 inactiveBgColor?: string;
 inactiveTextColor?: string;
}

export function AnimatedTabs<T>({
 tabs,
 activeTab,
 onTabChange,
 getTabLabel,
 getTabId,
 disabled = false,
 className,
 activeBgColor = 'bg-primary',
 activeTextColor = 'text-primary-foreground',
 inactiveBgColor = 'bg-muted',
 inactiveTextColor = 'text-muted-foreground',
}: AnimatedTabsProps<T>) {
 return (
  <div
   className={cn(
    'w-full p-1 rounded-2xl flex border border-gray-700 dark:border-gray-300',
    inactiveBgColor,
    className,
   )}
  >
   {tabs.map((tab) => {
    const isActive = tab === activeTab;
    return (
     <button
      key={getTabId(tab)}
      onClick={() => onTabChange?.(tab)}
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
       {getTabLabel(tab)}
      </span>
     </button>
    );
   })}
  </div>
 );
}

interface AnimatedTabsWithContentProps<T> extends AnimatedTabsProps<T> {
 children: ReactNode;
 contentClassName?: string;
}

export function AnimatedTabsWithContent<T>({
 children,
 contentClassName,
 ...tabsProps
}: AnimatedTabsWithContentProps<T>) {
 return (
  <div className='w-full'>
   <AnimatedTabs {...tabsProps} />
   <div className={cn('mt-6', contentClassName)}>{children}</div>
  </div>
 );
}
