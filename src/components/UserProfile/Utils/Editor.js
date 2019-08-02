import * as React from 'react';
import { TealActionButton, WhiteButton } from '../../../uikit/Button';
import PencilIcon from 'react-icons/lib/fa/pencil';
import styled from 'react-emotion';
import Title from './Title';
import cloneDeep from "lodash/cloneDeep"

import override from "./override";

const StyledLabel = styled('label')`
  font-size: 14px;
  letter-spacing: 0.2px;
  text-align: left;
  font-weight: 700;
`;

const fieldStyle = {
  backgroundColor: 'rgb(255, 255, 255)',
  borderBottomColor: 'rgb(212, 214, 221)',
  borderBottomLeftRadius: '10px',
  borderBottomRightRadius: '10px',
  borderBottomStyle: 'solid',
  borderBottomWidth: '1px',
  borderImageOutset: '0px',
  borderImageRepeat: 'stretch',
  borderImageSlice: '100%',
  borderImageSource: 'none',
  borderImageWidth: '1',
  borderLeftColor: 'rgb(212, 214, 221)',
  borderLeftStyle: 'solid',
  borderLeftWidth: '1px',
  borderRightColor: 'rgb(212, 214, 221)',
  borderRightStyle: 'solid',
  borderRightWidth: '1px',
  borderTopColor: 'rgb(212, 214, 221)',
  borderTopLeftRadius: '10px',
  borderTopRightRadius: '10px',
  borderTopStyle: 'solid',
  borderTopWidth: '1px',
  boxShadow: 'rgba(0, 0, 0, 0.075) 0px 1px 1px 0px inset',
  boxSizing: 'border-box',
  color: 'rgb(0, 0, 0)',
  cursor: 'text',
  display: 'block',
  fontFamily: '"Open Sans", sans-serif',
  fontSize: '14px',
  fontStretch: '100%',
  fontStyle: 'normal',
  fontVariantCaps: 'normal',
  fontVariantEastAsian: 'normal',
  fontVariantLigatures: 'normal',
  fontVariantNumeric: 'normal',
  fontWeight: '400',
  height: '34px',
  letterSpacing: 'normal',
  lineHeight: '20px',
  marginBottom: '0px',
  marginLeft: '0px',
  marginRight: '0px',
  marginTop: '0px',
  minWidth: '0px',
  outlineColor: 'rgb(0, 0, 0)',
  outlineStyle: 'none',
  outlineWidth: '0px',
  paddingBottom: '6px',
  paddingLeft: '12px',
  paddingRight: '12px',
  paddingTop: '6px',
  textAlign: 'start',
  textIndent: '0px',
  textRendering: 'auto',
  textShadow: 'none',
  textTransform: 'none',
  transitionDelay: '0s, 0s',
  transitionDuration: '0.15s, 0.15s',
  transitionProperty: 'border-color, box-shadow',
  transitionTimingFunction: 'ease-in-out, ease-in-out',
  maxWidth: "100%",
  width: "100%",
  wordSpacing: '0px',
  writingMode: 'horizontal-tb',
};

