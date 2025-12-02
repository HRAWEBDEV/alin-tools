import { getCookie, setCookie } from '@/utils/cookieManager';

const userLoginTokenStorageName = 'app-token';

function isUserLoggedIn(): boolean {
 return Boolean(getUserLoginToken());
}

function setUserLoginToken(newToken: string): void {
 const expireDate = new Date();
 expireDate.setFullYear(expireDate.getFullYear() + 1);
 setCookie(userLoginTokenStorageName, newToken, {
  expires: expireDate,
 });
}

function clearUserLoginToken() {
 const expireDate = new Date();
 expireDate.setFullYear(expireDate.getFullYear() - 1);
 setCookie(userLoginTokenStorageName, '', {
  expires: expireDate,
 });
}

function getUserLoginToken(): string | null {
 const savedItem = getCookie(userLoginTokenStorageName) as string | null;
 return savedItem;
}

export {
 userLoginTokenStorageName,
 isUserLoggedIn,
 getUserLoginToken,
 setUserLoginToken,
 clearUserLoginToken,
};
