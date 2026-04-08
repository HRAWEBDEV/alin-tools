'server-only';
import {
 getLocaleOrDefault,
 type Locale,
} from '@/internalization/app/localization';

type RoomControlPageDictionary = typeof import('./fa.json');

const dictionaries: Record<Locale, () => Promise<RoomControlPageDictionary>> = {
 fa: () => import('./fa.json').then((res) => res.default),
 en: () => import('./fa.json').then((res) => res.default),
};

function getRoomControlPageDictionary({ locale }: { locale: Locale }) {
 const activeLocale = getLocaleOrDefault(locale);
 return dictionaries[activeLocale]();
}

export type { RoomControlPageDictionary };
export { getRoomControlPageDictionary };
