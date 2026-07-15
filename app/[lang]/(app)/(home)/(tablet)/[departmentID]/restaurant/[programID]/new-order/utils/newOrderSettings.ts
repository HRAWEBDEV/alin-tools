interface NewOrderSettings {
 showOrderImage: boolean;
 showDescription: boolean;
 showSplitPanel: boolean;
}

const defaultNewOrderSettings: NewOrderSettings = {
 showOrderImage: true,
 showDescription: false,
 showSplitPanel: false,
};

const newOrderSettingsKey = 'new-order-settings';

function saveNewOrderSettings(setting: NewOrderSettings) {
 localStorage.setItem(newOrderSettingsKey, JSON.stringify(setting));
}

function getNewOrderSettings() {
 const val = localStorage.getItem(newOrderSettingsKey);
 if (!val) return defaultNewOrderSettings;
 return { ...defaultNewOrderSettings, ...JSON.parse(val) };
}

export type { NewOrderSettings };
export {
 defaultNewOrderSettings,
 newOrderSettingsKey,
 saveNewOrderSettings,
 getNewOrderSettings,
};
