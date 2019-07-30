/**
 * Returns the space case conversion of a camel case word
 * @param word
 * @returns {string|string}
 */
function toCamelCase(word) {
  return word.split("-").reduce( (acc, w, i) => {
    if(i === 0) return acc+w;
    else return acc+w.charAt(0).toUpperCase()+w.substring(1);
  }, "");
}

export default function toCamelCSS(str) {
  const clean = str.split("\n").map(line => {
    const keyVal = line.split(": ");

    return `${toCamelCase(keyVal[0])}: '${keyVal[1].substring(0, keyVal[1].length-1)}'`;
  }).join(",\n");

  console.log(clean);
  return clean;
}