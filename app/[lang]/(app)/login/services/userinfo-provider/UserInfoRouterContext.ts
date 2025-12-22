import { createContext, Dispatch, SetStateAction, use } from 'react';
import { OutOfContext } from '@/utils/OutOfContext';

interface Program {
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

interface DepartmentWithPrograms {
 id: string;
 name: string;
 programs: Program[];
}

interface UserInfoStore {
 isLoading: boolean;
 isFetching: boolean;
 isError: boolean;
 data?: {
  ownerName: string;
  departments: DepartmentWithPrograms[];
 };
 isOpen: boolean;
 setIsOpen: Dispatch<SetStateAction<boolean>>;
 currentStep: number;
 setCurrentStep: Dispatch<SetStateAction<number>>;
 selectedDepartmentID: number | null;
 setSelectedDepartmentID: Dispatch<SetStateAction<number | null>>;
}

const userInfoRouterContext = createContext<UserInfoStore | null>(null);

function useUserInfoRouter() {
 const ctx = use(userInfoRouterContext);
 if (!ctx) throw new OutOfContext('UserInfoRouterContext');
 return ctx;
}

export type { UserInfoStore };
export { useUserInfoRouter, userInfoRouterContext };
