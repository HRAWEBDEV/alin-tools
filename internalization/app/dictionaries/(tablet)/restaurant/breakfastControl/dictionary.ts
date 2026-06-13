'server-only';
import {
 getLocaleOrDefault,
 type Locale,
} from '@/internalization/app/localization';

type BreakfastControlDictionary = typeof import('./fa.json');

const dictionaries: Record<Locale, () => Promise<BreakfastControlDictionary>> =
 {
  fa: () => import('./fa.json').then((res) => res.default),
  en: () => import('./fa.json').then((res) => res.default),
 };

function getBreakfastControlDictionary({ locale }: { locale: Locale }) {
 const activeLocale = getLocaleOrDefault(locale);
 return dictionaries[activeLocale]();
}

export type { BreakfastControlDictionary };
export { getBreakfastControlDictionary };
