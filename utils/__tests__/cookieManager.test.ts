import { afterEach, describe, expect, it, vi } from 'vitest';
import { getCookie, setCookie } from '@/utils/cookieManager';

const usedCookieNames = ['plain', 'encoded', 'token', 'pathed'];

function clearUsedCookies() {
	for (const name of usedCookieNames) {
		document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
	}
}

afterEach(() => {
	vi.restoreAllMocks();
	clearUsedCookies();
});

describe('setCookie', () => {
	it('writes the value to document.cookie', () => {
		setCookie('plain', 'value');
		expect(document.cookie).toContain('plain=value');
	});

	it('encodes name and value', () => {
		setCookie('encoded', 'a b&c');
		expect(getCookie('encoded')).toBe('a b&c');
	});

	it('persists with a numeric expires in seconds', () => {
		setCookie('token', 'value', { expires: 3600 });
		expect(getCookie('token')).toBe('value');
	});

	it('persists with a Date expires', () => {
		setCookie('token', 'value', {
			expires: new Date(Date.now() + 60_000),
		});
		expect(getCookie('token')).toBe('value');
	});

	it('uses the given path', () => {
		const setSpy = vi.spyOn(document, 'cookie', 'set');
		setCookie('pathed', 'value', { path: '/custom' });
		expect(setSpy.mock.calls[0][0]).toContain('; path=/custom');
	});

	it('defaults to path=/ and samesite=strict', () => {
		const setSpy = vi.spyOn(document, 'cookie', 'set');
		setCookie('plain', 'value');
		expect(setSpy.mock.calls[0][0]).toContain('; path=/');
		expect(setSpy.mock.calls[0][0]).toContain('; samesite=strict');
	});

	it('adds no secure flag over http', () => {
		const setSpy = vi.spyOn(document, 'cookie', 'set');
		setCookie('plain', 'value');
		expect(setSpy.mock.calls[0][0]).not.toContain('; secure');
	});
});

describe('getCookie', () => {
	it('returns null for a missing cookie', () => {
		expect(getCookie('missing')).toBeNull();
	});

	it('reads back a set value', () => {
		setCookie('plain', 'value');
		expect(getCookie('plain')).toBe('value');
	});

	it('reads each of several cookies', () => {
		setCookie('plain', 'one');
		setCookie('token', 'two');
		expect(getCookie('plain')).toBe('one');
		expect(getCookie('token')).toBe('two');
	});

	it('round-trips values containing = signs', () => {
		setCookie('plain', 'a=b');
		expect(getCookie('plain')).toBe('a=b');
	});

	it('truncates the value at the second = sign (pinned current behavior)', () => {
		document.cookie = 'plain=a=b; path=/';
		expect(getCookie('plain')).toBe('a');
	});
});
