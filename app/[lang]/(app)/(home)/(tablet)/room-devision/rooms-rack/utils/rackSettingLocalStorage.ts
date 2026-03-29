import { type RackLayout } from './rackLayout';
import { rackLimitOptions } from './rackLimitOptions';

interface RackSetting {
 layout: RackLayout;
 pageLimit: number;
 sidebarIsPin: boolean;
}

const defaultRackSetting: RackSetting = {
 layout: 'detailed',
 pageLimit: rackLimitOptions[0],
 sidebarIsPin: false,
};

const rackSettingLocalKey = 'rooms-rack-setting';

function saveRackSetting(setting: RackSetting) {
 localStorage.setItem(rackSettingLocalKey, JSON.stringify(setting));
}

function getRackSetting() {
 const val = localStorage.getItem(rackSettingLocalKey);
 if (!val) return defaultRackSetting;
 return JSON.parse(val);
}

export type { RackSetting };
export {
 defaultRackSetting,
 rackSettingLocalKey,
 saveRackSetting,
 getRackSetting,
};
