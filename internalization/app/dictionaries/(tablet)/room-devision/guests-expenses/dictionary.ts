'server-only';
import {
 getLocaleOrDefault,
 type Locale,
} from '@/internalization/app/localization';

type GuestsExpensesDictionary = typeof import('./fa.json');

const dictionaries: Record<Locale, () => Promise<GuestsExpensesDictionary>> = {
 fa: () => import('./fa.json').then((res) => res.default),
 en: () => import('./fa.json').then((res) => res.default),
};

function getGuestsExpensesDictionary({ locale }: { locale: Locale }) {
 const activeLocale = getLocaleOrDefault(locale);
 return dictionaries[activeLocale]();
}

export type { GuestsExpensesDictionary };
export { getGuestsExpensesDictionary };
