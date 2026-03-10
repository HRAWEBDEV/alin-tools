'server-only';
import {
 getLocaleOrDefault,
 type Locale,
} from '@/internalization/app/localization';

type GuestsManagementDictionary = typeof import('./fa.json');

const dictionaries: Record<Locale, () => Promise<GuestsManagementDictionary>> =
 {
  fa: () => import('./fa.json').then((res) => res.default),
  en: () => import('./fa.json').then((res) => res.default),
 };

function getGuestsManagementDictionary({ locale }: { locale: Locale }) {
 const activeLocale = getLocaleOrDefault(locale);
 return dictionaries[activeLocale]();
}

export type { GuestsManagementDictionary };
export { getGuestsManagementDictionary };
