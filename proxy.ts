import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { type Locale } from './internalization/app/localization';
import {
 isUserLocaleValid,
 userLocaleCookieName,
} from './utils/userLocaleManager';
import { cookies } from 'next/headers';

function ignorePath(path: string): boolean {
 const targetPaths = ['/api', '/static'];
 return path.includes('.') || targetPaths.some((item) => path.startsWith(item));
}

async function getUserLocale(): Promise<Locale> {
 const savedCookies = await cookies();
 const userLocale = savedCookies.get(userLocaleCookieName);
 if (isUserLocaleValid(userLocale?.value || null))
  return userLocale!.value as Locale;
 return 'fa';
}

export async function proxy(req: NextRequest) {
 const path = req.nextUrl.pathname;
 if (ignorePath(path)) return;
 const pathSegments = path.split('/');
 // check for valid user locale
 if (!isUserLocaleValid(pathSegments[1])) {
  req.nextUrl.pathname = `${await getUserLocale()}${path}`;
  return NextResponse.redirect(req.nextUrl);
 }
 // check user app login
 // not logged in user
 // if (pathSegments[2] !== 'login' && !isUserLoggedIn) {
 //  req.nextUrl.pathname = `${await getUserLocale()}/login/sign-in/${defaultSignInOption}`;
 //  return NextResponse.redirect(req.nextUrl);
 // }
 // // logged in user
 // if (pathSegments[2] === 'login' && isUserLoggedIn) {
 //  req.nextUrl.pathname = `${await getUserLocale()}/`;
 //  return NextResponse.redirect(req.nextUrl);
 // }
}

export const config = {
 matcher: ['/((?!_next).*)'],
};
