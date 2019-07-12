import React from 'react';
import Row from 'uikit/Row';
import { Tag } from '../../uikit/Tags';

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