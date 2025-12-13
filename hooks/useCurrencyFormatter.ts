import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { type Locale } from '@/internalization/app/localization';

function getLocaleNumberFormatter(
 locale: Locale,
 options?: Intl.NumberFormatOptions,
) {
 if (!options?.maximumFractionDigits === undefined) {
  if (!options) options = {};
  if (locale === 'fa') {
   options.maximumFractionDigits = 0;
  }
 }
 return new Intl.NumberFormat(locale, options);
}

export function useCurrencyFormatter(options?: Intl.NumberFormatOptions) {
 const { locale } = useBaseConfig();
 return getLocaleNumberFormatter(locale, options);
}
