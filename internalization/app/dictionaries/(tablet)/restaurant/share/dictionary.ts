'server-only';
import {
 getLocaleOrDefault,
 type Locale,
} from '@/internalization/app/localization';

type RestaurantShareDictionary = typeof import('./fa.json');

const dictionaries: Record<Locale, () => Promise<RestaurantShareDictionary>> = {
 fa: () => import('./fa.json').then((res) => res.default),
 en: () => import('./fa.json').then((res) => res.default),
};

function getRestaurantShareDictionary({ locale }: { locale: Locale }) {
 const activeLocale = getLocaleOrDefault(locale);
 return dictionaries[activeLocale]();
}

export type { RestaurantShareDictionary };
export { getRestaurantShareDictionary };
