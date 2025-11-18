import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { useRouter } from 'next/navigation';

export function useGoHome() {
 const router = useRouter();
 const { locale } = useBaseConfig();

 return () => router.push(`/${locale}`);
}
