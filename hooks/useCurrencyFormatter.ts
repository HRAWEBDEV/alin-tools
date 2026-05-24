import { useMemo, useState } from 'react';
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
 const [optionsRef] = useState(options);
 const { locale } = useBaseConfig();
 const val = useMemo(() => {
  return getLocaleNumberFormatter(locale, optionsRef);
 }, [locale, optionsRef]);
 return val;
}
