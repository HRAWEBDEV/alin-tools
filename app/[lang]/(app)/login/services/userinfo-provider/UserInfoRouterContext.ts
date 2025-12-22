import { createContext, use } from 'react';
import { OutOfContext } from '@/utils/OutOfContext';

interface UserInfoStore {
 isLoading: boolean;
 isFetching: boolean;
 isError: boolean;
}

const userInfoRouterContext = createContext<UserInfoStore | null>(null);

function useUserInfoRouter() {
 const ctx = use(userInfoRouterContext);
 if (!ctx) throw new OutOfContext('UserInfoRouterContext');
 return ctx;
}

export type { UserInfoStore };
export { useUserInfoRouter, userInfoRouterContext };
