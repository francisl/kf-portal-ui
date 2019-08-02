import * as React from 'react';
import { get} from 'lodash';
import { css } from 'react-emotion';

import { getProfile, updateProfile } from 'services/profiles';
import { ROLES } from 'common/constants';

import AboutMe from './AboutMe';
import RoleIconButton from '../RoleIconButton';
import Error from '../Error';
import { EntityContent } from '../EntityPage';
import SecondaryNavMenu from '../../uikit/SecondaryNav/SecondaryNavMenu';
import SecondaryNavContent from '../../uikit/SecondaryNav/SecondaryNavContent';
import makeGate from './Utils/makeGate';
import EntityContainer from '../EntityPage/EntityContainer';
import EntityActionBar from '../EntityPage/EntityActionBar';
import AddressForm from './Utils/AddressForm';
import { FieldContainer, LabelSelect } from './Utils/Editor';
import { WhiteButton } from '../../uikit/Button';
import ExternalLink from '../../uikit/ExternalLink';
import Account from './Account';
import Gravatar from '../../uikit/Gravatar';


export const ProfileImage = ({email="", style={}}) =>
  <Gravatar style={{height: "173px", width: "173px", borderRadius: "50%", border: "5px solid #fff", ...style}} email={email} />;


export const userProfileBackground = (
  loggedInUser,
  { showBanner = true, gradientDirection = 'right' } = {},
) => {
  const role = ROLES.find(x => x.type === get(loggedInUser, 'roles[0]', '')) || {};
  const banner = get(role, 'banner', '');
  const profileColors = get(role, 'profileColors', {});
  return css`
    background-position-x: right;
    background-repeat: no-repeat;
    background-image: ${showBanner ? `url(${banner}), ` : ``}
      linear-gradient(
        to ${gradientDirection},
        ${profileColors.gradientDark} 33%,
        ${profileColors.gradientMid} 66%,
        ${profileColors.gradientLight}
      );
  `;
};

export default class UserProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {profile: null};

    console.log("THE USER FROM INDEX: "); console.log(props.userID);

    this.setProfile = async () => {
      this.setState({ profile: await getProfile(props.api)(props.userID) })
    };

    this.submit = async values => {
      await updateProfile(props.api)({
        user: {
          ...this.state.profile,
          ...values,
        },
      }).then(async updatedProfile => {
        await this.setProfile();  //grab DB's profile to make sure we're up to date (sync client-DB)
      });
    };

    this.setProfile();
  }

  render() {

    // const values needed to build the page...
    const canEdit = this.props.userID === null;
    const location = this.props.location;
    const {profile} = this.state;

    if (profile === null) return <div>Loading...</div>;
    else if(Object.entries(profile).length === 0 && profile.constructor === Object) {
      return <Error text={"404: Page not found."}/>;
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
          <div style={{display: "flex", flexDirection: 'row', width: "76%", maxWidth: "1400px"}}>
            <ProfileImage style={{flex: "none"}} email={profile.email} />
            <div style={{paddingLeft: "15px", paddingRight: "15px", flexDirection: "column", display: "flex"}}>
              <RoleIconButton style={{flexShrink: 1}}/>
              <Gate
                style={{color: 'rgb(255, 255, 255)'}}
                fields={["firstName lastName", "jobTitle", "institution", "department", "city state country"]}
                Cells={
                  {
                    "firstName lastName": () => <h1 style={{fontWeight: '500',
                      letterSpacing: '0.4px',
                      fontFamily: '"Montserrat", "sans-serif"',
                      fontSize: '28px',
                      lineHeight: '31px',
                      margin: '16px 0px 10px',
                      padding: '0px',
                      textDecoration: 'none',}}>{profile.firstName} {profile.lastName}</h1>,
                    jobTitle: () => <div style={{fontSize: "1.4em"}}>{profile.jobTitle}</div>,
                    "city state country": () => <div style={{marginTop: "1em"}}>{[profile.city, profile.state, profile.country].filter(Boolean).join(', ')}</div>
                  }
                }
                editorCells={
                  {
                    "city state country": (profile) => <AddressForm profile={profile}/>,
                    "title, gravatar": (profile) => (
                      <FieldContainer>
                        <div>
                          <ProfileImage style={{flex: "none"}} email={profile.email || ''} />
                          <WhiteButton mt="4px" w="170px">
                            <ExternalLink href="https://en.gravatar.com/site/login">change gravatar</ExternalLink>
                          </WhiteButton>
                        </div>
                        <div style={{display: "grid", gridTemplateColumns: "1fr", gridGap: "1em"}}>
                          <LabelSelect value={profile.title} field={"title"} profile={profile} label={"Title"}>
                            <option value="">N/A</option>
                            <option value="mr">Mr.</option>
                            <option value="ms">Ms.</option>
                            <option value="mrs">Mrs.</option>
                            <option value="dr">Dr.</option>
                          </LabelSelect>
                          <LabelSelect field={"roles"} value={profile.roles} profile={profile} label={"Role"}>
                            <option value="research">Researcher</option>
                            <option value="community">Community Member</option>
                            <option value="health">Healthcare Professional</option>
                            <option value="patient">Patient/Family Member</option>
                          </LabelSelect>
                        </div>

                      </FieldContainer>
                    ),
                  }
                }
              />
            </div>
          </div>
        </div>
        { canEdit &&  //problems with css injection, so components must be flat, not contained in a div, so canEdit is used like so...
          <EntityActionBar>
            <SecondaryNavMenu
              tabs={[
                { name: 'About Me', hash: 'aboutMe' },
                { name: 'Settings', hash: 'settings' }
              ]}
              defaultHash="aboutMe"
              location={location}
            />
          </EntityActionBar>
        }
        { canEdit &&
          <EntityContent style={{marginRight: 0}}>
            <SecondaryNavContent target="aboutMe" location={location}>
              <AboutMe profile={profile} Gate={Gate} api={this.props.api}/>
            </SecondaryNavContent>
            <SecondaryNavContent target="settings" location={location}>
              <Account profile={profile} submit={this.submit}/>
            </SecondaryNavContent>
          </EntityContent>
        }
        { !canEdit && <EntityContent target="aboutMe" location={location}><AboutMe profile={profile} Gate={Gate}/></EntityContent> }
      </EntityContainer>
    )
  }
}