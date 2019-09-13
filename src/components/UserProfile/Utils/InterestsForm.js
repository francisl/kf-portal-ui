import { Tag } from '../../../uikit/Tags';
import React from 'react';
import Row from '../../../uikit/Row';
import { LabelSelect } from './Editor';
import { DISEASE_AREAS, STUDY_SHORT_NAMES } from 'common/constants';
import { css } from 'emotion';

const defaultTextCss = css({
  fontFamily: '"Open Sans", sans-serif',
  fontSize: '13px',
  fontStyle: 'italic',
  lineHeight: 1.85,
  textAlign: 'left',
  color: 'rgb(116, 117, 125)',
  fontWeight: 'normal',
  margin: '0px',
  padding: '0px',
});

const InterestsDisplay = ({
  profile,
  onClick = i => null,
  Cell = inter => inter,
  isEditingMode,
}) => {
  if ((profile.interests || profile.interests.length === 0) && isEditingMode) {
    return (
      <div className={defaultTextCss}>
        {'Please specify Kids First studies, diseases and other areas that interest you.'}
      </div>
    );
  }
  return (
    <Row flexWrap="wrap" pt={2} pb={2}>
      {profile.interests.map((inter, index) => (
        <Tag
          key={`${inter}-${index}`}
          onClick={() => onClick(inter)}
          style={{ textTransform: 'capitalize' }}
        >
          {Cell(inter)}
        </Tag>
      ))}
    </Row>
  );
};

export { InterestsDisplay };

const InterestSuggestions = ({ label, category, currentInterests, onChange }) => (
  <LabelSelect style={{ width: '100%' }} onChange={e => onChange(e.target.value)} label={label}>
    <option value="">--- Choose Interests To Add ---</option>
    {category
      .filter(area => !currentInterests.includes(area.toLowerCase()))
      .map(area => (
        <option value={area} key={area}>
          {area}
        </option>
      ))}
  </LabelSelect>
);

function setToArray(set) {
  const arr = [];
  set.forEach(s => arr.push(s));
  return arr;
}

export default class InterestsForm extends React.Component {
  /* FIXME : redo the whole thing (see getTags to get suggestions) */
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
          Cell={i => (
            <div style={{ display: 'grid', gridAutoFlow: 'column', gridGap: '1em' }}>
              <span>{i}</span>
              <span>{'X'}</span>
            </div>
          )}
          onClick={e => this.deleteInterest(e)}
          isEditingMode={this.props.isEditingMode}
        />
        <InterestSuggestions
          onChange={value => this.addInterest(value)}
          label={'Disease Areas'}
          category={DISEASE_AREAS}
          currentInterests={profile.interests}
        />
        <InterestSuggestions
          onChange={e => this.addInterest(e)}
          label={'Studies'}
          category={STUDY_SHORT_NAMES}
          currentInterests={profile.interests}
        />
      </div>
    );
  }
}
