'use client';

import { useEffect } from 'react';
import { useDepartmentContext } from '../utils/LoginDepartmentContext';
import { fetchDepartmentData } from '@/app/[lang]/(app)/login/utils/LoginDepartmentContext';

export default function DepartmentRouter() {
 const { setDepartment, setIsOpen } = useDepartmentContext();
 useEffect(() => {
  async function getDepartmentAndSet() {
   const res = await fetchDepartmentData();
   if (res) {
    setDepartment(res);
    setIsOpen(true);
   }
  }
  const keys = ['Ownerid', 'Departmentid', 'Programid', 'Systemid'];
  const isDepartmentSet = keys.every(
   (item) => localStorage.getItem(item) !== null
  );
  if (!isDepartmentSet) {
   getDepartmentAndSet();
  } else return;
 }, [setDepartment, setIsOpen]);
 return <></>;
}
