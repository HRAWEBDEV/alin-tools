'server-only';
import {
 getLocaleOrDefault,
 type Locale,
} from '@/internalization/app/localization';

type GuestCheckoutChecklistDictionary = typeof import('./fa.json');

const dictionaries: Record<
 Locale,
 () => Promise<GuestCheckoutChecklistDictionary>
> = {
 fa: () => import('./fa.json').then((res) => res.default),
 en: () => import('./fa.json').then((res) => res.default),
};

function getGuestCheckoutChecklistDictionary({ locale }: { locale: Locale }) {
 const activeLocale = getLocaleOrDefault(locale);
 return dictionaries[activeLocale]();
}

export type { GuestCheckoutChecklistDictionary };
export { getGuestCheckoutChecklistDictionary };
