// what DON'T we want to see in a `role` page?
import * as React from 'react';
import Editor from './Editor';
import Title from './Title';

const filters = {research: [], community: ["jobTitle"], health: ["jobTitle", "institution"], patient: ["jobTitle", "institution"]};

const flexStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
};

/**
 * Intentionally not testing for undefined: if we have a composite accessor, profile[f] will return undefined.
 *
 * @param val
 * @returns {boolean}
 */
function isEmpty(val) {
  if (val === null) return true;
  else if (val === "") return true;
  else if(Array.isArray(val) && val.length === 0) return true;
  else return false;
}

/**
 * This component gates access to the fields of a profile. It also gates access to editing those fields.
 *
 * It receives a list of fields. Those fields will have Cell called on them to obtain a displayable react Component, in
 * order to display the value of those fields in the profile. However, if the same field name can be found in Cells, it
 * the displayed Component will
 *
 * @param profile
 * @param canEdit
 * @param submit
 * @returns {Function}
 */
const makeGate = (profile, canEdit, submit) => ({fields, title, Cell = (f) => <div style={{marginTop: "1em"}}>{profile[f]}</div>, Cells = {}, style={}, editorCells={}}) => {
  fields = fields.filter( f => {
    if(f.includes(" ")) return true;
    else return !filters[profile.roles[0]].includes(f)
  });

  const display = fields.map( f => isEmpty(profile[f]) ? "" : f in Cells ? Cells[f]() : Cell(f));

  const EditButton = canEdit  // EditButton is either empty string or an actual edit button depending on canEdit
    ? ({fields}) => <Editor profile={profile} fields={fields} title={title} Cells={editorCells} submit={submit}/>
    : (props) => null;

  if(title === "" || title === undefined) return (
    <div style={{...style, ...flexStyle}}>
      <div>{display}</div>
      <EditButton fields={fields}/>
    </div>
  );

  return (
    <div style={style}>
      <Title style={flexStyle} >{title}<EditButton fields={fields}/></Title>
      {display}
    </div>
  )
};

export default makeGate;