const selectStyle = {
  alignItems: 'center',
  backgroundAttachment: 'scroll',
  backgroundClip: 'border-box',
  backgroundColor: 'rgb(255, 255, 255)',
  backgroundOrigin: 'padding-box',
  backgroundPositionX: '100%',
  backgroundPositionY: '50%',
  backgroundRepeatX: '',
  backgroundRepeatY: '',
  backgroundSize: 'auto',
  borderBottomColor: 'rgb(212, 214, 221)',
  borderBottomLeftRadius: '10px',
  borderBottomRightRadius: '10px',
  borderBottomStyle: 'solid',
  borderBottomWidth: '1px',
  borderImageOutset: '0px',
  borderImageRepeat: 'stretch',
  borderImageSlice: '100%',
  borderImageSource: 'none',
  borderImageWidth: '1',
  borderLeftColor: 'rgb(212, 214, 221)',
  borderLeftStyle: 'solid',
  borderLeftWidth: '1px',
  borderRightColor: 'rgb(212, 214, 221)',
  borderRightStyle: 'solid',
  borderRightWidth: '1px',
  borderTopColor: 'rgb(212, 214, 221)',
  borderTopLeftRadius: '10px',
  borderTopRightRadius: '10px',
  borderTopStyle: 'solid',
  borderTopWidth: '1px',
  boxShadow: 'none',
  boxSizing: 'border-box',
  color: 'rgb(0, 0, 0)',
  cursor: 'default',
  display: 'block',
  fontFamily: 'Arial',
  fontSize: '14px',
  fontStretch: '100%',
  fontStyle: 'normal',
  fontVariantCaps: 'normal',
  fontVariantEastAsian: 'normal',
  fontVariantLigatures: 'normal',
  fontVariantNumeric: 'normal',
  fontWeight: '400',
  letterSpacing: 'normal',
  lineHeight: '20px',
  marginBottom: '0px',
  marginLeft: '0px',
  marginRight: '0px',
  marginTop: '0px',
  outlineColor: 'rgb(0, 0, 0)',
  outlineStyle: 'none',
  outlineWidth: '0px',
  paddingBottom: '7px',
  paddingLeft: '7px',
  paddingRight: '21px',
  paddingTop: '7px',
  textAlign: 'start',
  textIndent: '0px',
  textRendering: 'auto',
  textShadow: 'none',
  textTransform: 'capitalize',
  whiteSpace: 'pre',
  wordSpacing: '0px',
  writingMode: 'horizontal-tb',
  WebkitAppearance: 'none',
  WebkitRtlOrdering: 'logical',
  WebkitBorderImage: 'none'
};

const areaStyle = {
  display: "block",
  backgroundColor: 'rgb(255, 255, 255)',
  borderBottomColor: 'rgb(202, 203, 207)',
  borderBottomLeftRadius: '10px',
  borderBottomRightRadius: '10px',
  borderBottomStyle: 'solid',
  borderBottomWidth: '1px',
  borderImageOutset: '0px',
  borderImageRepeat: 'stretch',
  borderImageSlice: '100%',
  borderImageSource: 'none',
  borderImageWidth: '1',
  borderLeftColor: 'rgb(202, 203, 207)',
  borderLeftStyle: 'solid',
  borderLeftWidth: '1px',
  borderRightColor: 'rgb(202, 203, 207)',
  borderRightStyle: 'solid',
  borderRightWidth: '1px',
  borderTopColor: 'rgb(202, 203, 207)',
  borderTopLeftRadius: '10px',
  borderTopRightRadius: '10px',
  borderTopStyle: 'solid',
  borderTopWidth: '1px',
  boxSizing: 'border-box',
  color: 'rgb(0, 0, 0)',
  cursor: 'text',
  flexDirection: 'column',
  fontFamily: 'Montserrat, sans-serif, sans-serif',
  fontSize: '14px',
  fontStretch: '100%',
  fontStyle: 'normal',
  fontVariantCaps: 'normal',
  fontVariantEastAsian: 'normal',
  fontVariantLigatures: 'normal',
  fontVariantNumeric: 'normal',
  fontWeight: '400',
  letterSpacing: 'normal',
  lineHeight: 'normal',
  marginBottom: '0px',
  marginLeft: '0px',
  marginRight: '0px',
  marginTop: '0px',
  minHeight: '144px',
  outlineColor: 'rgb(0, 0, 0)',
  outlineStyle: 'none',
  outlineWidth: '0px',
  overflowWrap: 'break-word',
  paddingBottom: '2px',
  paddingLeft: '2px',
  paddingRight: '2px',
  paddingTop: '2px',
  resize: 'none',
  textAlign: 'start',
  textIndent: '0px',
  textRendering: 'auto',
  textShadow: 'none',
  textTransform: 'none',
  transitionDelay: '0s',
  transitionDuration: '0.2s',
  transitionProperty: 'all',
  transitionTimingFunction: 'ease',
  whiteSpace: 'pre-wrap',
  width: '100%',
  wordSpacing: '0px',
  writingMode: 'horizontal-tb',
  WebkitAppearance: 'none',
  WebkitRtlOrdering: 'logical',
  WebkitBorderImage: 'none'
};

