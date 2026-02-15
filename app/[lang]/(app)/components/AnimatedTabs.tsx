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
}

export function AnimatedTabs({
 tabs,
 activeTab,
 onTabChange,
 disabled = false,
 className,
}: AnimatedTabsProps) {
 return (
  <div className={cn('w-full p-1 bg-muted rounded-3xl flex', className)}>
   {tabs.map((tab) => {
    const Icon = tab.icon;
    const isActive = tab.value === activeTab;

    return (
     <button
      key={tab.value}
      onClick={() => onTabChange(tab.value)}
      disabled={disabled}
      className={cn(
       'flex-1 relative py-2.5 px-4 rounded-3xl text-sm font-medium',
       'flex items-center justify-center gap-1.5 transition-all cursor-pointer',
       isActive
        ? 'text-primary-foreground'
        : 'text-muted-foreground hover:text-foreground',
       disabled && 'opacity-50 cursor-not-allowed',
      )}
     >
      {isActive && (
       <motion.div
        layoutId='activeTabBg'
        className='absolute inset-0 bg-primary rounded-3xl shadow-lg'
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
