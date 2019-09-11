import React from 'react';
import { css } from 'react-emotion';
import { getProfile, updateProfile } from 'services/profiles';
import AboutMe from './AboutMe';
import RoleIconButton from '../RoleIconButton';
import Error from '../Error';
import { EntityContent } from '../EntityPage';
import SecondaryNavMenu from 'uikit/SecondaryNav/SecondaryNavMenu';
import SecondaryNavContent from 'uikit/SecondaryNav/SecondaryNavContent';
import makeGate from './Utils/makeGate';
import EntityContainer from '../EntityPage/EntityContainer';
import EntityActionBar from '../EntityPage/EntityActionBar';
import AddressForm from './Utils/AddressForm';
import { FieldContainer, LabelSelect } from './Utils/Editor';
import { WhiteButton } from 'uikit/Button';
import ExternalLink from 'uikit/ExternalLink';
import Account from './Account';
import {
  getRoleTypeFromProfile,
  userProfileBackground,
  isProfileToBeRefreshed,
} from './Utils/utils';
import { ProfileImage } from './Utils/ProfileImage';
import inRange from 'lodash/inRange';

export default class UserProfile extends React.Component {
  state = { profile: null, error: null };

  submit = async values => {
    const { api } = this.props;
    const { profile } = this.state;

    const updatedProfile = await updateProfile(api)({
      user: {
        ...profile,
        ...values,
      },
    });
    this.setState({ profile: updatedProfile });
  };

  fetchProfile = async () => {
    const { api, userID } = this.props;
    let fetchedProfile;
    try {
      fetchedProfile = await getProfile(api)(userID);
      this.setState({ profile: fetchedProfile, error: null });
    } catch (e) {
      this.setState({ error: e });
    }
  };

  async componentDidMount() {
    this.fetchProfile();
  }

  async componentDidUpdate(prevProps) {
    if (isProfileToBeRefreshed(prevProps.location, this.props.location)) {
      this.fetchProfile();
    }
  }

  render() {
    const canEdit = this.props.userID === null;
    const location = this.props.location;
    const { profile, error } = this.state;

    if (error) {
      const errorStatus = error.response.status;
      const text = inRange(errorStatus, 400) ? error.message : undefined;
      return <Error text={text} />;
    } else if (profile === null) {
      return <div>Loading...</div>;
    } else if (Object.keys(profile || {}).length === 0) {
      return <Error text={'404: Page not found.'} />;
    }

    const Gate = makeGate(profile, canEdit, this.submit);

    return (
      <EntityContainer>
        <div
          className={css`
            ${userProfileBackground(profile)};
            min-height: 330px;
            width: 100%;
            align-items: center;
            display: flex;
            justify-content: center;
          `}
        >
          <div style={{ display: 'flex', flexDirection: 'row', width: '76%', maxWidth: '1400px' }}>
            <ProfileImage style={{ flex: 'none' }} email={profile.email} />
            <div
              style={{
                paddingLeft: '15px',
                paddingRight: '15px',
                flexDirection: 'column',
                display: 'flex',
              }}
            >
              <RoleIconButton
                style={{ flexShrink: 1 }}
                roleType={getRoleTypeFromProfile(profile)}
              />
              <Gate
                style={{ color: 'rgb(255, 255, 255)' }}
                fields={[
                  'firstName lastName',
                  'jobTitle',
                  'institution',
                  'department',
                  'city state country',
                ]}
                Cells={{
                  'firstName lastName': keyBuiltFromField => (
                    <h1
                      key={keyBuiltFromField}
                      style={{
                        fontWeight: '500',
                        letterSpacing: '0.4px',
                        fontFamily: '"Montserrat", "sans-serif"',
                        fontSize: '28px',
                        lineHeight: '31px',
                        margin: '16px 0px 10px',
                        padding: '0px',
                        textDecoration: 'none',
                      }}
                    >
                      {profile.firstName} {profile.lastName}
                    </h1>
                  ),
                  jobTitle: keyBuiltFromField => (
                    <div key={keyBuiltFromField} style={{ fontSize: '1.4em' }}>
                      {profile.jobTitle}
                    </div>
                  ),
                  'city state country': keyBuiltFromField => (
                    <div key={keyBuiltFromField} style={{ marginTop: '1em' }}>
                      {[profile.city, profile.state, profile.country].filter(Boolean).join(', ')}
                    </div>
                  ),
                }}
                editorCells={{
                  'city state country': (profile, keyBuiltFromField) => (
                    <AddressForm key={keyBuiltFromField} profile={profile} />
                  ),
                  'title, gravatar': (profile, keyBuiltFromField) => (
                    <FieldContainer key={keyBuiltFromField}>
                      <div>
                        <ProfileImage style={{ flex: 'none' }} email={profile.email || ''} />
                        <WhiteButton mt="4px" w="170px">
                          <ExternalLink href="https://en.gravatar.com/site/login">
                            change gravatar
                          </ExternalLink>
                        </WhiteButton>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gridGap: '1em' }}>
                        <LabelSelect
                          value={profile.title}
                          field={'title'}
                          profile={profile}
                          label={'Title'}
                        >
                          <option value="">N/A</option>
                          <option value="mr">Mr.</option>
                          <option value="ms">Ms.</option>
                          <option value="mrs">Mrs.</option>
                          <option value="dr">Dr.</option>
                        </LabelSelect>
                        <LabelSelect
                          field={'roles'}
                          value={getRoleTypeFromProfile(profile)}
                          profile={profile}
                          label={'Role'}
                        >
                          <option value="research">Researcher</option>
                          <option value="community">Community Member</option>
                          <option value="health">Healthcare Professional</option>
                          <option value="patient">Patient/Family Member</option>
                        </LabelSelect>
                      </div>
                    </FieldContainer>
                  ),
                }}
              />
            </div>
          </div>
        </div>
        {canEdit && ( //problems with css injection, so components must be flat, not contained in a div, so canEdit is used like so...
          <EntityActionBar>
            <SecondaryNavMenu
              tabs={[{ name: 'About Me', hash: 'aboutMe' }, { name: 'Settings', hash: 'settings' }]}
              defaultHash="aboutMe"
              location={location}
            />
          </EntityActionBar>
        )}
        {canEdit && (
          <EntityContent style={{ marginRight: 0 }}>
            <SecondaryNavContent target="aboutMe" location={location}>
              <AboutMe profile={profile} Gate={Gate} api={this.props.api} />
            </SecondaryNavContent>
            <SecondaryNavContent target="settings" location={location}>
              <Account profile={profile} submit={this.submit} />
            </SecondaryNavContent>
          </EntityContent>
        )}
        {!canEdit && (
          <EntityContent target="aboutMe" location={location}>
            <AboutMe profile={profile} Gate={Gate} />
          </EntityContent>
        )}
      </EntityContainer>
    );
  }
}
