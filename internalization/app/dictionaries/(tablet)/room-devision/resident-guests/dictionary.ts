'server-only';
import {
 getLocaleOrDefault,
 type Locale,
} from '@/internalization/app/localization';

type ResidentGuestsDictionary = typeof import('./fa.json');

const dictionaries: Record<Locale, () => Promise<ResidentGuestsDictionary>> = {
 fa: () => import('./fa.json').then((res) => res.default),
 en: () => import('./fa.json').then((res) => res.default),
};

function getResidentGuestsDictionary({ locale }: { locale: Locale }) {
 const activeLocale = getLocaleOrDefault(locale);
 return dictionaries[activeLocale]();
}

export type { ResidentGuestsDictionary };
export { getResidentGuestsDictionary };
