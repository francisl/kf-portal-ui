import * as React from 'react';
import { get} from 'lodash';
import { css } from 'react-emotion';
import {
  compose,
  withState,
  withPropsOnChange,
  branch,
  renderComponent,
  withHandlers,
} from 'recompose';
import { Link, withRouter } from 'react-router-dom';
import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';

import { getProfile, updateProfile } from 'services/profiles';
import { ROLES } from 'common/constants';

import BasicInfoForm from 'components/forms/BasicInfoForm';
import CompleteOMeter from 'components/CompleteOMeter';
import { Container, ProfileImage } from './ui';
import AboutMe from './AboutMe';
import Settings from './Settings';
import CompletionWrapper from './CompletionWrapper';
import RoleIconButton from '../RoleIconButton';
import Row from 'uikit/Row';
import { H1 } from 'uikit/Headings';
import Error from '../Error';
import { WhiteButton } from '../../uikit/Button';
import PencilIcon from 'react-icons/lib/fa/pencil';
import { EntityActionBar, EntityContent } from '../EntityPage';
import ParticipantSummary from '../EntityPage/Participant/ParticipantSummary';
import ParticipantClinical from '../EntityPage/Participant/ParticipantClinical';
import SecondaryNavMenu from '../../uikit/SecondaryNav/SecondaryNavMenu';
import SecondaryNavContent from '../../uikit/SecondaryNav/SecondaryNavContent';
import MemberActionBar from './ui/MemberActionBar';

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

