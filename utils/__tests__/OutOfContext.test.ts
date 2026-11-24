import { describe, expect, it } from 'vitest';
import { OutOfContext } from '@/utils/OutOfContext';

describe('OutOfContext', () => {
	it('formats the message with the context name', () => {
		const error = new OutOfContext('TablesInfo');
		expect(error.message).toBe(
			'useTablesInfo must be used within a TablesInfoProvider',
		);
	});

	it('sets the name to OutOfContextError', () => {
		const error = new OutOfContext('TablesInfo');
		expect(error.name).toBe('OutOfContextError');
	});

	it('is an instance of Error', () => {
		expect(new OutOfContext('TablesInfo')).toBeInstanceOf(Error);
	});
});
