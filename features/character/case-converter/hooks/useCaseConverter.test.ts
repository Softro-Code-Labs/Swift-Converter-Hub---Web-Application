import { describe, it, expect } from 'vitest';
import { convertCase } from './useCaseConverter';

describe('convertCase', () => {
  it('returns an empty string for empty input regardless of case', () => {
    expect(convertCase('', 'upper')).toBe('');
  });

  it('converts to UPPER CASE', () => {
    expect(convertCase('Hello World', 'upper')).toBe('HELLO WORLD');
  });

  it('converts to lower case', () => {
    expect(convertCase('Hello World', 'lower')).toBe('hello world');
  });

  it('converts to Title Case, lowercasing minor words', () => {
    expect(convertCase('the lord of the rings', 'title')).toBe(
      'The Lord of the Rings',
    );
  });

  it('always capitalizes the first word in Title Case, even if minor', () => {
    expect(convertCase('a tale of two cities', 'title')).toBe(
      'A Tale of Two Cities',
    );
  });

  it('converts to Sentence case', () => {
    expect(convertCase('hello world. how are you?', 'sentence')).toBe(
      'Hello world. How are you?',
    );
  });

  it('converts to camelCase from spaced words', () => {
    expect(convertCase('hello world example', 'camel')).toBe(
      'helloWorldExample',
    );
  });

  it('converts to camelCase from snake_case', () => {
    expect(convertCase('hello_world_example', 'camel')).toBe(
      'helloWorldExample',
    );
  });

  it('converts to PascalCase', () => {
    expect(convertCase('hello world example', 'pascal')).toBe(
      'HelloWorldExample',
    );
  });

  it('converts existing camelCase into words before re-casing', () => {
    expect(convertCase('helloWorldExample', 'snake')).toBe(
      'hello_world_example',
    );
  });

  it('converts to snake_case', () => {
    expect(convertCase('Hello World Example', 'snake')).toBe(
      'hello_world_example',
    );
  });

  it('converts to kebab-case', () => {
    expect(convertCase('Hello World Example', 'kebab')).toBe(
      'hello-world-example',
    );
  });

  it('converts to CONSTANT_CASE', () => {
    expect(convertCase('Hello World Example', 'constant')).toBe(
      'HELLO_WORLD_EXAMPLE',
    );
  });

  it('converts to dot.case', () => {
    expect(convertCase('Hello World Example', 'dot')).toBe(
      'hello.world.example',
    );
  });

  it('converts to aLtErNaTiNg case, skipping non-letters', () => {
    expect(convertCase('ab cd', 'alternating')).toBe('aB cD');
  });

  it('inverts existing casing', () => {
    expect(convertCase('Hello World', 'inverse')).toBe('hELLO wORLD');
  });

  it('returns the original text for an unrecognized case id', () => {
    // @ts-expect-error - intentionally invalid case id to test the fallback
    expect(convertCase('Hello', 'not-a-real-case')).toBe('Hello');
  });
});
