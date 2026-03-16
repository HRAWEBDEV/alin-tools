'server-only';
import {
 getLocaleOrDefault,
 type Locale,
} from '@/internalization/app/localization';

type ExecutionManagementDictionary = typeof import('./fa.json');

const dictionaries: Record<
 Locale,
 () => Promise<ExecutionManagementDictionary>
> = {
 fa: () => import('./fa.json').then((res) => res.default),
 en: () => import('./fa.json').then((res) => res.default),
};

function getExecutionManagementDictionary({ locale }: { locale: Locale }) {
 const activeLocale = getLocaleOrDefault(locale);
 return dictionaries[activeLocale]();
}

export type { ExecutionManagementDictionary };
export { getExecutionManagementDictionary };
