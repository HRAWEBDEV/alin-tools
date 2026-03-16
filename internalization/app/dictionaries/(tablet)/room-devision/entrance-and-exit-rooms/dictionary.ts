'server-only';
import {
 getLocaleOrDefault,
 type Locale,
} from '@/internalization/app/localization';

type EntranceAndExitRoomsDictionary = typeof import('./fa.json');

const dictionaries: Record<
 Locale,
 () => Promise<EntranceAndExitRoomsDictionary>
> = {
 fa: () => import('./fa.json').then((res) => res.default),
 en: () => import('./fa.json').then((res) => res.default),
};

function getEntranceAndExitRoomsDictionary({ locale }: { locale: Locale }) {
 const activeLocale = getLocaleOrDefault(locale);
 return dictionaries[activeLocale]();
}

export type { EntranceAndExitRoomsDictionary };
export { getEntranceAndExitRoomsDictionary };
