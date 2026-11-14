import { expect, test, describe } from 'vitest';

function sum(a: number, b: number): number {
 return a + b;
}

describe('grouping multiple related tests together', () => {
 test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
 });

 test.for([
  [1, 1, 2],
  [2, 2, 4],
 ])('add %i and %i results to %i', ([a, b, result]) => {
  expect(sum(a, b)).toBe(result);
 });
});
// toBe to compare primitives
// toEqual to compare objects
// toStrictEqual
// toBeNull
// toBeUndefined
// toBeTruthy
// toBeFalsy
// toContain
// toMatchObject
// toThrow
// soft assertion
// before all
// after all
// after each
// before each
