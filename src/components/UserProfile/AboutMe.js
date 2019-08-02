import React from 'react';
import AddressForm from './Utils/AddressForm';
import { LabelTextArea } from './Utils/Editor';
import WebsiteIcon from '../../icons/WebsiteIcon';
import GoogleScholarIcon from '../../icons/GoogleScholarIcon';
import LinkedInIcon from '../../icons/LinkedInIcon';
import { SocialIcon } from 'react-social-icons';
import { kfFacebook, kfTwitter, kfGithub } from 'common/injectGlobals';
import orchidIcon from 'assets/icon-findemeon-orchid.png';
import ExternalLink from '../../uikit/ExternalLink';
import MapMarkerIcon from '../../icons/MapMarkerIcon';
import EnvelopeIcon from '../../icons/EnvelopeIcon';
import PhoneIcon from '../../icons/PhoneIcon';
import CommunityIcon from '../../icons/CommunityIcon';

import InterestsForm, { InterestsDisplay } from './Utils/InterestsForm';

const ContactContainer = (props) => <div style={{display: "grid", gridTemplateColumns: "1em auto", gridGap: "1em"}}{...props}/>;

const AboutMe = ({profile, Gate, api}) => {

  return (
    <div style={{display: "grid", gridTemplateColumns: "65% auto", gridGap: "2em"}}>
      <Gate
        fields={["bio", "story"]}
        title={"Profile"}
        Cell={ (f) => <div style={{marginBottom: "1em"}}><h3 style={{color: "rgb(43, 56, 143)"}}>My {f}</h3><div>{profile[f]}</div></div>}
        editorCells={
          {
            bio: (profile) => <LabelTextArea field={"bio"} profile={profile} label={"Bio"} value={profile.bio} type={"text"}/>,
            story: (profile) => <LabelTextArea field={"story"} profile={profile} label={"Story"} value={profile.story} type={"text"}/>
          }
        }
      />
      <Gate
        fields={["interests"]}
        title={"Research Interests"}
        Cell={ (f) => <InterestsDisplay profile={profile}/>}
        editorCells={
          {
            interests: (profile) => <InterestsForm profile={profile} api={api}/>
          }
        }
      />
      <Gate
        title={"Contact Information"}
        fields={["institution", "addr", "institutionalEmail", "phone"]}
        Cells={
          {
            institution: () => (
              <ContactContainer>
                <CommunityIcon height={"16px"} fill={"#a42c90"} style={{margin: 0}}/>
                <div>{profile.institution}</div>
              </ContactContainer>
            ),
            addr: () => (
              <ContactContainer>
                <MapMarkerIcon height={'17px'} />
                <div>
                  <div style={{lineHeight: "25.62px"}}>{[profile.addressLine1, profile.addressLine2].filter(ele => !!ele).join(", ")}</div>
                  <div style={{lineHeight: "25.62px"}}>{[profile.city, profile.state, profile.country].filter(ele => !!ele).join(', ')}</div>
                  {profile.zip && <div style={{lineHeight: "25.62px"}}>{profile.zip}</div>}
                </div>
              </ContactContainer>
            ),
            institutionalEmail: () => (
              <ContactContainer>
                <EnvelopeIcon height={'10px'}/>
                <div>{profile.institutionalEmail}</div>
              </ContactContainer>
            ),
            phone: () => (
              <ContactContainer>
                <PhoneIcon height={'12px'}/>
                <div>{profile.phone}</div>
              </ContactContainer>
            ),
          }
        }
        editorCells={
          {
            addr: (profile) => <AddressForm profile={profile}/>
          }
        }
      />
      <Gate
        fields={["website", "googleScholarId", "linkedin", "facebook", "twitter", "github", "orchid"]}
        title={"Find me on"}
        Cell={ (f) => {
          const icons = {
            website: <WebsiteIcon height={28} width={28}/>,
            googleScholarID: <GoogleScholarIcon height={28} width={28}/>,
            linkedin: <LinkedInIcon height={28} width={28}/>,
            facebook: <SocialIcon url={kfFacebook} style={{ width: 28, height: 28}}/>,
            twitter: <SocialIcon url={kfTwitter} style={{ width: 28, height: 28}}/>,
            github: <SocialIcon url={kfGithub} style={{ width: 28, height: 28}}/>,
            orchid: <img alt="ORCHID" src={orchidIcon} height={28}/>
          };

          return (
            <div style={{flexDirection: "row", display: "flex"}}>
              <div>{icons[f]}</div>
              <div style={{display: "flex", flexDirection: "column", justifyContent: "space-around", paddingLeft: "1em"}}>
                <ExternalLink href={profile[f]}>
                  {profile[f]}
                </ExternalLink>
              </div>
            </div>
          )
        }}
      />
    </div>
  )
};

export default AboutMe;