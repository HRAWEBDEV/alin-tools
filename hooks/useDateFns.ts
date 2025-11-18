import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { supportedDateFns } from '@/internalization/app/localization';

export function useDateFns() {
 const { locale } = useBaseConfig();
 return supportedDateFns[locale];
}
