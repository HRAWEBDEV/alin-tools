'use client';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { useState } from 'react';
import { nanoid } from 'nanoid';
import { Hotel } from 'lucide-react';
import {
 userInfoRouterContext,
 type UserInfoStore,
} from './UserInfoRouterContext';
// import DepartmentSections from '../../components/DepartmentSections';
import { userInfoBaseKey, getApiUserInfo } from './userInfoApiActions';
import { useQuery } from '@tanstack/react-query';
import Loading from '@/components/Loading';

export default function UserInfoRouterProvider({
 children,
}: {
 children: React.ReactNode;
}) {
 const [isOpen, setIsOpen] = useState(false);

 // user query
 const { data, isFetching, isLoading, isError, isSuccess } = useQuery({
  queryKey: [userInfoBaseKey],
  staleTime: 'static',
  gcTime: 0,
  async queryFn({ signal }) {
   console.log('here');
   const res = await getApiUserInfo({ signal });
   // transform data
   //
   return res.data;
  },
 });

 const ctx: UserInfoStore = {
  isLoading,
  isError,
  isFetching,
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
   <Dialog open={isOpen} onOpenChange={setIsOpen}>
    {/* <DialogContent className='gap-0 p-0 max-h-[90svh] overflow-hidden flex flex-col dark:border-gray-50 dark:bg-gray-800'> */}
    {/*  <DialogHeader className='p-4 flex items-center justify-start gap-4'> */}
    {/*   <span>{owner ? owner : 'مالک'}</span> */}
    {/*   <Hotel /> */}
    {/*  </DialogHeader> */}
    {/*  <div className='p-4 overflow-auto'> */}
    {/*   <h4>دپارتمان ها:</h4> */}
    {/*   <div> */}
    {/*    {departmentSections.map((item) => ( */}
    {/*     <DepartmentSections key={nanoid()} item={item} /> */}
    {/*    ))} */}
    {/*   </div> */}
    {/*  </div> */}
    {/* </DialogContent> */}
   </Dialog>
  </userInfoRouterContext.Provider>
 );
}
