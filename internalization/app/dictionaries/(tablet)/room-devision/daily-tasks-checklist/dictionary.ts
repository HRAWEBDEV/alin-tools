'server-only';
import {
 getLocaleOrDefault,
 type Locale,
} from '@/internalization/app/localization';

type DailyTasksChecklistDictionary = typeof import('./fa.json');

const dictionaries: Record<
 Locale,
 () => Promise<DailyTasksChecklistDictionary>
> = {
 fa: () => import('./fa.json').then((res) => res.default),
 en: () => import('./fa.json').then((res) => res.default),
};

function getDailyTasksChecklistDictionary({ locale }: { locale: Locale }) {
 const activeLocale = getLocaleOrDefault(locale);
 return dictionaries[activeLocale]();
}

export type { DailyTasksChecklistDictionary };
export { getDailyTasksChecklistDictionary };
