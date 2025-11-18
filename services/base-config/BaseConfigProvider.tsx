'use client';
import { ReactNode } from 'react';
import {
 type BaseConfig,
 baseConfigContext,
 appBirthDate,
 appVersion,
} from './baseConfigContext';
import { type Locale, locales } from '@/internalization/app/localization';
import { setUserLocale } from '@/utils/userLocaleManager';
import { ThemeProvider } from 'next-themes';
import { appModes } from '@/theme/appModes';

interface Props {
 activeLocale: Locale;
 children: ReactNode;
}

export default function BaseConfigProvider({ children, activeLocale }: Props) {
 // locale handler
 function onChangeLocale(newLocale: Locale) {
  if (newLocale === activeLocale) return;
  setUserLocale(newLocale);
  const url = new URL(location.href);
  url.pathname = url.pathname.replace(`/${activeLocale}`, `/${newLocale}`);
  location.href = url.href;
 }
 //
 const activeLocaleInfo = locales[activeLocale];
 // context value
 const ctx: BaseConfig = {
  locale: activeLocale,
  localeInfo: activeLocaleInfo,
  appVersion,
  appBirthDate,
  setLocale: onChangeLocale,
 };
 return (
  <baseConfigContext.Provider value={ctx}>
   <ThemeProvider storageKey='app-theme' themes={[...appModes]} enableSystem>
    {children}
   </ThemeProvider>
  </baseConfigContext.Provider>
 );
}
