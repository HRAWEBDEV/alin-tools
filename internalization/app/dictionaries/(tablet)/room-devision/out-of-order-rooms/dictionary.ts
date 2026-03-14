'server-only';
import {
 getLocaleOrDefault,
 type Locale,
} from '@/internalization/app/localization';

type OutOfOrderRoomsDictionary = typeof import('./fa.json');

const dictionaries: Record<Locale, () => Promise<OutOfOrderRoomsDictionary>> = {
 fa: () => import('./fa.json').then((res) => res.default),
 en: () => import('./fa.json').then((res) => res.default),
};

function getOutOfOrderRoomsDictionary({ locale }: { locale: Locale }) {
 const activeLocale = getLocaleOrDefault(locale);
 return dictionaries[activeLocale]();
}

export type { OutOfOrderRoomsDictionary };
export { getOutOfOrderRoomsDictionary };
