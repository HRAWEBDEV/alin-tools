import * as dateFns from 'date-fns';
import * as dateFnsJalali from 'date-fns-jalali';

type LocaleInfo = (typeof locales)[keyof typeof locales];
type Locale = LocaleInfo['locale'];
type Calendar = LocaleInfo['calendar'];
type ContentDirection = LocaleInfo['contentDirection'];

const locales = {
 fa: {
  locale: 'fa',
  extension: 'IR',
  contentDirection: 'rtl',
  calendar: 'jalali',
  localeName: 'فارسی',
  localeShortName: 'فا',
  active: true,
  timezone: 'Asia/Tehran',
  country: 'iran',
 },
 en: {
  locale: 'en',
  extension: 'US',
  contentDirection: 'ltr',
  calendar: 'gregorian',
  localeName: 'English',
  localeShortName: 'EN',
  active: false,
  timezone: '',
  country: 'iran',
 },
} as const;

function getLocalInfo(locale: Locale): LocaleInfo {
 if (locale in locales) return locales[locale];
 return locales['en'];
}

function getLocaleOrDefault(locale: Locale): Locale {
 if (locale in locales) return locale;
 return 'en';
}

const localesList = Object.keys(locales);

const supportedDateFns = {
 fa: dateFnsJalali,
 en: dateFns,
};

export type { ContentDirection, Calendar, Locale, LocaleInfo };
export {
 locales,
 getLocalInfo,
 localesList,
 supportedDateFns,
 getLocaleOrDefault,
};
