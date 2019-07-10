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
    const hash = this.props.location.hash;
    const setModal = this.props.setModal;
    const submit = this.submit;
    const api = this.props.api;
    const {profile} = this.state;

    if (profile === null) return <div>Loading...</div>;
    else if(Object.entries(profile).length === 0 && profile.constructor === Object) {
      return <Error text={"404: Page not found."}/>;
    }

    // generic editing stuff
    const EditButton = canEdit  // EditButton is either empty string or an actual edit button depending on canEdit
      ? ({fields}) => {
          return (
            <Editor profile={profile} fields={fields}/>
          )
        }
      : (props) => "";



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
          <Container row alignItems="center">
            <Row width="65%" pr={50} alignItems="center">
              <ProfileImage email={profile.email || ''} />
              <div
                className={css`
                width: 49%;
                align-items: flex-start;
                padding: 0 15px;
              `}
              >
                <RoleIconButton />

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
        </div>
        {
          canEdit ?
            <div
              className={css`
          display: flex;
          justify-content: center;
          align-items: flex-start;
          background: #fff;
          box-shadow: 0px 0px 4.9px 0.1px #bbbbbb;
          border: solid 1px #e0e1e6;
        `}
            >
              <Container>
                <ul >
                  <li>
                    <Link
                      to="#aboutMe"
                      className={hash === '#aboutMe' || hash !== '#settings' ? 'active' : ''}
                    >
                      About Me
                    </Link>
                  </li>
                  {canEdit && (
                    <li>
                      <Link to="#settings" className={hash === '#settings' ? 'active' : ''}>
                        Settings & Privacy
                      </Link>
                    </li>
                  )}
                </ul>
              </Container>
            </div>
            : ""
        }

        {(hash === '#aboutMe' || hash !== '#settings') && (
          <AboutMe profile={profile} canEdit={canEdit} submit={submit} />
        )}
        {hash === '#settings' && <Settings profile={profile} submit={submit} />}
      </div>
    )
  }


}
