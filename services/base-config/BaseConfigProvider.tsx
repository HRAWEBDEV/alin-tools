'use client';
import { ReactNode, useEffect, useState } from 'react';
import { useWindowResizeWatchter } from '@/hooks/useWindowResizeWatchter';
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
import { getLocaleContrastMode, setLocaleContrastMode } from './contrastMode';

interface Props {
 activeLocale: Locale;
 children: ReactNode;
}

export default function BaseConfigProvider({ children, activeLocale }: Props) {
 const [userActiveTimeZone, setUserActiveTimeZone] = useState('');
 const [contrastMode, setContrastMode] = useState(() => {
  if (typeof window !== 'undefined') {
   return getLocaleContrastMode();
  }
  return true;
 });
 const windowWatcher = useWindowResizeWatchter();
 // locale handler
 function onChangeLocale(newLocale: Locale) {
  if (newLocale === activeLocale) return;
  setUserLocale(newLocale);
  const url = new URL(location.href);
  url.pathname = url.pathname.replace(`/${activeLocale}`, `/${newLocale}`);
  location.href = url.href;
 }
 //
 function handleChangeContrastMode(newState: boolean) {
  setContrastMode(newState);
  setLocaleContrastMode(newState);
 }
 //
 const activeLocaleInfo = locales[activeLocale];
 // context value
 const ctx: BaseConfig = {
  contrastMode,
  onContrastModeChange: handleChangeContrastMode,
  locale: activeLocale,
  localeInfo: activeLocaleInfo,
  appVersion,
  appBirthDate,
  windowWatcher,
  setLocale: onChangeLocale,
  userActiveTimeZone,
 };

 useEffect(() => {
  const ctx = new AbortController();
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
   e.returnValue = true;
   return true;
  };
  window.onbeforeunload = handleBeforeUnload;
  window.addEventListener('beforeunload', handleBeforeUnload, {
   signal: ctx.signal,
  });
  return () => ctx.abort();
 }, []);

 useEffect(() => {
  setUserActiveTimeZone(new Intl.DateTimeFormat().resolvedOptions().timeZone);
 }, []);

 useEffect(() => {
  document.documentElement.setAttribute(
   'data-contrast-mode',
   contrastMode ? 'on' : 'off',
  );
 }, [contrastMode]);

 return (
  <baseConfigContext.Provider value={ctx}>
   <ThemeProvider storageKey='app-theme' themes={[...appModes]} enableSystem>
    {children}
   </ThemeProvider>
  </baseConfigContext.Provider>
 );
}
