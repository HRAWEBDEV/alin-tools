interface UserInfoRouterStorage {
 ownerID: number;
 programID: number;
 departmentID: number;
}

const userInfoRouterStorageKey = 'user-info-router';

function isUserInfoRouterStorageValueValid(): boolean {
 return !!getUserInfoRouterStorageValue();
}

function getUserInfoRouterStorageValue(): UserInfoRouterStorage | null {
 const value = localStorage.getItem(userInfoRouterStorageKey);
 return value && JSON.parse(value);
}

function setUserInfoRouterStorageValue(value: UserInfoRouterStorage) {
 localStorage.setItem(userInfoRouterStorageKey, JSON.stringify(value));
}

function clearUserInfoRouterStorageValue() {
 localStorage.removeItem(userInfoRouterStorageKey);
}

export type { UserInfoRouterStorage };
export {
 userInfoRouterStorageKey,
 isUserInfoRouterStorageValueValid,
 setUserInfoRouterStorageValue,
 getUserInfoRouterStorageValue,
 clearUserInfoRouterStorageValue,
};
