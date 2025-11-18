function setCookie(
 name: string,
 value: string,
 options: { expires?: number | Date; path?: string } = {},
): void {
 let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

 if (options.expires) {
  const expires =
   typeof options.expires === 'number'
    ? new Date(Date.now() + options.expires * 1000)
    : options.expires;
  cookieString += `; expires=${expires.toUTCString()}`;
 }
 cookieString += `; path=${options.path ? options.path : '/'}`;
 cookieString += '; samesite=strict';

 if (location.protocol === 'https:') {
  cookieString += '; secure';
 }
 document.cookie = cookieString;
}

function getCookie(name: string): string | null {
 const cookies = document.cookie.split('; ');
 for (const cookie of cookies) {
  const [key, value] = cookie.split('=');
  if (key === decodeURIComponent(name)) {
   return decodeURIComponent(value);
  }
 }
 return null;
}

export { getCookie, setCookie };
