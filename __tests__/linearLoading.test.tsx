import { expect, test } from 'vitest'
import { render } from '@testing-library/react'
import LinearLoading from '@/app/[lang]/(app)/components/LinearLoading'

test('LinearLoading', () => {
	const { container } = render(<LinearLoading />)
	expect(container.firstChild).toBeDefined()
})
