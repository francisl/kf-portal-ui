import { Tag } from '../../../uikit/Tags';
import React from 'react';
import Row from '../../../uikit/Row';
import { InterestsAutocomplete2 } from '../InterestsAutocomplete';
import { FieldContainer, LabelInput, LabelSelect, SuggestionItem } from './Editor';
import { DISEASE_AREAS, STUDY_SHORT_NAMES } from 'common/constants';
import { difference } from 'lodash';
import { getTags } from '../../../services/profiles';
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
    //this.getSuggestions("syn")
  }

  async getSuggestions(filter) {
    const suggestions = await getTags(this.props.api)({ filter, size: 5 });
    console.log(suggestions);
    console.log(this.props.profile.interests);
    const loweredSuggestions = [...new Set(suggestions.values.map(x => x.value.toLowerCase()))];

    console.log({suggestions: difference(loweredSuggestions, this.props.profile.interests)});

    this.setState({suggestions: ["interest 1", "interest 2"]});
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

export default class InterestsForm extends React.Component {
  constructor(props) {
    super(props);
  }

  getInterests() {
    return new Set(this.props.profile.interests);
  }

  addInterest(newInterest) {
    this.props.profile.interests = Array.from(this.getInterests().add(newInterest));
    this.setState({});  //trigger re-render
  }

  deleteInterest(delInterest) {
    const oldSet = this.getInterests();
    oldSet.delete(delInterest);
    this.props.profile.interests = Array.from(oldSet);
    this.setState({});  ////trigger re-render
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
        <InterestsAutocomplete onClick={(e) => this.addInterest(e)} profile={profile} api={this.props.api}/>
      </div>
    );
  }
}

//