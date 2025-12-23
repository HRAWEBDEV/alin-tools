import { useRouter } from 'next/navigation';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { clearUserLoginToken } from '../utils/loginTokenManager';

export function useLogout() {
 const router = useRouter();
 const { locale } = useBaseConfig();

 return () => {
  router.push(`/${locale}/login`);
  clearUserLoginToken();
 };
}
