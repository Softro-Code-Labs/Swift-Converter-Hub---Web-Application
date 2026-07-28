import { describe, it, expect } from 'vitest';
import { csvToJson, jsonToCsv } from './useCsvJson';
import type { CsvJsonOptions } from '../types/csvJson';

const baseOpts: CsvJsonOptions = {
  direction: 'csv-to-json',
  delimiter: ',',
  hasHeader: true,
  prettyJson: false,
  arrayOutput: true,
};

describe('csvToJson', () => {
  it('converts a simple CSV with headers into an array of objects', () => {
    const csv = 'name,age\nAlice,30\nBob,25';
    const result = csvToJson(csv, baseOpts);
    expect(result.error).toBeNull();
    expect(JSON.parse(result.output)).toEqual([
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 },
    ]);
    expect(result.rowCount).toBe(2);
    expect(result.colCount).toBe(2);
  });

  it('coerces booleans and nulls', () => {
    const csv = 'active,deleted\ntrue,null';
    const result = csvToJson(csv, baseOpts);
    expect(JSON.parse(result.output)).toEqual([{ active: true, deleted: null }]);
  });

  it('handles quoted fields containing the delimiter', () => {
    const csv = 'name,note\n"Smith, John",hello';
    const result = csvToJson(csv, baseOpts);
    expect(JSON.parse(result.output)).toEqual([
      { name: 'Smith, John', note: 'hello' },
    ]);
  });

  it('handles escaped double quotes inside quoted fields', () => {
    const csv = 'quote\n"She said ""hi"""';
    const result = csvToJson(csv, baseOpts);
    expect(JSON.parse(result.output)).toEqual([{ quote: 'She said "hi"' }]);
  });

  it('generates positional column names when hasHeader is false', () => {
    const csv = 'Alice,30\nBob,25';
    const result = csvToJson(csv, { ...baseOpts, hasHeader: false });
    expect(JSON.parse(result.output)).toEqual([
      { col_0: 'Alice', col_1: 30 },
      { col_0: 'Bob', col_1: 25 },
    ]);
  });

  it('respects a custom delimiter', () => {
    const csv = 'name;age\nAlice;30';
    const result = csvToJson(csv, { ...baseOpts, delimiter: ';' });
    expect(JSON.parse(result.output)).toEqual([{ name: 'Alice', age: 30 }]);
  });

  it('returns an empty result for blank input', () => {
    const result = csvToJson('', baseOpts);
    expect(result).toEqual({
      output: '',
      rowCount: 0,
      colCount: 0,
      error: null,
    });
  });
});

describe('jsonToCsv', () => {
  const csvOpts: CsvJsonOptions = { ...baseOpts, direction: 'json-to-csv' };

  it('converts an array of objects into CSV with a header row', () => {
    const json = JSON.stringify([
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 },
    ]);
    const result = jsonToCsv(json, csvOpts);
    expect(result.error).toBeNull();
    expect(result.output).toBe('name,age\nAlice,30\nBob,25');
  });

  it('wraps a single JSON object in an array of one', () => {
    const json = JSON.stringify({ name: 'Alice', age: 30 });
    const result = jsonToCsv(json, csvOpts);
    expect(result.rowCount).toBe(1);
    expect(result.output).toBe('name,age\nAlice,30');
  });

  it('quotes fields containing the delimiter', () => {
    const json = JSON.stringify([{ name: 'Smith, John' }]);
    const result = jsonToCsv(json, csvOpts);
    expect(result.output).toBe('name\n"Smith, John"');
  });

  it('escapes embedded double quotes', () => {
    const json = JSON.stringify([{ quote: 'She said "hi"' }]);
    const result = jsonToCsv(json, csvOpts);
    expect(result.output).toBe('quote\n"She said ""hi"""');
  });

  it('unions keys across records with differing shapes', () => {
    const json = JSON.stringify([{ a: 1 }, { b: 2 }]);
    const result = jsonToCsv(json, csvOpts);
    expect(result.colCount).toBe(2);
    expect(result.output).toBe('a,b\n1,\n,2');
  });

  it('returns an error for invalid JSON', () => {
    const result = jsonToCsv('{not valid json', csvOpts);
    expect(result.error).not.toBeNull();
    expect(result.output).toBe('');
  });

  it('returns an error when JSON is neither an object nor an array', () => {
    const result = jsonToCsv('"just a string"', csvOpts);
    expect(result.error).toBe('Input must be a JSON array or object');
  });
});
