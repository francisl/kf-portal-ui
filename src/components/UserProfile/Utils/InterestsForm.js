import { Tag } from '../../../uikit/Tags';
import React from 'react';
import Row from '../../../uikit/Row';
import { LabelInput, LabelSelect, SuggestionItem } from './Editor';
import { DISEASE_AREAS, STUDY_SHORT_NAMES } from 'common/constants';
import override from "./override";

const InterestsDisplay = ({profile, onClick=(i)=>null, Cell=(inter)=>inter}) => (
  <Row flexWrap="wrap" pt={2} pb={2}>
    {profile.interests.map( (inter) => <Tag onClick={() => onClick(inter)} style={{textTransform: "capitalize"}}>{Cell(inter)}</Tag>)}
  </Row>
);

export {InterestsDisplay};

const InterestSuggestions = ({label, category, currentInterests, onChange}) => (
  <LabelSelect style={{width: "100%"}} onChange={(e) => onChange(e.target.value)} label={label}>
    <option value="">--- Choose Interests To Add ---</option>
    {
      category.filter(area => !currentInterests.includes(area.toLowerCase())).map(area => (
        <option value={area} key={area}>
          {area}
        </option>
      ))
    }
  </LabelSelect>
);

export class InterestsAutocomplete extends React.Component {
  constructor(props) {
    super(props);

    this.state = {suggestions: []}
    //this.getSuggestions("")
  }

  async getSuggestions(filter) {
    //const suggestions = await getTags(this.props.api)({ filter, size: 5 });
    //const loweredSuggestions = [...new Set(suggestions.values.map(x => x.value.toLowerCase()))];

    //console.log({suggestions: loweredSuggestions.filter(area => !this.props.currentInterests.includes(area.toLowerCase()))});

    this.setState({suggestions: ["interest 1", "interest 2"].filter(area => !this.props.currentInterests.includes(area.toLowerCase()))});
  }

  render() {
    return (
      <div>
        <LabelInput onChange={(e) => this.getSuggestions(e)} label={"Other interests"}/>
        <div style={{flexDirection: "row", flexWrap: "wrap"}}>
          {
            this.state.suggestions.map(s =>
              <SuggestionItem {...override(this.props, {onClick: (e) => this.props.onClick(s)})} description={s}/>
            )
          }
        </div>
      </div>
    );
  }
}

/**
 * Array.from is not supported in IE
 *
 * @param set
 * @returns {Array}
 */
function setToArray(set) {
  const arr = [];
  set.forEach(s => arr.push(s));
  return arr;
}

export default class InterestsForm extends React.Component {
  getInterests() {
    return new Set(this.props.profile.interests);
  }

  addInterest(newInterest) {
    this.props.profile.interests = setToArray(this.getInterests().add(newInterest.toLowerCase()));
    this.forceUpdate();
  }

  deleteInterest(delInterest) {
    const oldSet = this.getInterests();
    oldSet.delete(delInterest);
    this.props.profile.interests = setToArray(oldSet);
    this.forceUpdate();
  }

  render() {
    const profile = this.props.profile;

    return (
      <div>
        <InterestsDisplay
          profile={profile}
          Cell={(i) => <div style={{display: 'grid', gridAutoFlow: "column", gridGap: "1em"}}><span>{i}</span><span>{"X"}</span></div>}
          onClick={(e) => this.deleteInterest(e)}
        />
        <InterestSuggestions onChange={(e) => this.addInterest(e)} label={"Disease Areas"} category={DISEASE_AREAS} currentInterests={profile.interests}/>
        <InterestSuggestions onChange={(e) => this.addInterest(e)} label={"Studies"} category={STUDY_SHORT_NAMES} currentInterests={profile.interests}/>
        <InterestsAutocomplete onClick={(e) => this.addInterest(e)} currentInterests={profile.interests} api={this.props.api}/>
      </div>
    );
  }
}

//