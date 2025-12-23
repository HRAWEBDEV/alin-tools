'server-only';
import {
 getLocaleOrDefault,
 type Locale,
} from '@/internalization/app/localization';

type NewOrderDictionary = typeof import('./fa.json');

const dictionaries: Record<Locale, () => Promise<NewOrderDictionary>> = {
 fa: () => import('./fa.json').then((res) => res.default),
 en: () => import('./fa.json').then((res) => res.default),
};

function getNewOrderDictionary({ locale }: { locale: Locale }) {
 const activeLocale = getLocaleOrDefault(locale);
 return dictionaries[activeLocale]();
}

export type { NewOrderDictionary };
export { getNewOrderDictionary };