/**
 * A labelled inputtext
 */
export class LabelInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {value: props.value};
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.handleChange(nextProps.value);
  }

  handleChange(v) {
    if(this.props.field) this.props.profile[this.props.field] = v;
    this.setState({value: v})
  }

  render() {
    return (
      <LabelEdit label={this.props.label}>
        <input type={"text"}  onChange={(e) => this.handleChange(e.target.value)} {...override(this.props, [{style: fieldStyle}, {value: this.state.value}])}/>
      </LabelEdit>
    );
  }
}

/**
 * A labelled select. Takes an array of <option/> as children.
 */
export class LabelSelect extends React.Component {
  constructor(props) {
    super(props);

    this.state = {value: props.value};
    this.handleChange = this.handleChange.bind(this);
    this.originalChange = this.originalChange.bind(this);
  }

  handleChange(e) {
    if(this.props.field) this.props.profile[this.props.field] = e.target.value;
    this.setState({value: e.target.value})
  }

  originalChange(e) {
    if(this.props.onChange) this.props.onChange(e);
  }

  render() {
    return (
      <LabelEdit label={this.props.label}>
        <select {...override(this.props, [{style: {...this.props.style, ...selectStyle}}, {onChange: (e) => {this.originalChange(e); this.handleChange(e);}}, {value: this.state.value}])}/>
      </LabelEdit>
    );
  }
}

/**
 * A labelled textarea.
 */
export class LabelTextArea extends React.Component {
  constructor(props) {
    super(props);

    this.state = {value: props.value};
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    if(this.props.field) this.props.profile[this.props.field] = e.target.value;
    this.setState({value: e.target.value})
  }

  render() {
    return (
      <LabelEdit label={this.props.label}>
        <textarea {...override(this.props, [{style: areaStyle}, {value: this.state.value}, {onChange: (e) => this.handleChange(e)}])}></textarea>
      </LabelEdit>
    );
  }
}

const LabelEdit = ({label, children}) => (
  <div style={{boxSizing: "border-box"}}>
    <StyledLabel style={{textTransform: "capitalize"}}>{label}:</StyledLabel>
    {children}
  </div>
);

const FieldContainer = (props) => (
  <div style={{display: 'grid', gridTemplateColumns: "1fr 1fr", gridGap: "1em", border: "thin solid rgb(237, 238, 241)", padding: "0.5em"}}>
    {props.children}
  </div>
);

export {FieldContainer};

/**
 * A suggestion item (used for addressform and interests)
 */
export class SuggestionItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {hovered: false};
  }

  render() {
    const style = {
      backgroundColor: this.state.hovered ? "lightgray" : "white",
      border: "thin solid rgb(202, 203, 207)",
      borderRadius: "1em",
      display: "inline-block",
      padding: "0.5em"
    };

    return (
      <div {...override(this.props, [{style: style}, {onMouseEnter: () => this.setState({hovered: true})}, {onMouseLeave: () => this.setState({hovered: false})}])}>
        <span style={{fontFamily: "Montserrat, sans-serif, sans-serif", fontWeight: "20", lineHeight: "20px", fontSize: "20px"}}>{this.props.description}</span>
      </div>
    )
  }
}

