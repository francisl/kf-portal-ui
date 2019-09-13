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
import { css } from 'emotion';
import InterestsForm, { InterestsDisplay } from './Utils/InterestsForm';

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

const socialIconCss = css({
  width: 28,
  height: 28,
});

const FIELDS_TO_ICON = {
  website: <WebsiteIcon height={28} width={28} />,
  googleScholarID: <GoogleScholarIcon height={28} width={28} />,
  linkedin: <LinkedInIcon height={28} width={28} />,
  facebook: <SocialIcon url={kfFacebook} className={socialIconCss} />,
  twitter: <SocialIcon url={kfTwitter} className={socialIconCss} />,
  github: <SocialIcon url={kfGithub} className={socialIconCss} />,
  orchid: <img alt="ORCHID" src={orchidIcon} height={28} />,
};

const contactContainerCss = css({
  display: 'grid',
  gridTemplateColumns: '1em auto',
  gridGap: '1em',
  marginBottom: '10px',
});

const findMeContainerCss = css({ flexDirection: 'row', display: 'flex' });
const findMeExternalLinkContainerCss = css({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
  paddingLeft: '1em',
});

const aboutMeContainerCss = css({
  display: 'grid',
  gridTemplateColumns: '65% auto',
  gridGap: '2em',
  marginTop: '15px',
});

const bioStoryContainerCss = css({ marginBottom: '1em' });

const addrFieldCss = css({ lineHeight: '25.62px' });

const boxStyle = {
  boxShadow: 'rgb(160, 160, 163) 0px 0px 2.9px 0.1px',
  marginBottom: '15px',
  padding: '16px',
  borderRadius: '5px',
};

const showBox = show => (show ? boxStyle : null);

const ContactContainer = ({ children }) => (
  <div className={contactContainerCss} children={children} />
);

const AboutMe = ({ profile, Gate, api, isEditingMode }) => {
  return (
    <div className={aboutMeContainerCss}>
      <Gate
        fields={['bio', 'story']}
        title={'Profile'}
        Cell={f => {
          const isDefaultUsed = isEditingMode && !Boolean(profile[f]);
          return (
            <div key={f} className={bioStoryContainerCss}>
              <h3 style={{ color: 'rgb(43, 56, 143)' }}>My {f}</h3>
              <div className={isDefaultUsed ? defaultTextCss : ''}>
                {isDefaultUsed
                  ? {
                      bio:
                        'Share information about your professional background and your research interests.',
                      story:
                        'Share information about your professional background and your research interests.',
                    }[f]
                  : profile[f]}
              </div>
            </div>
          );
        }}
        editorCells={{
          bio: (profile, keyBuiltFromField) => (
            <LabelTextArea
              key={keyBuiltFromField}
              field={'bio'}
              profile={profile}
              label={'Bio'}
              value={profile.bio}
              type={'text'}
            />
          ),
          story: (profile, keyBuiltFromField) => (
            <LabelTextArea
              key={keyBuiltFromField}
              field={'story'}
              profile={profile}
              label={'Story'}
              value={profile.story}
              type={'text'}
            />
          ),
        }}
      />
      <Gate
        style={showBox(isEditingMode)}
        fields={['interests']}
        title={'Research Interests'}
        Cell={f => <InterestsDisplay key={f} profile={profile} isEditingMode={isEditingMode} />}
        editorCells={{
          interests: profile => (
            <InterestsForm profile={profile} api={api} isEditingMode={isEditingMode} />
          ),
        }}
      />
      <Gate
        title={'Contact Information'}
        fields={['institution', 'addr', 'institutionalEmail', 'phone']}
        Cells={{
          institution: keyBuiltFromField => (
            <ContactContainer key={keyBuiltFromField}>
              <CommunityIcon height={'16px'} fill={'#a42c90'} style={{ margin: 0 }} />
              <div>{profile.institution}</div>
            </ContactContainer>
          ),
          addr: keyBuiltFromField => {
            return ['addressLine1', 'addressLine2', 'city', 'state', 'country', 'zip'].some(
              fieldName => !!profile[fieldName],
            ) ? (
              <ContactContainer key={keyBuiltFromField}>
                <MapMarkerIcon height={'17px'} />
                <div>
                  <div className={addrFieldCss}>
                    {[profile.addressLine1, profile.addressLine2].filter(ele => !!ele).join(', ')}
                  </div>
                  <div className={addrFieldCss}>
                    {[profile.city, profile.state, profile.country].filter(ele => !!ele).join(', ')}
                  </div>
                  {profile.zip && <div className={addrFieldCss}>{profile.zip}</div>}
                </div>
              </ContactContainer>
            ) : null;
          },
          institutionalEmail: keyBuiltFromField => (
            <ContactContainer key={keyBuiltFromField}>
              <EnvelopeIcon height={'10px'} />
              <ExternalLink href={`mailto:${profile.institutionalEmail}`}>
                {profile.institutionalEmail}
              </ExternalLink>
            </ContactContainer>
          ),
          phone: keyBuiltFromField => (
            <ContactContainer key={keyBuiltFromField}>
              <PhoneIcon height={'12px'} />
              <div>{profile.phone}</div>
            </ContactContainer>
          ),
        }}
        editorCells={{
          addr: profile => <AddressForm profile={profile} />,
        }}
      />
      {isEditingMode &&
      ['website', 'googleScholarId', 'linkedin', 'facebook', 'twitter', 'github', 'orchid'].every(
        profileKey => !Boolean(profile[profileKey]),
      ) ? (
        <Gate
          style={boxStyle}
          fields={[
            'findMe',
            'website',
            'googleScholarId',
            'linkedin',
            'facebook',
            'twitter',
            'github',
            'orchid',
          ]}
          title={'Find me on'}
          Cell={f => {
            return (
              <div className={defaultTextCss} key={f}>
                {
                  'Add links to your personal channels such as Google Scholar, ORCID ID, GitHub, LinkedIn, Twitter and Facebook.'
                }
              </div>
            );
          }}
        />
      ) : (
        <Gate
          style={showBox(isEditingMode)}
          fields={[
            'website',
            'googleScholarId',
            'linkedin',
            'facebook',
            'twitter',
            'github',
            'orchid',
          ]}
          title={'Find me on'}
          Cell={f => {
            return (
              <div key={f} className={findMeContainerCss}>
                <div>{FIELDS_TO_ICON[f]}</div>
                <div className={findMeExternalLinkContainerCss}>
                  <ExternalLink href={profile[f]}>{profile[f]}</ExternalLink>
                </div>
              </div>
            );
          }}
        />
      )}
    </div>
  );
};

export default AboutMe;
