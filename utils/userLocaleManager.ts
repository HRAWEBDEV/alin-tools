import { getCookie, setCookie } from './cookieManager';
import { type Locale, localesList } from '@/internalization/app/localization';

const userLocaleCookieName = 'app-locale';

function isUserLocaleValid(item: string | null): boolean {
 if (!item) return false;
 return localesList.includes(item);
}

function setUserLocale(newLocale: Locale): void {
 const expireDate = new Date();
 expireDate.setFullYear(expireDate.getFullYear() + 1);
 setCookie(userLocaleCookieName, newLocale, {
  expires: expireDate,
 });
}

function getUserLocale(): Locale | null {
 const savedItem = getCookie(userLocaleCookieName) as Locale | null;
 if (!isUserLocaleValid(savedItem)) return null;
 return savedItem;
}

export {
 userLocaleCookieName,
 isUserLocaleValid,
 getUserLocale,
 setUserLocale,
};
