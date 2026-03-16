'server-only';
import {
 getLocaleOrDefault,
 type Locale,
} from '@/internalization/app/localization';

type RoomsRackDictionary = typeof import('./fa.json');

const dictionaries: Record<Locale, () => Promise<RoomsRackDictionary>> = {
 fa: () => import('./fa.json').then((res) => res.default),
 en: () => import('./fa.json').then((res) => res.default),
};

function getRoomsRackDictionary({ locale }: { locale: Locale }) {
 const activeLocale = getLocaleOrDefault(locale);
 return dictionaries[activeLocale]();
}

export type { RoomsRackDictionary };
export { getRoomsRackDictionary };
