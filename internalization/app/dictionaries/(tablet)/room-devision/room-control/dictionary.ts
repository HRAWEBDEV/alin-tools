'server-only';
import {
 getLocaleOrDefault,
 type Locale,
} from '@/internalization/app/localization';

type RoomControlDictionary = typeof import('./fa.json');

const dictionaries: Record<Locale, () => Promise<RoomControlDictionary>> = {
 fa: () => import('./fa.json').then((res) => res.default),
 en: () => import('./fa.json').then((res) => res.default),
};

function getRoomControlDictionary({ locale }: { locale: Locale }) {
 const activeLocale = getLocaleOrDefault(locale);
 return dictionaries[activeLocale]();
}

export type { RoomControlDictionary };
export { getRoomControlDictionary };
