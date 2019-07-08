import * as React from 'react';
import { H4 } from '../../../uikit/Headings';

const PrivacyWrap = ({profile, accessor, editing=false, ...props}) => {

  console.log(profile)
  console.log(accessor);
  function None({acc}) {
    return <H4>No <span style={{textTransform: 'capitalize'}}>{acc}</span> found for this profile.</H4>
  }

  function isEmpty(acc) {
    return isInvalid(profile[acc]);
  }

  function isInvalid(value) {
    return value === null || value === undefined || (Array.isArray(value) && value.length === 0) || value === "";
  }

  if(editing) return props.children;

  if (Array.isArray(accessor)) {
    const invalids = accessor.filter(isEmpty);

    if (invalids.length !== 0) return <div><None acc={invalids.map(toSpaceCase).join(", ")}/>{props.children}</div>;
  } else {
    if (isEmpty(accessor)) return <None acc={accessor}/>
  }

  return props.children;
};

export default PrivacyWrap;

function toSpaceCase(item) {
  let spaced = "";

  for(let i=0; i<item.length; i++) {
    const char = item[i];

    if(char === char.toUpperCase()) spaced += " ";
    spaced += char.toLowerCase();
  }

  return spaced;
}