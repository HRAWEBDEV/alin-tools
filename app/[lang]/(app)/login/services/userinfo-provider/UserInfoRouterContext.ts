import { createContext, use } from 'react';
import { OutOfContext } from '@/utils/OutOfContext';
import { type UserInfoStore } from './userInfoApiActions';

interface UserInfoStoreContext {
 data: UserInfoStore;
 isLoading: boolean;
 isFetching: boolean;
 isError: boolean;
}

const userInfoRouterContext = createContext<UserInfoStoreContext | null>(null);

function useUserInfoRouter() {
 const ctx = use(userInfoRouterContext);
 if (!ctx) throw new OutOfContext('UserInfoRouterContext');
 return ctx;
}

export type { UserInfoStoreContext };
export { useUserInfoRouter, userInfoRouterContext };
