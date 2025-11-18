'server-only';
import { type Locale } from '@/internalization/app/localization';

type LoginDictionary = typeof import('./fa.json');

const dictionaries: Record<Locale, () => Promise<LoginDictionary>> = {
 fa: () => import('./fa.json').then((res) => res.default),
 en: () => import('./fa.json').then((res) => res.default),
};

function getLoginDictionary({ locale }: { locale: Locale }) {
 return dictionaries[locale]();
}

export type { LoginDictionary };
export { getLoginDictionary };
