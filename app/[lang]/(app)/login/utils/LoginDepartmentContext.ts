import { createContext, Dispatch, SetStateAction, use } from 'react';
import { axios } from '../../utils/defaultAxios';
import { OutOfContext } from '@/utils/OutOfContext';

interface DepartmentData {
 value: {
  programs: [
   {
    id: number;
    parentID: null | number;
    ownerID: number;
    systemID: number;
    name: string | null;
    systemRouteMap: string | null;
    systemName: string;
    systemNameID: number;
    ownerName: string;
    ownerNameID: number;
    departmentID: number;
    departmentName: string;
    departmentNameID: number;
   }
  ];
  owners: Record<string, string>;
  departments: Record<string, string>;
  systems: Record<string, string>;
 };
}

interface DepartmentRouterContextType {
 department: DepartmentData | null;
 setDepartment: Dispatch<SetStateAction<DepartmentData | null>>;
 setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const DepartmentRouterContext =
 createContext<DepartmentRouterContextType | null>(null);
async function fetchDepartmentData(): Promise<DepartmentData> {
 const response = await axios.get<DepartmentData>(
  '/Restaurant/Tablet/GetUIDatas'
 );

 return response.data;
}

function useDepartmentContext() {
 const context = use(DepartmentRouterContext);
 if (context === null)
  throw new OutOfContext(
   "Department Router Context was used outside of it's provider!"
  );
 return context;
}

export {
 useDepartmentContext,
 fetchDepartmentData,
 DepartmentRouterContext,
 type DepartmentData,
};
