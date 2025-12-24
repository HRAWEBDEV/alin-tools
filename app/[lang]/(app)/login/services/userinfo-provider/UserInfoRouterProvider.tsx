'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import {
 type UserInfoStoreContext,
 userInfoRouterContext,
} from './UserInfoRouterContext';
import { userInfoBaseKey, getApiUserInfo } from './userInfoApiActions';
import { useQuery } from '@tanstack/react-query';
import Loading from '@/components/Loading';
import { convertToUserInfoStore } from './userInfoApiActions';
import { toast } from 'sonner';
import { useLogout } from '../../hooks/useLogout';
import { useShareDictionary } from '../../../services/share-dictionary/shareDictionaryContext';
import { useRouter } from 'next/navigation';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { useIsHomePage } from '../../hooks/useIsHomePage';
import {
 Dialog,
 DialogTitle,
 DialogContent,
 DialogHeader,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { MdTouchApp } from 'react-icons/md';
import { Departments } from './utils/systems';
import { FaHotel } from 'react-icons/fa';
import ServeDishIcon from '../../../components/icons/ServeDishIcon';
import DishIcon from '../../../components/icons/DishIcon';
import HouseKeepingIcon from '../../../components/icons/HouseKeepingIcon';
import { FaCheckCircle } from 'react-icons/fa';
import { AnimatePresence, motion } from 'motion/react';
import {
 type UserInfoRouterStorage,
 setUserInfoRouterStorageValue,
 getUserInfoRouterStorageValue,
} from './utils/userInfoRouterStorageManager';
import { useQueryClient } from '@tanstack/react-query';
import { handleScroll } from './utils/handleScroll';

export default function UserInfoRouterProvider({
 children,
}: {
 children: React.ReactNode;
}) {
 const queryClient = useQueryClient();
 const [userInfoRouterStorage, setUserInfoRouterStorage] =
  useState<UserInfoRouterStorage | null>(null);
 const [showUserRouter, setShowUserRouter] = useState(false);
 const isHomePage = useIsHomePage();
 const { locale } = useBaseConfig();
 const router = useRouter();
 const targetRef = useRef<HTMLDivElement | null>(null);
 const {
  shareDictionary: {
   components: { userInfoRouter: userInfoRouterDic },
  },
 } = useShareDictionary();
 const logout = useLogout();
 //
 const [selectedDialogDepartmentID, setSelectedDialogDepartmentID] = useState<
  number | null
 >(null);

 const { data, isFetching, isLoading, isError, isSuccess } = useQuery({
  queryKey: [userInfoBaseKey],
  staleTime: 'static',
  gcTime: 0,
  async queryFn({ signal }) {
   const res = await getApiUserInfo({ signal });
   return convertToUserInfoStore(res.data);
  },
 });

 const redirectUser = useCallback(
  (depID: number) => {
   queryClient.clear();
   if (depID === Departments.foodAndBeverage) {
    router.push(`/${locale}/restaurant`);
    return;
   }
   if (depID === Departments.roomDivision) {
    router.push(`/${locale}/room-devision`);
    return;
   }
  },
  [locale, router, queryClient]
 );

 const ctx: UserInfoStoreContext = {
  data: data!,
  isError,
  isLoading,
  isFetching,
  userInfoRouterStorage: userInfoRouterStorage!,
 };

 useEffect(() => {
  if (!isError) return;
  logout();
 }, [isError, logout]);

 useEffect(() => {
  const val = getUserInfoRouterStorageValue();
  if (!val) {
   setShowUserRouter(true);
  } else {
   setShowUserRouter(false);
   setUserInfoRouterStorage(val);
   if (isHomePage) {
    redirectUser(val.departmentID);
   }
  }
 }, [isHomePage, redirectUser]);
 useEffect(() => {
  if (targetRef.current && selectedDialogDepartmentID) {
   setTimeout(() => {
    handleScroll(targetRef);
   }, 350);
  }
 }, [selectedDialogDepartmentID]);
 if (isLoading || !isSuccess || !data.owners.length)
  return (
   <div>
    <Loading />
   </div>
  );

 const selectedDialogDepartment = selectedDialogDepartmentID
  ? data.owners[0].departments.find(
     (dep) => dep.id === selectedDialogDepartmentID
    ) || null
  : null;

 return (
  <userInfoRouterContext.Provider value={ctx}>
   {isSuccess && userInfoRouterStorage && children}
   <Dialog open={showUserRouter}>
    <DialogContent className='gap-0 flex flex-col w-[min(95%,50rem)] max-h-[95svh] max-w-none! p-0 overflow-hidden'>
     <DialogHeader className='p-4'>
      <DialogTitle className='text-md'>
       {userInfoRouterDic.selectProgram}
      </DialogTitle>
     </DialogHeader>
     <div className='p-4 pt-0 overflow-auto'>
      <div className='mb-6'>
       <h1 className='text-center text-2xl lg:text-3xl font-medium text-primary'>
        {data.owners[0].name}
       </h1>
      </div>
      <AnimatePresence mode='popLayout'>
       <div className='flex justify-center gap-4 flex-wrap mb-6'>
        {data.owners[0].departments.map((dep) => (
         <motion.div
          layout
          key={dep.id}
          initial={{ opacity: 0, rotateY: -50, scale: 0.8 }}
          animate={{ opacity: 1, rotateY: 0, scale: 1 }}
          exit={{ opacity: 0, rotateY: 50, scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          transition={{
           default: {
            type: 'keyframes',
            duration: 0.3,
            delay: 0.3,
           },
           layout: {
            delay: 0,
            duration: 0.3,
           },
          }}
         >
          <Button
           variant='outline'
           className={`relative h-auto w-auto flex-col ${
            selectedDialogDepartment ? 'size-32' : 'size-40 lg:size-48 '
           } max-h-none ${
            dep.id === Departments.roomDivision
             ? 'bg-sky-100 dark:bg-sky-950 text-primary'
             : 'bg-teal-100 dark:bg-teal-950 text-secondary'
           }`}
           onClick={() => {
            setSelectedDialogDepartmentID(dep.id);
           }}
          >
           {selectedDialogDepartmentID === dep.id && (
            <div className='absolute top-0 right-0'>
             <FaCheckCircle className='text-secondary size-6' />
            </div>
           )}
           {!selectedDialogDepartment && (
            <div className='absolute bottom-0 end-0 z-0'>
             <MdTouchApp className='size-24 text-neutral-200/70 dark:text-neutral-800/70' />
            </div>
           )}
           <div className='flex flex-col items-center z-1 gap-4'>
            {dep.id == Departments.roomDivision && (
             <FaHotel
              className={`${
               selectedDialogDepartment ? 'size-10' : 'size-12 lg:size-14'
              }`}
             />
            )}
            {dep.id == Departments.foodAndBeverage && (
             <ServeDishIcon
              className={`${
               selectedDialogDepartment ? 'size-10' : 'size-12 lg:size-14'
              }`}
             />
            )}
            <span
             className={`${
              selectedDialogDepartment ? 'text-base' : 'text-base lg:text-lg'
             } font-medium`}
            >
             {dep.name}
            </span>
           </div>
          </Button>
         </motion.div>
        ))}
       </div>
      </AnimatePresence>
      {selectedDialogDepartment && (
       <motion.div>
        <h2 className='mb-4 font-lg font-medium text-rose-700 dark:text-rose-400'>
         {userInfoRouterDic.selectActiveProgram}:
        </h2>
        <div ref={targetRef} className='flex justify-center gap-4 flex-wrap'>
         <AnimatePresence mode='popLayout'>
          {selectedDialogDepartment.programs.map((program) => (
           <motion.div
            key={program.id}
            layout
            initial={{ scale: 0.8, opacity: 0, rotateY: 50 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            exit={{ scale: 0.8, opacity: 0, rotateY: -50 }}
            whileHover={{ scale: 1.1 }}
            transition={{
             duration: 0.3,
             delay: 0.3,
             type: 'keyframes',
            }}
           >
            <Button
             variant='outline'
             disabled={selectedDialogDepartment.id === Departments.roomDivision}
             data-disabled={
              selectedDialogDepartment.id === Departments.roomDivision
             }
             className={`relative h-auto w-auto flex-col size-40 max-h-none ${
              selectedDialogDepartment.id === Departments.roomDivision
               ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400'
               : 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400'
             } data-[disabled="true"]:bg-neutral-100 data-[disabled="true"]:text-neutral-400 dark:data-[disabled="true"]:bg-neutral-100 dark:data-[disabled="true"]:text-neutral-400 data-[disabled="true"]:cursor-not-allowed`}
             onClick={() => {
              const selectedUserInfo = {
               departmentID: selectedDialogDepartmentID!,
               ownerID: data.owners[0].id,
               programID: program.id,
               systemID: program.systemID,
               ownerName: data.owners[0].name,
               departmentName: selectedDialogDepartment!.name,
               programName: program.name || '',
              };
              setUserInfoRouterStorageValue(selectedUserInfo);
              setUserInfoRouterStorage(selectedUserInfo);
              setShowUserRouter(false);
              redirectUser(selectedDialogDepartmentID!);
             }}
            >
             <div className='absolute bottom-0 end-0 z-0'>
              <MdTouchApp className='size-24 text-neutral-200/70 dark:text-neutral-800/70' />
             </div>
             <div className='flex flex-col items-center z-1 gap-4'>
              {selectedDialogDepartment.id == Departments.roomDivision && (
               <HouseKeepingIcon className='size-12' fill='currentColor' />
              )}
              {selectedDialogDepartment.id == Departments.foodAndBeverage && (
               <DishIcon className='size-12' />
              )}
              <span className='text-lg font-medium'>{program.name}</span>
             </div>
            </Button>
           </motion.div>
          ))}
         </AnimatePresence>
        </div>
       </motion.div>
      )}
     </div>
    </DialogContent>
   </Dialog>
  </userInfoRouterContext.Provider>
 );
}
