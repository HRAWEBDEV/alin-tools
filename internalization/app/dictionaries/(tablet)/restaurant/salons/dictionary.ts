'server-only';
import { type Locale } from '@/internalization/app/localization';

type SalonsDictionary = typeof import('./fa.json');

const dictionaries: Record<Locale, () => Promise<SalonsDictionary>> = {
 fa: () => import('./fa.json').then((res) => res.default),
 en: () => import('./fa.json').then((res) => res.default),
};

function getSalonsDictionary({ locale }: { locale: Locale }) {
 return dictionaries[locale]();
}

export type { SalonsDictionary };
export { getSalonsDictionary };
