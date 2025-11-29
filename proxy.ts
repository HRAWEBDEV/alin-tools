import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { type Locale } from './internalization/app/localization';
import {
 isUserLocaleValid,
 userLocaleCookieName,
} from './utils/userLocaleManager';

function ignorePath(path: string): boolean {
 const targetPaths = ['/api', '/static'];
 return path.includes('.') || targetPaths.some((item) => path.startsWith(item));
}

async function getUserLocale(cookies: NextRequest['cookies']): Promise<Locale> {
 const userLocale = cookies.get(userLocaleCookieName);
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
  req.nextUrl.pathname = `${await getUserLocale(req.cookies)}${path}`;
  return NextResponse.redirect(new URL(req.nextUrl, req.url));
 }
}

export const config = {
 matcher: ['/((?!_next).*)'],
};
