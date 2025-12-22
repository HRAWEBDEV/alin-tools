import {
 Coffee,
 HousePlus,
 Wine,
 Utensils,
 WashingMachine,
 Sparkles,
 UtensilsCrossed,
} from 'lucide-react';
import { nanoid } from 'nanoid';
import { Button } from '@/components/ui/button';
import { handleAddInfoStore } from '../utils/UserInfoStorageService';
import { useUserInfoRouter } from '../UserInfoRouterContext';
import type { UserCleanInfo } from '../userInfoApiActions';
import { motion } from 'motion/react';

type DepartmentItem = UserCleanInfo['departments'][number];
type Program = DepartmentItem['programs'][number];

interface ProgramIconConfig {
 icon: React.ReactNode;
 bgColor: string;
 iconColor: string;
 iconFill?: string;
}

interface DepartmentIconConfig {
 name: string;
 icon: React.ReactNode;
 bgColor: string;
 iconColor: string;
}

function departmentIconMapper(item: DepartmentItem): DepartmentIconConfig {
 if (item.id === '4') {
  return {
   name: item.name,
   icon: <Coffee className='size-14' />,
   bgColor: 'bg-amber-50 dark:bg-amber-950',
   iconColor: 'text-amber-800 dark:text-amber-200',
  };
 }

 if (item.id === '3') {
  return {
   name: item.name,
   icon: <HousePlus className='size-14' />,
   bgColor: 'bg-indigo-50 dark:bg-indigo-950',
   iconColor: 'text-indigo-800 dark:text-indigo-200',
  };
 }

 return {
  name: item.name,
  icon: <UtensilsCrossed className='size-14' />,
  bgColor: 'bg-gray-50 dark:bg-gray-950',
  iconColor: 'text-gray-800 dark:text-gray-200',
 };
}

function programIconMapper(program: Program): ProgramIconConfig {
 if (program.systemTypeID === 3) {
  return {
   icon: <Wine className='size-14' />,
   bgColor: 'bg-amber-50 dark:bg-amber-950',
   iconColor: 'text-amber-800 dark:text-amber-200',
  };
 }

 if (program.systemTypeID === 1) {
  return {
   icon: <Coffee className='size-14' />,
   bgColor: 'bg-orange-50 dark:bg-orange-950',
   iconColor: 'text-orange-800 dark:text-orange-200',
  };
 }

 if (program.systemTypeID === 6) {
  return {
   icon: <WashingMachine className='size-14' />,
   bgColor: 'bg-blue-50 dark:bg-blue-950',
   iconColor: 'text-blue-800 dark:text-blue-200',
  };
 }

 if (program.systemRouteMap === 'Housekeeping') {
  return {
   icon: <Sparkles className='size-14' />,
   bgColor: 'bg-cyan-50 dark:bg-cyan-950',
   iconColor: 'text-cyan-800 dark:text-cyan-200',
  };
 }

 if (program.systemRouteMap === 'Restaurant') {
  return {
   icon: <Utensils className='size-14' />,
   bgColor: 'bg-rose-50 dark:bg-rose-950',
   iconColor: 'text-rose-800 dark:text-rose-200',
  };
 }

 return {
  icon: <UtensilsCrossed className='size-14' />,
  bgColor: 'bg-gray-50 dark:bg-gray-950',
  iconColor: 'text-gray-800 dark:text-gray-200',
 };
}

export default function DepartmentSections({
 item,
 index,
}: {
 item: DepartmentItem;
 index: number;
}) {
 const itemObj = departmentIconMapper(item);
 const {
  setIsOpen,
  currentStep,
  setCurrentStep,
  selectedDepartmentID,
  setSelectedDepartmentID,
 } = useUserInfoRouter();
 const animationDelay = index * 0.15;
 return (
  <>
   {currentStep === 1 && (
    <motion.div
     initial={{ opacity: 0, scale: 0.8, x: '-100%' }}
     animate={{ opacity: 1, scale: 1, x: 0 }}
     exit={{ opacity: 0, scale: 0, x: '-100%' }}
     transition={{ duration: 0.3, delay: animationDelay }}
     className='mx-auto'
    >
     <Button
      variant='outline'
      className={`h-auto w-auto flex-col size-48  ${itemObj.bgColor} ${itemObj.iconColor}`}
      onClick={() => {
       setSelectedDepartmentID(Number(item.id));
       setCurrentStep(2);
      }}
     >
      <div className='flex flex-col items-center'>
       {itemObj.icon}
       <span className='text-base font-medium'>{itemObj.name}</span>
      </div>
     </Button>
    </motion.div>
   )}
   {currentStep === 2 && selectedDepartmentID === Number(item.id) && (
    <motion.div
     initial={{ opacity: 0, scale: 0.8, x: '-100%' }}
     animate={{ opacity: 1, scale: 1, x: 0 }}
     exit={{ opacity: 0, scale: 0, x: '-100%' }}
     transition={{ duration: 0.3, delay: animationDelay }}
     className='rounded-2xl p-4 flex flex-wrap gap-4'
    >
     {item.programs.map((program) => {
      const programConfig = programIconMapper(program);
      return (
       <Button
        variant='outline'
        className={`h-auto w-auto flex-col size-48 max-h-none ${programConfig.bgColor} ${programConfig.iconColor}`}
        key={nanoid()}
        onClick={() => {
         handleAddInfoStore(program);
         setIsOpen(false);
        }}
       >
        <div className='flex flex-col items-center'>
         {programConfig.icon}
         <span className='text-base font-medium'>{program.name}</span>
        </div>
       </Button>
      );
     })}
    </motion.div>
   )}
  </>
 );
}
