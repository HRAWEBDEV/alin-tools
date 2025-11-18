'server-only';
import { type Locale } from '@/internalization/app/localization';

type ShareDictionary = typeof import('./fa.json');

const dictionaries: Record<Locale, () => Promise<ShareDictionary>> = {
 fa: () => import('./fa.json').then((res) => res.default),
 en: () => import('./fa.json').then((res) => res.default),
};

function getShareDictionary({ locale }: { locale: Locale }) {
 return dictionaries[locale]();
}

export type { ShareDictionary };
export { getShareDictionary };
