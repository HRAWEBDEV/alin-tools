'server-only';
import {
 getLocaleOrDefault,
 type Locale,
} from '@/internalization/app/localization';

type RoomStatisticsDictionary = typeof import('./fa.json');

const dictionaries: Record<Locale, () => Promise<RoomStatisticsDictionary>> = {
 fa: () => import('./fa.json').then((res) => res.default),
 en: () => import('./fa.json').then((res) => res.default),
};

function getRoomStatisticsDictionary({ locale }: { locale: Locale }) {
 const activeLocale = getLocaleOrDefault(locale);
 return dictionaries[activeLocale]();
}

export type { RoomStatisticsDictionary };
export { getRoomStatisticsDictionary };
