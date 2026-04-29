import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { clearUserLoginToken } from '../utils/loginTokenManager';
import { clearUserInfoRouterStorageValue } from '../services/userinfo-provider/utils/userInfoRouterStorageManager';
import { useQueryClient } from '@tanstack/react-query';

export function useLogout() {
 const queryClient = useQueryClient();
 const router = useRouter();
 const { locale } = useBaseConfig();

 const logout = useCallback(() => {
  router.push(`/${locale}/login`);
  clearUserLoginToken();
  clearUserInfoRouterStorageValue();
  queryClient.clear();
 }, [locale, router, queryClient]);

 return logout;
}
