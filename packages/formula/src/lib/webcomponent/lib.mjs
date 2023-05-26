/**
 * Return a tuple of [key, key:joined, store] for each store
 * @param {import("../shared/stores.mjs").FormulaStores} stores
 * @returns {Map<string, string>}
 */
export function eventsWithFormKeys(stores) {
  const keyMap = new Map();

  for (const key in stores) {
    const splitKeyArray = key
      .replace(/([A-Z])/g, " $1")
      .trim()
      .split(" ")
      .map((word) => word.toLowerCase());
    if (splitKeyArray.length === 1) {
      splitKeyArray.unshift("form");
    }
    keyMap.set(key, splitKeyArray.join(":"));
  }

  return keyMap;
}
