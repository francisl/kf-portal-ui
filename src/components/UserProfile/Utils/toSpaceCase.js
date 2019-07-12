/**
 * Returns the space case conversion of a camel case word
 * @param word
 * @returns {string|string}
 */
export function toSpaceCase(word) {
  let spaced = "";

  for(let i=0; i<word.length; i++) {
    const char = word.charAt(i);

    if(char === char.toUpperCase()) spaced += " ";

    if(i === 0) spaced += char.toUpperCase();
    else spaced += char;
  }

  return spaced;
}

/**
 * Takes an array of camelCase words and returns a string of space case words, separated by ", " and the final by
 * lastSep
 *
 * @param arr
 * @param lastSep
 * @returns {string|*}
 */
export function joinWithLast(arr, lastSep=" or ") {
  if(arr.length === 1) return arr[0];

  const copy = [...arr];

  const lastItem = toSpaceCase(copy.pop());
  const joined = copy.map(toSpaceCase).join(", ");

  return `${joined}${lastSep}${lastItem}`;
}

