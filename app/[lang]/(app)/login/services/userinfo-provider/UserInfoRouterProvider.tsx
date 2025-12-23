'use client';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { useEffect, useEffectEvent, useState } from 'react';
import { CornerUpRight, Hotel } from 'lucide-react';
import {
 userInfoRouterContext,
 type UserInfoStore,
} from './UserInfoRouterContext';
import { userInfoBaseKey, getApiUserInfo } from './userInfoApiActions';
import { useQuery } from '@tanstack/react-query';
import Loading from '@/components/Loading';
import DepartmentSections from './components/DepartmentSections';
import { checkInfoStore } from './utils/UserInfoStorageService';
import { DialogTitle } from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'motion/react';
import { ProgramCards } from './components/ProgramCards';

export default function UserInfoRouterProvider({
 children,
}: {
 children: React.ReactNode;
}) {
 const [isOpen, setIsOpen] = useState(false);
 const [currentStep, setCurrentStep] = useState(1);
 const [selectedDepartmentID, setSelectedDepartmentID] = useState<
  number | null
 >(null);

 // user query
 const { data, isFetching, isLoading, isError, isSuccess } = useQuery({
  queryKey: [userInfoBaseKey],
  staleTime: 'static',
  gcTime: 0,
  async queryFn({ signal }) {
   const res = await getApiUserInfo({ signal });
   const { departments, programs, owners } = res.data.value;
   const departmentsWithPrograms = Object.entries(departments).map(
    ([id, name]) => ({
     id,
     name,
     programs: programs.filter((p) => p.departmentID === Number(id)),
    })
   );
   return {
    ownerName: Object.values(owners)[0],
    departments: departmentsWithPrograms,
   };
  },
 });

 const toggleModal = useEffectEvent(() => {
  const storageStatus = checkInfoStore();
  if (!storageStatus) {
   setIsOpen(true);
  }
 });
 useEffect(() => {
  if (data) {
   toggleModal();
  }
 }, [data]);

 const selectedDepartment = data?.departments.find(
  (item) => Number(item.id) === selectedDepartmentID
 );

 const ctx: UserInfoStore = {
  isLoading,
  isError,
  isFetching,
  data,
  isOpen,
  setIsOpen,
  currentStep,
  setCurrentStep,
  selectedDepartmentID,
  setSelectedDepartmentID,
 };

 if (isLoading)
  return (
   <div>
    <Loading />
   </div>
  );

 return (
  <userInfoRouterContext.Provider value={ctx}>
   {isSuccess && children}
   <AnimatePresence mode='popLayout'>
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
     <DialogTitle>برنامه خود را انتخاب کنید</DialogTitle>
     <DialogContent className='gap-0 p-0 max-h-[90svh] overflow-hidden rounded-3xl flex flex-col border border-solid dark:border-gray-600!'>
      <DialogHeader className='p-4 flex items-center justify-start gap-2'>
       <Hotel size={24} className='text-primary' />
       <h4 className='text-xl font-bold text-primary'>
        {data?.ownerName ? data?.ownerName : 'مالک'}
       </h4>
       {currentStep === 2 && (
        <motion.button
         className='text-right my-4 flex justify-start ml-auto gap-1 items-center text-gray-600 dark:text-gray-300 bg-transparent border-b border-b-gray-800 hover:border-b-gray-200 hover:dark:border-b-gray-300 cursor-pointer w-fit transition-all'
         onClick={() => setCurrentStep(1)}
        >
         <CornerUpRight size={20} />
         <span>بازگشت</span>
        </motion.button>
       )}
      </DialogHeader>
      <div className='overflow-y-auto overflow-x-hidden!'>
       <h4 className='text-lg flex px-4'>
        {currentStep === 1 ? 'دپارتمان ها' : 'برنامه ها'}
       </h4>
       <div className='flex flex-wrap items-center justify-evenly mt-4 gap-4 p-4'>
        {data?.departments.map((item, index) => (
         <DepartmentSections key={item.id} item={item} index={index} />
        ))}
       </div>
       <AnimatePresence>
        {currentStep === 2 && selectedDepartment && (
         <ProgramCards programs={selectedDepartment.programs} />
        )}
       </AnimatePresence>
      </div>
     </DialogContent>
    </Dialog>
   </AnimatePresence>
  </userInfoRouterContext.Provider>
 );
}
