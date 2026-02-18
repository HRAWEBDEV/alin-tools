const STORAGE_KEY = 'salonsConfig';

interface SalonsConfig {
 displayMode: (typeof displayModeOptions)[number];
 boldStyle: boolean;
}

const displayModeOptions = ['normal', 'minimal'] as const;

const defaultStorageSalonsConfig: SalonsConfig = {
 displayMode: 'normal',
 boldStyle: false,
};

function getStorageSalonsConfig(): SalonsConfig {
 const val = localStorage.getItem(STORAGE_KEY);
 return val ? JSON.parse(val) : defaultStorageSalonsConfig;
}

function setStorageSalonsConfig(newConfig: SalonsConfig) {
 localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
}

export type { SalonsConfig };
export {
 displayModeOptions,
 defaultStorageSalonsConfig,
 getStorageSalonsConfig,
 setStorageSalonsConfig,
};
