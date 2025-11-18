import { createContext, use } from 'react';
import {
 type Locale,
 type LocaleInfo,
} from '@/internalization/app/localization';
import { OutOfContext } from '@/utils/OutOfContext';

interface BaseConfig {
 locale: Locale;
 localeInfo: LocaleInfo;
 appVersion: string;
 appBirthDate: Date;
 setLocale: (newLocale: Locale) => unknown;
}

const appVersion = '1.0.0';
const appBirthDate = new Date(2025, 1, 1);
const baseConfigContext = createContext<BaseConfig | null>(null);

function useBaseConfig(): BaseConfig {
 const val = use(baseConfigContext);
 if (!val) throw new OutOfContext('BaseConfig');
 return val;
}

export type { BaseConfig };
export { baseConfigContext, appVersion, appBirthDate, useBaseConfig };
