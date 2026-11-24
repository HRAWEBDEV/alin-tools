import { describe, expect, it } from 'vitest';
import { DEVELOPMENT, PRODUCTION } from '@/utils/env';

describe('env constants', () => {
	it('exports DEVELOPMENT', () => {
		expect(DEVELOPMENT).toBe('DEVELOPMENT');
	});

	it('exports PRODUCTION', () => {
		expect(PRODUCTION).toBe('PRODUCTION');
	});
});
