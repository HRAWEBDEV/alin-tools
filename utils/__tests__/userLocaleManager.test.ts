import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
	getUserLocale,
	isUserLocaleValid,
	setUserLocale,
	userLocaleCookieName,
} from '@/utils/userLocaleManager';

beforeEach(() => {
	document.cookie = `${userLocaleCookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
});

afterEach(() => {
	vi.restoreAllMocks();
	document.cookie = `${userLocaleCookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
});

describe('userLocaleCookieName', () => {
	it('is app-locale', () => {
		expect(userLocaleCookieName).toBe('app-locale');
	});
});

describe('isUserLocaleValid', () => {
	it.each([
		[null, false],
		['', false],
		['fr', false],
		['fa', true],
		['en', true],
	])('isUserLocaleValid(%j) === %j', (item, expected) => {
		expect(isUserLocaleValid(item)).toBe(expected);
	});
});

describe('getUserLocale', () => {
	it('returns null when no cookie is set', () => {
		expect(getUserLocale()).toBeNull();
	});

	it('returns the stored valid locale', () => {
		document.cookie = `${userLocaleCookieName}=fa; path=/`;
		expect(getUserLocale()).toBe('fa');
	});

	it('returns null for an invalid stored locale', () => {
		document.cookie = `${userLocaleCookieName}=fr; path=/`;
		expect(getUserLocale()).toBeNull();
	});

	it('returns null for an empty stored value', () => {
		document.cookie = `${userLocaleCookieName}=; path=/`;
		expect(getUserLocale()).toBeNull();
	});
});

describe('setUserLocale', () => {
	it('writes the locale to the app-locale cookie', () => {
		const setSpy = vi.spyOn(document, 'cookie', 'set');
		setUserLocale('fa');
		expect(setSpy.mock.calls[0][0]).toContain(`${userLocaleCookieName}=fa`);
	});

	it('sets a one-year expiry', () => {
		const setSpy = vi.spyOn(document, 'cookie', 'set');
		setUserLocale('fa');
		expect(setSpy.mock.calls[0][0]).toContain('; expires=');
	});

	it('round-trips with getUserLocale', () => {
		setUserLocale('fa');
		expect(getUserLocale()).toBe('fa');
	});
});
