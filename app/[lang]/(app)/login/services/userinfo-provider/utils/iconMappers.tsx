import {
 Coffee,
 HousePlus,
 Sparkles,
 Utensils,
 UtensilsCrossed,
 WashingMachine,
 Wine,
} from 'lucide-react';
import DishIcon from '@/app/[lang]/(app)/components/icons/DishIcon';
import type { UserCleanInfo } from '../userInfoApiActions';

interface ProgramIconConfig {
 icon: React.ReactNode;
 bgColor: string;
 iconColor: string;
}

interface DepartmentIconConfig {
 name: string;
 icon: React.ReactNode;
 bgColor: string;
 iconColor: string;
}
type Program = DepartmentItem['programs'][number];
type DepartmentItem = UserCleanInfo['departments'][number];

export function departmentIconMapper(
 item: DepartmentItem
): DepartmentIconConfig {
 if (item.id === '4') {
  return {
   name: item.name,
   icon: <DishIcon className='size-14 text-sidebar-primary' />,
   bgColor: 'bg-secondary/80 dark:bg-secondary/80!',
   iconColor: 'text-sidebar-primary',
  };
 }

 if (item.id === '3') {
  return {
   name: item.name,
   icon: <HousePlus className='size-14' />,
   bgColor: 'bg-blue-100 dark:bg-blue-900/50',
   iconColor: 'text-primary',
  };
 }

 return {
  name: item.name,
  icon: <UtensilsCrossed className='size-14' />,
  bgColor: 'bg-muted',
  iconColor: 'text-muted-foreground',
 };
}

export function programIconMapper(program: Program): ProgramIconConfig {
 if (program.systemTypeID === 3) {
  return {
   icon: <Wine className='size-14' />,
   bgColor: 'bg-blue-100 dark:bg-blue-900/50',
   iconColor: 'text-primary',
  };
 }

 if (program.systemTypeID === 1) {
  return {
   icon: <Coffee className='size-14' />,
   bgColor: 'bg-teal-100 dark:bg-teal-900/50',
   iconColor: 'text-secondary',
  };
 }

 if (program.systemTypeID === 6) {
  return {
   icon: <WashingMachine className='size-14' />,
   bgColor: 'bg-gray-100 dark:bg-gray-800/50',
   iconColor: 'text-accent-foreground',
  };
 }

 if (program.systemRouteMap === 'Housekeeping') {
  return {
   icon: <Sparkles className='size-14' />,
   bgColor: 'bg-teal-100 dark:bg-teal-900/50',
   iconColor: 'text-secondary',
  };
 }

 if (program.systemRouteMap === 'Restaurant') {
  return {
   icon: <Utensils className='size-14' />,
   bgColor: 'bg-primary-300 dark:bg-primary-900/50',
   iconColor: 'text-chart-1',
  };
 }

 return {
  icon: <UtensilsCrossed className='size-14' />,
  bgColor: 'bg-muted',
  iconColor: 'text-muted-foreground',
 };
}
