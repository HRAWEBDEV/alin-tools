import { motion } from 'motion/react';
import { useUserInfoRouter } from '../UserInfoRouterContext';
import { Button } from '@/components/ui/button';
import { programIconMapper } from '../utils/iconMappers';
import { handleAddInfoStore } from '../utils/UserInfoStorageService';
import { UserCleanInfo } from '../userInfoApiActions';

type DepartmentItem = UserCleanInfo['departments'][number];
type Program = DepartmentItem['programs'][number];

export function ProgramCards({ programs }: { programs: Program[] }) {
 const { setIsOpen } = useUserInfoRouter();

 return (
  <motion.div
   initial={{ opacity: 0, y: 20 }}
   animate={{ opacity: 1, y: 0 }}
   exit={{ opacity: 0, y: 20 }}
   transition={{ duration: 0.3 }}
   className='flex justify-evenly flex-wrap gap-4 p-4'
  >
   {programs.map((program) => {
    const programConfig = programIconMapper(program);
    return (
     <Button
      variant='outline'
      className={`h-auto w-auto flex-col size-48 max-h-none ${programConfig.bgColor} ${programConfig.iconColor}`}
      key={program.id}
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
 );
}
