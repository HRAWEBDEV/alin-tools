import * as dateFns from 'date-fns';
import * as dateFnsJalali from 'date-fns-jalali';

type ContentDirection = 'rtl' | 'ltr';
type Calendar = 'jalali' | 'gregorian';
type Locale = 'fa' | 'en';

interface LocaleInfo {
 locale: Locale;
 extension: string;
 contentDirection: ContentDirection;
 calendar: Calendar;
 localeName: string;
 localeShortName: string;
 active: boolean;
}

const locales: Record<Locale, LocaleInfo> = {
 fa: {
  locale: 'fa',
  extension: 'IR',
  contentDirection: 'rtl',
  calendar: 'jalali',
  localeName: 'فارسی',
  localeShortName: 'فا',
  active: true,
 },
 en: {
  locale: 'en',
  extension: 'US',
  contentDirection: 'ltr',
  calendar: 'gregorian',
  localeName: 'English',
  localeShortName: 'EN',
  active: false,
 },
} as const;

function getLocalInfo(locale: Locale): LocaleInfo {
 if (locale in locales) return locales[locale];
 return locales['en'];
}

const localesList = Object.keys(locales);

const supportedDateFns = {
 fa: dateFnsJalali,
 en: dateFns,
};

export type { ContentDirection, Calendar, Locale, LocaleInfo };
export { locales, getLocalInfo, localesList, supportedDateFns };