class Editor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {closed: true};
  }

  render() {
    console.log(this.props.fields)

    const subs = Array.isArray(this.props.fields)
      ? this.props.fields.map( field => <div><span>{field}:</span><textarea>{this.props.profile[field]}</textarea></div>)
      : "";

    return (
      <div>
        {
          this.state.closed
            ? ""
            : (
              <div
                style={{
                  position: "absolute",
                  width: "90%",
                  left: "50%",
                  transform: "translate( -50%, calc( -50% - 0.5px ) )",
                  top: "50%",
                  zIndex: 150,
                  backgroundColor: "white",
                  color: 'black',
                  height: "90%",
                  borderRadius: "1em",
                  border: "thin solid black"
                }}
              >
                {subs}
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

    // generic editing stuff
    const EditButton = canEdit  // EditButton is either empty string or an actual edit button depending on canEdit
      ? ({fields}) => <Editor profile={profile} fields={fields}/>
      : (props) => "";

    // what DON'T we want to see in a `role` page?
    const filters = {research: [], community: ["jobTitle"], health: ["jobTitle", "institution"], patient: ["jobTitle", "institution"]};

    console.log(profile)

    const Gate = ({fields, title, Cell = (f) => <div>{f}: {profile[f]}</div>, Cells = {}, style={}}) => {
      fields = fields.filter( f => {
        if(f.includes(" ")) return true;
        else return !filters[profile.roles[0]].includes(f)
      });

      const flexStyle = {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      };

      const display = fields.map( f => {
          if(f in Cells) return Cells[f](profile);
          else return Cell(f);
        }
      );

      if(title === "" || title === undefined) return (
        <div style={{...style, ...flexStyle}}>
          <div>{display}</div>
          <EditButton fields={fields}/>
        </div>
      );

      return (
        <div style={style}>
          <h2 style={{...flexStyle,
              color: "rgb(43, 56, 143)",
              fontWeight: "500",
              fontFamily: '"Montserrat", "sans-serif"',
              fontSize: "22px",
              lineHeight: "1.27",
              letterSpacing: "0.3px",
              margin: "13px 0px 29px",
              padding: "0px 0px 10px",
              textDecoration: "none",
              borderBottom: "1px solid rgb(212, 214, 221)"
            }}
          >
            {title}<EditButton fields={fields}/>
          </h2>
          {display}
        </div>
      )
    };

    //return <Gate fields={["firstName lastName"]} title={"Test"} Cells={ {"firstName lastName": (profile) => <div>{profile.firstName} {profile.lastName}</div>} }/>;

    const percentageFilled = (() => {

      if(!canEdit) return 1; //don't calculate completion if we won't even display it

      /* If we want the exact same as before this PR

      const filledFields = objKeys.reduce( (acc, key) => {
        const v = profile[key];

        if((isArray(v) && v.length) || (!isArray(v) && v)) return acc + 1;
        else return acc;
      }, 0);

      const countFields = objKeys.length;

      return filledFields / countFields;

      otherwise:
       */

      /**
       * Does the key count as filled?
       * @param key
       * @returns {boolean}
       */
      function counts(key) {
        const value = profile[key];

        //value gates
        if(
          value === null ||
          value === undefined ||
          (Array.isArray(value) && value.length === 0)  ||
          value === ""
        ) return false;

        //key gates
        return true;
      }

      const unimportantKeys = new Set(
        [
          "_id", "acceptedDatasetSubscriptionKfOptIn", "acceptedKfOptIn", "acceptedNihOptIn", "egoId",
          "eraCommonsID", "orchid", "acceptedTerms"
        ]
      );

      /**
       * Is the key interesting?
       * @param key
       * @returns {boolean}
       */
      function interestingKey(key) {
        return !unimportantKeys.has(key);
      }

      const filledAndKeys = Object.keys(profile).reduce( (acc, key) => {
        if(interestingKey(key)) {   //increment the number of interesting fields
          acc[1]++;
          if(counts(key)) acc[0]++; //increment the number of filled interesting fields;

        }//if the key isn't interesting, then don't increment the filled interesting fields

        return acc;
      }, [0,0]);  //acc is [nb of filled interesting fields, nb of interesting fields]

      return filledAndKeys[0]/filledAndKeys[1];
    })();

    return (
      <div
        className={css`
        flex: 1;
      `}
      >
        <div
          className={css`
          ${userProfileBackground(profile)};
          min-height: 330px;
          align-items: center;
          display: flex;
          justify-content: center;
        `}
        >
          <div style={{display: "flex", flexDirection: 'row', width: "65%"}}>
            <ProfileImage style={{flex: "none"}} email={profile.email || ''} />
            <div style={{paddingLeft: "15px", paddingRight: "15px"}}>
              <RoleIconButton/>
              <Gate
                style={{color: 'rgb(255, 255, 255)'}}
                fields={["flname", "jobTitle", "institution", "department", "addr"]}
                Cells={
                  {
                    flname: (profile) => <h1 style={{fontWeight: '500',
                      letterSpacing: '0.4px',
                      fontFamily: '"Montserrat", "sans-serif"',
                      fontSize: '28px',
                      lineHeight: '31px',
                      margin: '16px 0px 10px',
                      padding: '0px',
                      textDecoration: 'none',}}>{profile.firstName} {profile.lastName}</h1>,
                    jobTitle: (profile) => <div style={{fontSize: "1.4em"}}>{profile.jobTitle}</div>,
                    addr: (profile) => <div style={{marginTop: "1em"}}>{[profile.city, profile.state, profile.country].filter(Boolean).join(', ')}</div>
                  }
                }
                Cell={ (f) => <div style={{marginTop: "1em"}}>{profile[f]}</div>}
              />
            </div>
          </div>

        </div>
        <MemberActionBar>
          <SecondaryNavMenu
            tabs={[
              { name: 'About Me', hash: 'aboutMe' },
              { name: 'Settings', hash: 'settings' }
            ]}
            defaultHash="aboutMe"
            location={location}
          />
        </MemberActionBar>
        <EntityContent>
          <SecondaryNavContent target="aboutMe" location={location}>
            <AboutMe profile={profile} canEdit={canEdit} submit={submit} />
          </SecondaryNavContent>
          <SecondaryNavContent target="settings" location={location}>
            <div/>
          </SecondaryNavContent>
        </EntityContent>

      </div>
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