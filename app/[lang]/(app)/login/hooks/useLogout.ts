import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { clearUserLoginToken } from '../utils/loginTokenManager';
import { clearUserInfoRouterStorageValue } from '../services/userinfo-provider/utils/userInfoRouterStorageManager';
import { publishAuthMessage } from '../services/auth-broadcast/authBroadcast';
import { useQueryClient } from '@tanstack/react-query';

export function useLogout(options?: { broadcast?: boolean }) {
 const queryClient = useQueryClient();
 const router = useRouter();
 const { locale } = useBaseConfig();

 const logout = useCallback(() => {
  router.push(`/${locale}/login`);
  clearUserLoginToken();
  clearUserInfoRouterStorageValue();
  queryClient.clear();
  if (options?.broadcast !== false) {
   publishAuthMessage({ type: 'logout' });
  }
 }, [locale, router, queryClient, options?.broadcast]);

 return logout;
}
