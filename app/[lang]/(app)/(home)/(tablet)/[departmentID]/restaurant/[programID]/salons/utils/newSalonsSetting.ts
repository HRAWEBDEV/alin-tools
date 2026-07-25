interface SalonsSettings {
 ltrTablesDirection: boolean;
}

const defaultSalonsSettings: SalonsSettings = {
 ltrTablesDirection: false,
};

const salonsSettingsKey = 'salons-settings';

function saveSalonsSettings(setting: SalonsSettings) {
 localStorage.setItem(salonsSettingsKey, JSON.stringify(setting));
}

function getSalonsSettings() {
 const val = localStorage.getItem(salonsSettingsKey);
 if (!val) return defaultSalonsSettings;
 return { ...defaultSalonsSettings, ...JSON.parse(val) };
}

export type { SalonsSettings };
export {
 defaultSalonsSettings,
 salonsSettingsKey,
 saveSalonsSettings,
 getSalonsSettings,
};