/**
 * An editor for a profile. Takes a list of fields, the profile, a Cells object, a title, and a submit function.
 *
 * Works by copying the profile, and then passing that copy to each of it's automated editing fields. Those automated
 * fields are created from the fields array passed to the Editor: it'll make a new LabelInput for each of those fields,
 * and use the Space Case version of the camelCase names of the fields as the label.
 *
 * Of course, such a generic approach cannot be accurate for every case. Thus, one can also pass new editing cells to
 * the Editor: the Cells. We take each key of the Cells and call the cell with the copy of the profile as an
 * argument. That way, the cell can implement modifications to the copy the way they want.
 *
 * Do note that you can add cells to Cells whose field name is not found in the field array passed to Editor.
 *
 * Once we're done editing, clicking the save button will simply overwrite Persona's profile with the copy. In other
 * words, it is the responsibility of the cells to edit the profile the right way. The editor will NOT query them for
 * the new field-value key upon saving.
 *
 * To simplify this process, you will find three components in this file: LabelInput (an input text), LabelSelect (a
 * select) and LabelArea (a text area). These components already implement the required function to modify the profile's
 * copy.
 *
 * For an example of a Component that does not use these three already-made components, see InterestsForm.js
 */
export default class Editor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {closed: true};
    this.cancel = () => this.setState({closed: true});
  }

  render() {
    const profileCopy = cloneDeep(this.props.profile);  //local copy of the profile. Used when editing, and will overwrite the profile on save

    const predefCells = this.props.Cells;
    const cellKeys = Object.keys(predefCells);

    const fields = [...this.props.fields].filter(f => !cellKeys.includes(f)); //remove the fields that are redefined in Cells.

    return (
      <div>
        {
          this.state.closed
            ? ""
            : (
              <div
                style={{
                  position: "fixed",
                  left: "0px",
                  top: "0px",
                  bottom: "0px",
                  right: "0px",
                  height: "100%",
                  width: "100%",
                  zIndex: 150,
                  backgroundColor: "rgba(0,0,0,0.4)", /* Black w/ opacity */
                  color: 'black',
                  display: "flex",
                  alignItems: "center",
                }}

                onClick={this.cancel}
              >
                <div
                  style={{
                    margin: "0 auto",
                    backgroundColor: "white",
                    width: "90%",
                    maxHeight: "90%",
                    padding: "2em",
                    borderRadius: "4px",
                    border: "1px solid rgb(202, 203, 207)",
                    position: "relative",
                    overflowY: "auto",
                  }}

                  onClick={(event) => event.stopPropagation()}  //cancel parent's onClick
                >
                  <Title>
                    {(() => {
                      const temp = this.props.title;

                      if(temp === undefined) return "Edit your information";
                      else return "Edit your "+(temp.split(" ").map(t => t.charAt(0).toLowerCase() + t.slice(1, t.length)).join(" "));
                    })()}
                  </Title>
                  <div style={{display: "grid", gridTemplateColumns: "1fr", gridGap: "2em"}}>
                    { cellKeys.map(k => predefCells[k](profileCopy)) }
                    {
                      fields.length > 0 && (
                        <FieldContainer>
                          { fields.map( field => field.split(" ").map( f => <LabelInput field={f} profile={profileCopy} value={profileCopy[f]} label={toSpaceCase(f)}/>)) }
                        </FieldContainer>
                      )
                    }
                  </div>
                  <div style={{width: "100%", display: 'flex', justifyContent: "space-between", paddingTop: "2em"}}>
                    <WhiteButton onClick={this.cancel}>Cancel</WhiteButton>
                    <TealActionButton onClick={() => this.props.submit(profileCopy)}>Save</TealActionButton>
                  </div>
                </div>
              </div>
            )
        }
        <WhiteButton onClick={ () => this.setState({closed: false})}>
          <PencilIcon size={12} className="icon" /> Edit
        </WhiteButton>
      </div>
    )
  }
}

/**
 * Returns the space case conversion of a camel case word
 * @param word
 * @returns {string|string}
 */
function toSpaceCase(word) {
  let spaced = word.charAt(0).toUpperCase();

  for(let i=1; i<word.length; i++) {
    const char = word.charAt(i);

    if(char === char.toUpperCase()) spaced += " ";

    spaced += char;
  }

  return spaced;
}