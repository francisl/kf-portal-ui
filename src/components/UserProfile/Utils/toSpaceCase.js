/**
 * Returns the space case conversion of a camel case word
 * @param word
 * @returns {string|string}
 */
export default function toSpaceCase(word) {
  let spaced = "";

  for(let i=0; i<word.length; i++) {
    const char = word.charAt(i);

    if(char === char.toUpperCase()) spaced += " ";

    if(i === 0) spaced += char.toUpperCase();
    else spaced += char;
  }

  return spaced;
}