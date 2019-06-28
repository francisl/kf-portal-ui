import * as React from 'react';
import { compose, withState } from 'recompose';
import { Trans } from 'react-i18next';
import { injectState } from 'freactal';

import { CardHeader } from './ui';
import IntegrationTable from './UserIntegrations/IntegrationTable';
import Gen3Integration from './UserIntegrations/Items/Gen3Integration';
import DcfIntegration from './UserIntegrations/Items/DcfIntegration';
import CavaticaIntegration from './UserIntegrations/Items/CavaticaIntegration';
import ConnectedWithBadge from './ConnectedWithBadge';

import { fenceConnectionInitializeHoc } from 'stateProviders/provideFenceConnections';
import { withApi } from 'services/api';
import { Box } from 'uikit/Core';
import Row from 'uikit/Row';
import Column from 'uikit/Column';
import Input from 'uikit/Input';
import styled from 'react-emotion';
import ExternalLink from 'uikit/ExternalLink';
import { gen3WebRoot } from 'common/injectGlobals';
import CheckboxBubble from '../../uikit/CheckboxBubble';
import { Field } from 'formik';
import { Paragraph } from '../../uikit/Core';
import { updateProfile } from '../../services/profiles';


import { Button } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

const CardBody = styled('div')`
  margin: -15px 0 15px 0;
  font-family: Montserrat, sans-serif, sans-serif;
  font-size: 13px;
`;

const Label = styled('label')`
  margin-left: 10px;
  font-size: 14px;
`;

const FormParagraph = styled(Paragraph)`
  line-height: 26px;
  font-size: 14px;
`;

class Toggle extends React.Component {
  constructor(props) {
    super(props);

    this.state = {active: props.checked}
  }

  render() {

    return (
      <Button toggle active={this.state.active} onClick={() => {
        this.props.onClick(!this.state.active);
        this.setState(prevState => ({ active: !prevState.active }))
      }}>
        {this.state.active ? "Public" : "Private"}
      </Button>
    )
  }
}

/*
<CheckboxBubble
            style={{transition: "all 2s ease-in"}}
            active={profile.isPublic}
            onClick={(event) => {
              event.target.style.background = "linear-gradient(90deg, #FFC0CB 50%, #00FFFF 50%)";
              console.log(event.target.style)
            }}
          >
            <input type="checkbox" checked={profile.isPublic} />
            <Label>
              <FormParagraph>
                {' heyo my dude '}
              </FormParagraph>
            </Label>
          </CheckboxBubble>
 */

const SettingsSection = x => <Column justifyContent="stretch" w="100%" pb={4} {...x} />;

export default compose(
  injectState,
  withApi,
  withState('mode', 'setMode', 'account'),
  fenceConnectionInitializeHoc,
)(({ profile, api, submit, mode, setMode, state: { loginProvider }, ...props }) => (
  <Box style={{ maxWidth: 1050 }} pr={4} pl={0} pt="8px">
    <SettingsSection>
      <CardHeader mb="43px">
        <Trans>Account Login</Trans>
      </CardHeader>
      <Column>
        Email Address:
        <Row alignItems="center" mt={2}>
          <Input disabled value={profile.email} />
          <Box ml={3}>
            <ConnectedWithBadge provider={loginProvider} />
          </Box>
        </Row>
      </Column>
    </SettingsSection>

    <SettingsSection>
      <CardHeader mb="43px">
        <Trans>Privacy</Trans>
      </CardHeader>
      <Column>
        Privacy:
        <Row alignItems="center" mt={2} >

          <Paragraph>
            When your profile is public, other logged in Kids First members (and potential contributors) will be able to
            find your profile in searches. Turn this feature off if you would prefer to remain private and unsearchable.
          </Paragraph>
          <Toggle checked={profile.isPublic} onClick={ (checked) => {
                profile.isPublic = checked;
                submit({...profile});
              }
            }
          />

        </Row>
      </Column>
    </SettingsSection>

    <SettingsSection>
      <CardHeader mt="22px" mb="31px">
        <Trans>Data Repository Integrations</Trans>
      </CardHeader>
      <CardBody>
        The Kids First DRC provides the ability to integrate across different data repositories for
        pediatric research. By connecting to each integration (powered by{' '}
        <ExternalLink href={gen3WebRoot}>Gen3</ExternalLink>), you will immediately have the ability
        to analyze the data available from these repositories in Cavatica through this portal.
        Please remember that it is your responsibility to follow any data use limitations with
        controlled access data.
      </CardBody>

      <IntegrationTable>
        <Gen3Integration />
        <DcfIntegration />
      </IntegrationTable>
    </SettingsSection>

    <SettingsSection>
      <CardHeader mt="22px" mb="31px">
        <Trans>Application Integrations</Trans>
      </CardHeader>

      <IntegrationTable>
        <CavaticaIntegration />
      </IntegrationTable>
    </SettingsSection>
  </Box>
));
