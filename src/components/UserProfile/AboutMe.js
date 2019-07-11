import React from 'react';
import { compose, withState, withPropsOnChange, withHandlers } from 'recompose';
import { withRouter } from 'react-router-dom';
import { injectState } from 'freactal';
import styled from 'react-emotion';
import { withTheme } from 'emotion-theming';

import { Container, EditButton, StyledSection, ClickToAdd, CardHeader } from './ui';
import ResearchInterests from './ResearchInterests';
import FindMe from './FindMe';
import DeleteButton from 'components/loginButtons/DeleteButton';
import { trackProfileInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';

import { Flex } from 'uikit/Core';
import Row from 'uikit/Row';
import Column from 'uikit/Column';
import EditableLabel from 'uikit/EditableLabel';
import Contact from './Contact';
import { H3, H4 } from 'uikit/Headings';
import { WhiteButton } from 'uikit/Button';
import { TealActionButton } from '../../uikit/Button';
import PrivacyWrap from './ui/PrivacyWrap';
import { Tag } from '../../uikit/Tags';
import toSpaceCase from './Utils/toSpaceCase';

const ActionBar = styled(Row)`
  justify-content: flex-end;
  border-radius: 5px;
  box-shadow: 0 0 2.9px 0.1px ${({ theme }) => theme.lightShadow};
  background-color: ${({ theme }) => theme.tertiaryBackground};
`;

const canEdit = true;
const submit = () => "";

/*
{interests.map((x, i) => (
              <Tag
                key={i}
                clickable={editingResearchInterests}
                onClick={() => editingResearchInterests && setInterests(xor(interests, [x]))}
              >
                {x}
              </Tag>
            ))}
 */

const AboutMe = ({profile, Gate}) => {

  return (
    <div style={{marginTop: "2em", margin: "0 auto", width: "76%", maxWidth: "1400px", display: "grid", gridTemplateColumns: "65% auto", gridGap: "2em"}}>
      <Gate fields={["bio", "story"]} title={"Profile"} Cell={ (f) => <div><div>My {f}</div><div>{profile.f}</div></div>}/>
      <Gate
        fields={["interests"]}
        title={"Research Interests"}
        Cell={ (f) =>
          <Row flexWrap="wrap" pt={2} pb={2}>
            {profile[f].map( (inter) => <Tag style={{}}>{inter}</Tag>)}
          </Row>}
      />
      <Gate
        title={"Contact Information"}
        fields={["institution", "addr", "institutionalEmail", "phone"]}
        Cells={
          {
            addr: () =>
                <div>
                  <div style={{lineHeight: "25.62px"}}>{[profile.addressLine1, profile.addressLine2].join(", ")}</div>
                  <div style={{lineHeight: "25.62px"}}>{[profile.city, profile.state, profile.country].filter(Boolean).join(', ')}</div>
                  <div style={{lineHeight: "25.62px"}}>{profile.zip}</div>
                </div>,
            institutionalEmail: () => <div>{profile.institutionalEmail}</div>,
            phone: () => <div>{profile.phone}</div>
          }
        }
      />
      <Gate
        fields={["website", "googleScholarId", "linkedin", "facebook", "twitter", "github", "orchid"]}
        title={"Find me on"}
        Cell={ (f) => {
          const icons = {};

          return (
            <div>
              <span style={{width: "28px", marginRight: "10px"}}>img</span><span>{profile[f]}</span>
            </div>
          )
        }}
      />
    </div>
  )

};

export default AboutMe;
//TODO change addr to composite fields

/*

export default class AboutMe extends React.Component {
  render() {
    const Gate = this.props.Gate

    return <Gate fields={["bio", "story"]} title={"Profile"} Cell={ (f) => <div><div>My {f}</div><div>{profile.f}</div></div>}/>
  }
}

 */



/*

export default compose(
  injectState,
  withState('isEditingBackgroundInfo', 'setEditingBackgroundInfo', false),
  withState('focusedTextArea', 'setFocusedTextArea', 'myBio'),
  withState('editingResearchInterests', 'setEditingResearchInterests', false),
  withHandlers({
    handleEditingBackgroundInfo: ({ setEditingBackgroundInfo }) => ({ type, value }) => {
      setEditingBackgroundInfo(value);
      trackProfileInteraction({ action: 'Profile', value, type });
    },
  }),
  withTheme,
  withState('bioTextarea', 'setBioTextarea', ({ profile }) => profile.bio || ''),
  withState('storyTextarea', 'setStoryTextarea', ({ profile }) => profile.story || ''),
  withPropsOnChange(['profile'], ({ setBioTextarea, setStoryTextarea, profile }) => {
    setBioTextarea(profile.bio || '');
    setStoryTextarea(profile.story || '');
  }),
  withRouter,
)(
  ({
    profile,
    theme,
    canEdit,
    submit,
    isEditingBackgroundInfo,
    handleEditingBackgroundInfo,
    setEditingBackgroundInfo,
    isEditingInfo,
    setFocusedTextArea,
    focusedTextArea,
    bioTextarea,
    setBioTextarea,
    storyTextarea,
    setStoryTextarea,
  }) => (
    <Flex justifyContent="center" pt={4} pb={4}>
      <Container row alignItems="flex-start">
        <Column width="65%" pt={2} pr={50} justifyContent="space-around">
          <CardHeader mb="29px">
            Profile
            {canEdit &&
              (!isEditingBackgroundInfo ? (
                <EditButton
                  onClick={() =>
                    handleEditingBackgroundInfo({
                      value: !isEditingBackgroundInfo,
                    })
                  }
                />
              ) : (
                <Flex>
                  <WhiteButton
                    mx="10px"
                    onClick={() => {
                      setBioTextarea(profile.bio || '');
                      setStoryTextarea(profile.story || '');
                      handleEditingBackgroundInfo({ value: false });
                    }}
                  >
                    Cancel
                  </WhiteButton>
                  <TealActionButton
                    onClick={async () => {
                      await submit({
                        bio: bioTextarea,
                        story: storyTextarea,
                      });
                      handleEditingBackgroundInfo({
                        value: false,
                        type: TRACKING_EVENTS.actions.save,
                      });
                    }}
                  >
                    Save
                  </TealActionButton>
                </Flex>
              ))}
          </CardHeader>



          <StyledSection>
            <H3 lineHeight="1.71" letterSpacing="0.2px">
              My bio
            </H3>
            <PrivacyWrap accessor={"bio"} profile={profile} editing={isEditingBackgroundInfo}>
              <EditableLabel
                autoFocus={focusedTextArea !== 'myStory'}
                type="textarea"
                isEditing={isEditingBackgroundInfo}
                disabled={true}
                required={false}
                name="bio"
                value={bioTextarea}
                onChange={e => setBioTextarea(e.target.value)}
                placeholderComponent={
                  canEdit && (
                    <ClickToAdd
                      onClick={() => {
                        handleEditingBackgroundInfo({
                          value: !isEditingBackgroundInfo,
                        });
                        setFocusedTextArea('myBio');
                      }}
                    >
                      click to add
                    </ClickToAdd>
                  )
                }
                saveOnKeyDown={false}
                renderButtons={() => <div />}
              />
            </PrivacyWrap>
          </StyledSection>
          <StyledSection className={'userStory'}>
            <H3 lineHeight="1.71" letterSpacing="0.2px" mt="40px">
              My story
            </H3>
            <PrivacyWrap accessor={"story"} profile={profile} editing={isEditingBackgroundInfo}>
              <EditableLabel
                autoFocus={focusedTextArea === 'myStory'}
                type="textarea"
                isEditing={isEditingBackgroundInfo}
                disabled={true}
                required={false}
                name="story"
                value={storyTextarea}
                onChange={e => setStoryTextarea(e.target.value)}
                displayButtons={true}
                placeholderComponent={
                  canEdit && (
                    <ClickToAdd
                      onClick={() => {
                        handleEditingBackgroundInfo({
                          value: !isEditingBackgroundInfo,
                        });
                        setFocusedTextArea('myStory');
                      }}
                    >
                      click to add
                    </ClickToAdd>
                  )
                }
                saveOnKeyDown={false}
                renderButtons={() => <div />}
              />
            </PrivacyWrap>
          </StyledSection>
          {localStorage.getItem('SHOW_DELETE_ACCOUNT') && (
            <div>
              <DeleteButton>Delete my account</DeleteButton>
            </div>
          )}
          {isEditingBackgroundInfo && (
            <ActionBar p={3}>
              <WhiteButton
                mx="10px"
                onClick={() => {
                  setBioTextarea(profile.bio || '');
                  setStoryTextarea(profile.story || '');
                  handleEditingBackgroundInfo({ value: false });
                }}
              >
                Cancel
              </WhiteButton>
              <TealActionButton
                onClick={async () => {
                  await submit({
                    bio: bioTextarea,
                    story: storyTextarea,
                  });
                  handleEditingBackgroundInfo({
                    value: false,
                    type: TRACKING_EVENTS.actions.save,
                  });
                }}
              >
                Save
              </TealActionButton>
            </ActionBar>
          )}
          <Contact mt={'50px'} profile={profile} canEdit={canEdit} />
        </Column>

        <Column width="35%">
          <ResearchInterests {...{ profile, canEdit, submit }} />
          {Object.keys(profile).length && <FindMe {...{ profile, canEdit, submit }} />}
        </Column>
      </Container>
    </Flex>
  ),
);
*/