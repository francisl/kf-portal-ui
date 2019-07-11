import * as React from 'react';
import { H4 } from '../../../uikit/Headings';
import toSpaceCase from '../Utils/toSpaceCase';

/**
 * Wraps the children of the Privacy Wrap into a if-else if-else:
 *
 * IF editing: return the children
 * ELSE IF the accessor is an array:
 *  for every empty accessed value, display a "No X value found". If applicable, display the children.
 * ELSE IF the accessed value is empty (and the accessor is a string): display a "No X value found".
 * ELSE return the children.
 *
 * By "empty" we mean: the accessors used on the profile return an empty value (undefined, empty array, null, "", etc)
 *
 * @param profile
 * @param accessor
 * @param editing
 * @param props
 * @returns {*}
 * @constructor
 */
const PrivacyWrap = ({profile, accessor, editing=false, ...props}) => {

  const None = ({acc}) => <H4>No {acc} found for this profile.</H4>;

  function isEmpty(acc) {
    const value = profile[acc];

    return value === null || value === undefined || (Array.isArray(value) && value.length === 0) || value === "";
  }

  if(editing) return props.children;

  if (Array.isArray(accessor)) {
    const invalids = accessor.filter(isEmpty);

    if(invalids.length === accessor.length) return <div><None acc={joinWithLast(invalids)}/></div>;
    else if(invalids.length !== 0) return <div><None acc={joinWithLast(invalids)}/>{props.children}</div>;

  } else if (isEmpty(accessor)) return <None acc={accessor}/>;


  return props.children;
};

export default PrivacyWrap;

/**
 * Takes an array of camelCase words and returns a string of space case words, separated by ", " and the final by
 * lastSep
 *
 * @param arr
 * @param lastSep
 * @returns {string|*}
 */
function joinWithLast(arr, lastSep=" or ") {
  if(arr.length === 1) return arr[0];

  const copy = [...arr];

  const lastItem = toSpaceCase(copy.pop());
  const joined = copy.map(toSpaceCase).join(", ");

  return `${joined}${lastSep}${lastItem}`;
}

