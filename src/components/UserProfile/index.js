import * as React from 'react';
import { get} from 'lodash';
import { css } from 'react-emotion';

import { getProfile, updateProfile } from 'services/profiles';
import { ROLES } from 'common/constants';

import { ProfileImage } from './ui';
import AboutMe from './AboutMe';
import RoleIconButton from '../RoleIconButton';
import Error from '../Error';
import { EntityContent } from '../EntityPage';
import SecondaryNavMenu from '../../uikit/SecondaryNav/SecondaryNavMenu';
import SecondaryNavContent from '../../uikit/SecondaryNav/SecondaryNavContent';
import MemberActionBar from './ui/MemberActionBar';
import makeGate from './Utils/makeGate';
import EntityContainer from '../EntityPage/EntityContainer';
import EntityActionBar from '../EntityPage/EntityActionBar';


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
        await this.setProfile(updatedProfile);
      });
    };

    this.setProfile();
  }

  render() {

    // const values needed to build the page...
    const canEdit = this.props.userID === null;
    const location = this.props.location;
    const submit = this.submit;
    const {profile} = this.state;

    if (profile === null) return <div>Loading...</div>;
    else if(Object.entries(profile).length === 0 && profile.constructor === Object) {
      return <Error text={"404: Page not found."}/>;
    }

    console.log(profile)

    const Gate = makeGate(profile, canEdit); //TODO put editButton inside Gate if possible



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
            <ProfileImage style={{flex: "none"}} email={profile.email || ''} />
            <div style={{paddingLeft: "15px", paddingRight: "15px"}}>
              <RoleIconButton/>
              <Gate
                style={{color: 'rgb(255, 255, 255)'}}
                fields={["role", "firstName lastName", "jobTitle", "institution", "department", "city state country"]}
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
                editorCells={{
                  "city state country": () =>
                }}
              />
            </div>
          </div>

        </div>
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
        {
          canEdit
            ? (
              <EntityContent style={{backgroundColor: "red"}}>
                <SecondaryNavContent target="aboutMe" location={location}>
                  <AboutMe profile={profile} Gate={Gate} />
                </SecondaryNavContent>
                <SecondaryNavContent target="settings" location={location}>
                  <div></div>
                </SecondaryNavContent>
              </EntityContent>
            )
            : <div/>
        }
      </EntityContainer>
    )
  }
}

/*

        {(location === '#aboutMe' || location !== '#settings') && (
          <AboutMe profile={profile} canEdit={canEdit} submit={submit} />
        )}
        {location === '#settings' && <Settings profile={profile} submit={submit} />}
 */

/*
<Container row alignItems="center">
            <Row width="65%" pr={50} alignItems="center">

              <div
                className={css`
                width: 49%;
                align-items: flex-start;
                padding: 0 15px;
              `}
              >


                <H1 lineHeight="31px" mb="10px" mt="16px">
                  {`${profile.firstName} ${profile.lastName}`}
                </H1>

                <div
                  className={css`
                  font-size: 14px;
                  color: #fff;
                  line-height: 28px;
                `}
                >
                <span
                  className={css`
                    font-size: 1.4em;
                  `}
                >
                  {profile.jobTitle}
                </span>
                  <span>{profile.institution}</span>
                  <span>{profile.department}</span>
                  <span>
                  {[profile.city, profile.state, profile.country].filter(Boolean).join(', ')}
                </span>
                  <span
                    css={`
                    margin-top: 5px;
                  `}
                  ><EditButton fields={["linkedin"]}/>
                </span>
                </div>
              </div>
            </Row>

            <div
              css={`
              width: 35%;
              align-items: center;
            `}
            >
              {canEdit ?
                <div>
                  <CompletionWrapper
                    completed={percentageFilled}
                    css={`
                  width: 130px;
                `}
                  >
                    <CompleteOMeter percentage={percentageFilled} />
                  </CompletionWrapper>
                  <div
                    css={`
                  font-size: 13px;
                  font-style: italic;
                  line-height: 1.69;
                  color: #ffffff;
                  padding-top: 21px;
                `}
                  >
                    Complete your profile for a more personalized
                    <br />
                    experience and to help encourage collaboration!
                  </div>
                </div>
                : ""
              }

            </div>
          </Container>
 */