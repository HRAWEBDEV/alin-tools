'server-only';
import {
 getLocaleOrDefault,
 type Locale,
} from '@/internalization/app/localization';

type RoomsManagementDictionary = typeof import('./fa.json');

const dictionaries: Record<Locale, () => Promise<RoomsManagementDictionary>> = {
 fa: () => import('./fa.json').then((res) => res.default),
 en: () => import('./fa.json').then((res) => res.default),
};

function getRoomsManagementDictionary({ locale }: { locale: Locale }) {
 const activeLocale = getLocaleOrDefault(locale);
 return dictionaries[activeLocale]();
}

export type { RoomsManagementDictionary };
export { getRoomsManagementDictionary };
