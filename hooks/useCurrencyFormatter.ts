import { useBaseConfig } from '@/services/base-config/baseConfigContext';

export function useCurrencyFormatter() {
 const { locale } = useBaseConfig();
 return new Intl.NumberFormat(locale);
}
