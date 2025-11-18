'server-only';
import { type Locale } from '@/internalization/app/localization';

type MetaDictionary = typeof import('./fa.json');

const dictionaries: Record<Locale, () => Promise<MetaDictionary>> = {
 fa: () => import('./fa.json').then((res) => res.default),
 en: () => import('./fa.json').then((res) => res.default),
};

function getMetaDictionary({ locale }: { locale: Locale }) {
 return dictionaries[locale]();
}

export type { MetaDictionary };
export { getMetaDictionary };
