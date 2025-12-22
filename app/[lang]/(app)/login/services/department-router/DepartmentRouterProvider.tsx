'use client';

import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { useState } from 'react';
import { nanoid } from 'nanoid';
import { Hotel } from 'lucide-react';
import {
 DepartmentData,
 DepartmentRouterContext,
} from '../../utils/LoginDepartmentContext';
import DepartmentSections from '../../components/DepartmentSections';

export default function DepartmentRouterProvider({
 children,
}: {
 children: React.ReactNode;
}) {
 const [department, setDepartment] = useState<DepartmentData | null>(null);
 const [isOpen, setIsOpen] = useState(false);
 const owner = Object.values(department?.value.owners ?? {})[0];
 const departmentSections = Object.entries(department?.value.departments ?? {});
 const values = {
  department,
  setDepartment,
  setIsOpen,
 };

 return (
  <DepartmentRouterContext.Provider value={values}>
   {children}
   <Dialog open={isOpen} onOpenChange={setIsOpen}>
    <DialogContent className='gap-0 p-0 max-h-[90svh] overflow-hidden flex flex-col dark:border-gray-50 dark:bg-gray-800'>
     <DialogHeader className='p-4 flex items-center justify-start gap-4'>
      <span>{owner ? owner : 'مالک'}</span>
      <Hotel />
     </DialogHeader>
     <div className='p-4 overflow-auto'>
      <h4>دپارتمان ها:</h4>
      <div>
       {departmentSections.map((item) => (
        <DepartmentSections key={nanoid()} item={item} />
       ))}
      </div>
     </div>
    </DialogContent>
   </Dialog>
  </DepartmentRouterContext.Provider>
 );
}
