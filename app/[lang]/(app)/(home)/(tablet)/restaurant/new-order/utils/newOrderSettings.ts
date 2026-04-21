interface NewOrderSettings {
 showOrderImage: boolean;
}

const defaultNewOrderSettings: NewOrderSettings = {
 showOrderImage: true,
};

const newOrderSettingsKey = 'new-order-settings';

function saveNewOrderSettings(setting: NewOrderSettings) {
 localStorage.setItem(newOrderSettingsKey, JSON.stringify(setting));
}

function getNewOrderSettings() {
 const val = localStorage.getItem(newOrderSettingsKey);
 if (!val) return defaultNewOrderSettings;
 return JSON.parse(val);
}

export type { NewOrderSettings };
export {
 defaultNewOrderSettings,
 newOrderSettingsKey,
 saveNewOrderSettings,
 getNewOrderSettings,
};
