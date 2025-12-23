import { Button } from '@/components/ui/button';
import { useUserInfoRouter } from '../UserInfoRouterContext';
import type { UserCleanInfo } from '../userInfoApiActions';
import { motion } from 'motion/react';
import { departmentIconMapper } from '../utils/iconMappers';

type DepartmentItem = UserCleanInfo['departments'][number];

export default function DepartmentSections({
 item,
 index,
}: {
 item: DepartmentItem;
 index: number;
}) {
 const itemObj = departmentIconMapper(item);
 const {
  currentStep,
  setCurrentStep,
  selectedDepartmentID,
  setSelectedDepartmentID,
 } = useUserInfoRouter();
 const animationDelay = index * 0.15;
 const isSelected = selectedDepartmentID === Number(item.id);

 return (
  <motion.div
   layoutId={`department-${item.id}`}
   initial={{ opacity: 0, scale: 0.8, x: '-100%' }}
   animate={
    currentStep === 2
     ? { opacity: 1, scale: 1, x: 0, height: '5rem' }
     : { opacity: 1, scale: 1, x: 0, height: '12rem' }
   }
   exit={{ opacity: 0, scale: 0, x: '-100%' }}
   transition={{ duration: 0.3, delay: currentStep === 1 ? animationDelay : 0 }}
   style={{ width: '12rem' }}
  >
   <Button
    variant='outline'
    className={`w-full h-full flex-col overflow-hidden ${itemObj.bgColor} ${
     itemObj.iconColor
    } ${currentStep === 2 && isSelected ? 'ring-2 ring-primary' : ''}`}
    onClick={() => {
     setSelectedDepartmentID(Number(item.id));
     setCurrentStep(2);
    }}
   >
    <div className='flex flex-col items-center'>
     <motion.div
      animate={currentStep === 2 ? { scale: 0.7 } : { scale: 1 }}
      transition={{ duration: 0.2 }}
     >
      {itemObj.icon}
     </motion.div>
     <motion.span
      initial={{ opacity: 1, height: 'auto' }}
      animate={
       currentStep === 2
        ? { opacity: 0, height: 0, marginTop: 0 }
        : { opacity: 1, height: 'auto', marginTop: 8 }
      }
      transition={{ duration: 0.2 }}
      className='text-base font-medium overflow-hidden'
     >
      {itemObj.name}
     </motion.span>
    </div>
   </Button>
  </motion.div>
 );
}
