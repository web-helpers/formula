import type { FormulaStores } from '../shared/types.mjs';

/**
 * Return a map of store keys to event names (camelCase to kebab-case with form: prefix)
 */
export function eventsWithFormKeys(stores: FormulaStores): Map<string, string> {
  const keyMap = new Map<string, string>();

  for (const key in stores) {
    const splitKeyArray = key
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .split(' ')
      .map((word) => word.toLowerCase());
    if (splitKeyArray.length === 1) {
      splitKeyArray.unshift('form');
    }
    keyMap.set(key, splitKeyArray.join(':'));
  }

  return keyMap;
}
