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
    {profile.interests.map( (inter, i) => <Tag onClick={() => onClick(i)} style={{}}>{Cell(inter)}</Tag>)}
  </Row>
);

export {InterestsDisplay};

const InterestSuggestions = ({label, category, currentInterests, onChange}) => (
  <LabelSelect onChange={onChange} label={label}>
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
        <FieldContainer>
          {
            this.state.suggestions.map(s =>
              <SuggestionItem {...override(this.props, {onClick: (e) => this.props.onClick(s)})} description={s}/>
              )
          }
        </FieldContainer>
      </div>

    );
  }
}

export default class InterestsForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {interests: this.props.profile.interests};
  }

  getInterests() {
    return this.props.profile.interests;
  }


  changeProfileThenState(newInterests) {
    this.props.profile.interests = newInterests;
    this.setState({interests: this.props.profile.interests})
  }

  render() {
    const profile = this.props.profile;

    return (
      <div>
        <InterestsDisplay
          profile={profile}
          Cell={(i) => <div style={{display: 'grid', gridAutoFlow: "column", gridGap: "1em"}}><span>{i}</span><span>{"X"}</span></div>}
          onClick={(i) => this.changeProfileThenState(this.state.interests.length === 1 ? [] : this.state.interests.splice(i, 1))}
        />
        <InterestSuggestions onChange={(e) => this.changeProfileThenState(this.getInterests().concat(e.target.value))} label={"Disease Areas"} category={DISEASE_AREAS} currentInterests={profile.interests}/>
        <InterestSuggestions onChange={(e) => this.changeProfileThenState(this.getInterests().concat(e.target.value))} label={"Studies"} category={STUDY_SHORT_NAMES} currentInterests={profile.interests}/>
        <InterestsAutocomplete onClick={(e) => this.changeProfileThenState(this.getInterests().concat(e))} profile={profile} api={this.props.api}/>
      </div>
    );
  }
}

//