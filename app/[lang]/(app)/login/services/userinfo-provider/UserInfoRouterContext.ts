import { createContext, use } from 'react';
import { OutOfContext } from '@/utils/OutOfContext';
import {
 type UserInfoStore,
 type Program,
 type Department,
 type Owner,
} from './userInfoApiActions';

interface UserInfoStoreContext {
 data: UserInfoStore;
 routeOwner: Owner;
 routeDepartment: Department;
 routeProgram: Program;
 isLoading: boolean;
 isFetching: boolean;
 isError: boolean;
 changeProgram: () => void;
}

const userInfoRouterContext = createContext<UserInfoStoreContext | null>(null);

function useUserInfoRouter() {
 const ctx = use(userInfoRouterContext);
 if (!ctx) throw new OutOfContext('UserInfoRouterContext');
 return ctx;
}

export type { UserInfoStoreContext };
export { useUserInfoRouter, userInfoRouterContext };
