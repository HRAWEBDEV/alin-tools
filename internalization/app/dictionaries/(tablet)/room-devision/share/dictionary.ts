'server-only';
import {
 getLocaleOrDefault,
 type Locale,
} from '@/internalization/app/localization';

type RoomDevisionShareDictionary = typeof import('./fa.json');

const dictionaries: Record<Locale, () => Promise<RoomDevisionShareDictionary>> =
 {
  fa: () => import('./fa.json').then((res) => res.default),
  en: () => import('./fa.json').then((res) => res.default),
 };

function getRoomDevisionShareDictionary({ locale }: { locale: Locale }) {
 const activeLocale = getLocaleOrDefault(locale);
 return dictionaries[activeLocale]();
}

export type { RoomDevisionShareDictionary };
export { getRoomDevisionShareDictionary };
