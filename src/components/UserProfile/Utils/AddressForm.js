import React, { Fragment } from 'react';

import { injectState } from 'freactal';
import { compose, withState } from 'recompose';
import { withFormik, Field } from 'formik';
import { withTheme } from 'emotion-theming';
import PlacesAutocomplete, { geocodeByAddress, geocodeByPlaceId, getLatLng } from 'react-places-autocomplete';
import { width, space } from 'styled-system';
import SearchIcon from 'react-icons/lib/fa/search';

import scriptjs from 'scriptjs';

import styled from 'react-emotion';

import Row from 'uikit/Row';
import Column from 'uikit/Column';
import { ROLES } from 'common/constants';
import { googleMapsKey } from 'common/injectGlobals';
import { updateProfile } from 'services/profiles';
import {
  TRACKING_EVENTS,
  trackUserInteraction,
  addStateInfo as updateTrackingInfo,
} from 'services/analyticsTracking';
import Gravtar from 'uikit/Gravatar';
import ExternalLink from 'uikit/ExternalLink';
import { withApi } from 'services/api';
import { Box } from 'uikit/Core';
import { FilterInput } from '../../../uikit/Input';
import { WhiteButton } from '../../../uikit/Button';
import { ModalFooter } from '../../Modal';
import { FieldContainer, LabelInput } from './Editor';

const labelStyle = `
  font-size: 14px;
  letter-spacing: 0.2px;
  text-align: left;
  font-weight: 700;
`;

const StyledLabel = styled('label')`
  ${labelStyle};
  color: ${({ theme }) => theme.greyScale1};
`;

const AddressBox = styled(Box)`
  background: ${({ theme }) => theme.tertiaryBackground};
  padding: 20px;
  margin: 10px 0 10px 0;
  border-left: 4px solid ${({ theme }) => theme.primary};
`;

const AddressRow = styled(Row)`
  justify-content: space-between;
`;

const FormItem = styled(Column)`
  padding: 5px 0 5px;
`;

const FieldInput = styled(Field)`
  ${({ theme }) => theme.input};
  ${width};
  ${space};
`;

const SearchLocationIcon = styled(SearchIcon)`
  position: absolute;
  top: 8px;
  left: 8px;
`;

const LocationFieldInput = styled(FilterInput)`
  width: 90%;
  padding-left: 34px;
`;

const AutoCompleteContainer = styled(Column)`
  position: absolute;
  top: 100%;
  background-color: ${({ theme }) => theme.white};
  border: 1px solid ${({ theme }) => theme.greyScale4};
  width: 100%;
`;

const AutoCompleteItem = styled(Row)`
  background-color: ${({ isSelected, theme }) => (isSelected ? theme.greyScale4 : theme.white)};
  padding: 10px;
`;

const ContentRow = styled(Row)`
  margin-bottom: 20px;
  z-index: 1;
  position: relative;
  min-height: 0;
`;

class WrappedPlacesAutocomplete extends React.Component {
  //https://github.com/kenny-hibino/react-places-autocomplete/pull/107
  state = {
    loaded: false,
  };

  componentDidMount() {
    scriptjs(
      `https://maps.googleapis.com/maps/api/js?key=${googleMapsKey}&libraries=places`,
      () => {
        this.setState({
          loaded: true,
        });
      },
    );
  }

  render() {
    if (!this.state.loaded) return null;
    return <PlacesAutocomplete {...this.props}>{this.props.children}</PlacesAutocomplete>;
  }
}

class SuggestionItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {hovered: false};
  }

  render() {
    const hoverStyle = this.state.hovered ? {backgroundColor: "lightgray"} : {backgroundColor: "white"};
    const style = this.props.style === undefined ? hoverStyle : {...this.props.style, ...hoverStyle};

    return (
      <div
        {...this.props.getSuggestionItemProps(this.props.suggestion,
          {
            style,
            onMouseEnter: () => this.setState({ hovered: true }),
            onMouseLeave: () => this.setState({ hovered: false })
          })
        }
      >
        <span>{this.props.suggestion.description}</span>
      </div>
    )
  }
}

export default class AddressForm extends React.Component {
  constructor(props) {
    super(props);

    const {
      addressLine1,
      addressLine2,
      country,
      state,
      city,
      zip,
    } = this.props.profile || "";

    this.state = {addressLine1, addressLine2, country, city, state, zip};
    this.updateState = (state, callback) => this.setState({...this.state, ...state}, callback);
  }

  handleChange = address => {
    this.updateState({ address });
  };

  handleSelect = (address, placeID) => {
    geocodeByPlaceId(placeID).then(results => {
      const defaultObject = { long_name: '' };
      const country = (
        results[0].address_components.find(c => c.types.includes('country')) ||
        defaultObject
      ).long_name;
      const state = (
        results[0].address_components.find(c =>
          c.types.includes('administrative_area_level_1'),
        ) || defaultObject
      ).long_name;
      const city = (
        results[0].address_components.find(c => c.types.includes('locality')) ||
        defaultObject
      ).long_name;
      const streetNumber = (
        results[0].address_components.find(c => c.types.includes('street_number')) ||
        defaultObject
      ).long_name;
      const route = (
        results[0].address_components.find(c => c.types.includes('route')) ||
        defaultObject
      ).long_name;
      const zip = (
        results[0].address_components.find(
          c => c.types.includes('zip') || c.types.includes('postal_code'),
        ) || defaultObject
      ).long_name;

      this.updateState(
        {
          addressLine1: `${streetNumber} ${route}`,
          state,
          city,
          zip,
          country
        }
      );
    }).catch(error => console.error(error));
  };

  render() {
    console.log(this.state)
    console.log(this.state.addressLine1)

    return (
      <div>
        <WrappedPlacesAutocomplete
          value={this.state.address}
          onChange={this.handleChange}
          onSelect={this.handleSelect}
        >
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div>
              <LabelInput label={"Search For Your Location"} {...getInputProps()} />
              <div >
                {loading && <div>Loading...</div>}
                {suggestions.map(suggestion => {

                  return <SuggestionItem getSuggestionItemProps={getSuggestionItemProps} suggestion={suggestion}/>
                })}
              </div>
            </div>)}
        </WrappedPlacesAutocomplete>
        <FieldContainer>
          <LabelInput label={"Address Line 1"} value={this.state.addressLine1}/>
          <LabelInput label={"Address Line 1"} value={this.state.addressLine2}/>
          <LabelInput label={"Address Line 1"} value={this.state.city}/>
          <LabelInput label={"Address Line 1"} value={this.state.state}/>
          <LabelInput label={"Address Line 1"} value={this.state.zip}/>
          <LabelInput label={"Address Line 1"} value={this.state.country}/>
        </FieldContainer>
      </div>

    );
  }
}

/*
export default compose(
  withApi,
  withTheme,
  injectState,
  withState('location', 'setLocation', ({ state: { loggedInUser } }) => {
    const places = [
      loggedInUser.addressLine1 || '',
      loggedInUser.city || '',
      loggedInUser.state || '',
      loggedInUser.country || '',
    ];
    return places.filter(place => place.length).join(', ');
  }),
  withFormik({
    mapPropsToValues: ({
                         state: { loggedInUser = { firstName: '', lastName: '', email: '', roles: [] } },
                       }) => ({
      ...Object.entries(loggedInUser).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key]: value ? value : '',
        }),
        {},
      ),
      roles: (loggedInUser.roles && loggedInUser.roles[0]) || '',
    }),
    isInitialValid: ({
                       state: { loggedInUser = { firstName: '', lastName: '', email: '', roles: [] } },
                     }) =>
      loggedInUser.firstName &&
      loggedInUser.lastName &&
      loggedInUser.email &&
      loggedInUser.roles.length,
    validate: (values, props) => {
      let errors = {};
      if (!values.roles) {
        errors.roles = 'Must select a role';
      } else if (!ROLES.map(r => r.type).includes(values.roles.toLowerCase())) {
        errors.roles = 'Invalid role';
      }
      if (!values.firstName || values.firstName.length === 0) {
        errors.firstName = 'First name is required';
      }
      if (!values.lastName || values.lastName.length === 0) {
        errors.lastName = 'Last name is required';
      }
      const { onValidateFinish } = props;
      onValidateFinish && onValidateFinish(errors);
      return errors;
    },
    handleSubmit: async (
      values: any,
      {
        props: {
          state: { loggedInUser },
          effects: { setUser, setModal, unsetModal },
          api,
          ...restProps
        },
        setSubmitting,
        setErrors,
      }: any,
    ) => {
      if (window.location.pathname.includes('/user') && values.roles !== loggedInUser.roles[0]) {
        trackUserInteraction({
          category: TRACKING_EVENTS.categories.user.profile,
          action: TRACKING_EVENTS.actions.userRoleSelected + ' to',
          label: values.roles,
        });
        updateTrackingInfo({ userRoles: [values.roles] });
      }
      const { email, ...rest } = loggedInUser;
      updateProfile(api)({
        user: {
          ...rest,
          ...values,
          roles: [values.roles],
        },
      }).then(
        async profile => {
          await setUser({ ...profile, email, api });
          unsetModal();
        },
        errors => setSubmitting(false),
      );
    },
  }),
)(
  ({
     theme,
     touched,
     errors,
     values,
     setFieldValue,
     handleSubmit,
     handleChange,
     state: { loggedInUser },
     effects: { setModal, unsetModal },
     location,
     setLocation,
   }) => (
    <Fragment>
      <ContentRow>
        <div
          css={`
            padding-right: 30px;
            border-right: 1px solid #cacbcf;
          `}
        >
          <Column>
            <Gravtar
              email={values.email || ''}
              size={143}
              css={`
                align-self: center;
                border-radius: 50%;
                padding: 5px;
                background-color: #fff;
                border: 1px solid #cacbcf;
                margin-bottom: 5px;
              `}
            />
            <WhiteButton mt="4px" w="170px">
              <ExternalLink href="https://en.gravatar.com/site/login">change gravatar</ExternalLink>
            </WhiteButton>
          </Column>
        </div>
        <form
          onSubmit={handleSubmit}
          css={`
            padding-left: 30px;
            padding-right: 30px;
            width: 100%;
            overflow-y: scroll;
          `}
        >
          <FormItem>
            <StyledLabel>Search Location:</StyledLabel>
            <WrappedPlacesAutocomplete
              value={this.state.address}
              onChange={this.handleChange}
              onSelect={this.handleSelect}
            >
              {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <div>
                  <input
                    {...getInputProps({
                      placeholder: 'Search Places ...',
                      className: 'location-search-input',
                    })}
                  />
                  <div className="autocomplete-dropdown-container">
                    {loading && <div>Loading...</div>}
                    {suggestions.map(suggestion => {
                      const className = suggestion.active
                        ? 'suggestion-item--active'
                        : 'suggestion-item';
                      // inline style for demonstration purpose
                      const style = suggestion.active
                        ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                        : { backgroundColor: '#ffffff', cursor: 'pointer' };
                      return (
                        <div
                          {...getSuggestionItemProps(suggestion, {
                            className,
                            style,
                          })}
                        >
                          <span>{suggestion.description}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </WrappedPlacesAutocomplete>
          </FormItem>
          <AddressBox>
            <AddressRow>
              <div
                css={`
                  width: 48%;
                `}
              >
                <StyledLabel>Address Line 1:</StyledLabel>
                <FieldInput name="addressLine1" value={values.addressLine1} />
              </div>
              <div
                css={`
                  width: 48%;
                `}
              >
                <StyledLabel>Address Line 2:</StyledLabel>
                <FieldInput name="addressLine2" value={values.addressLine2} />
              </div>
            </AddressRow>
            <AddressRow>
              <div>
                <StyledLabel>City</StyledLabel>
                <FieldInput width="90$" name="city" value={values.city} />
              </div>
              <div>
                <StyledLabel>State/Province:</StyledLabel>
                <FieldInput width="90%" name="state" value={values.state} />
              </div>
              <div>
                <StyledLabel>Zip/Postal Code:</StyledLabel>
                <FieldInput width="90%" name="zip" value={values.zip} />
              </div>
            </AddressRow>
            <AddressRow>
              <div
                css={`
                  width: 100%;
                `}
              >
                <StyledLabel>Country:</StyledLabel>
                <FieldInput name="country" value={values.country} />
              </div>
            </AddressRow>
          </AddressBox>
        </form>
      </ContentRow>
      <ModalFooter {...{ unsetModal, handleSubmit }} />
    </Fragment>
  ),
);

/*
<Fragment>
      <ContentRow>
        <div
          css={`
            padding-right: 30px;
            border-right: 1px solid #cacbcf;
          `}
        >
          <Column>
            <Gravtar
              email={values.email || ''}
              size={143}
              css={`
                align-self: center;
                border-radius: 50%;
                padding: 5px;
                background-color: #fff;
                border: 1px solid #cacbcf;
                margin-bottom: 5px;
              `}
            />
            <WhiteButton mt="4px" w="170px">
              <ExternalLink href="https://en.gravatar.com/site/login">change gravatar</ExternalLink>
            </WhiteButton>
          </Column>
        </div>
        <form
          onSubmit={handleSubmit}
          css={`
            padding-left: 30px;
            padding-right: 30px;
            width: 100%;
            overflow-y: scroll;
          `}
        >
          <FormItem>
            <StyledLabel>Search Location:</StyledLabel>
            <WrappedPlacesAutocomplete
              value={location}
              onChange={(address) => console.log(address)}
              onSelect={(address, placeID) => {
                (address) => console.log(address);
                geocodeByPlaceId(placeID)
                  .then(results => {
                    const defaultObject = { long_name: '' };
                    const country = (
                      results[0].address_components.find(c => c.types.includes('country')) ||
                      defaultObject
                    ).long_name;
                    const administrative_area_level_1 = (
                      results[0].address_components.find(c =>
                        c.types.includes('administrative_area_level_1'),
                      ) || defaultObject
                    ).long_name;
                    const locality = (
                      results[0].address_components.find(c => c.types.includes('locality')) ||
                      defaultObject
                    ).long_name;
                    const streetNumber = (
                      results[0].address_components.find(c => c.types.includes('street_number')) ||
                      defaultObject
                    ).long_name;
                    const route = (
                      results[0].address_components.find(c => c.types.includes('route')) ||
                      defaultObject
                    ).long_name;
                    const zip = (
                      results[0].address_components.find(
                        c => c.types.includes('zip') || c.types.includes('postal_code'),
                      ) || defaultObject
                    ).long_name;
                    setFieldValue('addressLine1', `${streetNumber} ${route}`);
                    setFieldValue('country', country);
                    setFieldValue('state', administrative_area_level_1);
                    setFieldValue('city', locality);
                    setFieldValue('zip', zip);
                  })
                  .catch(error => console.error(error));
              }}
            >
              {({ getInputProps, getSuggestionItemProps, suggestions, loading, ...rest }) => (
                <Box position="relative">
                  <SearchLocationIcon fill="#a9adc0" />
                  <LocationFieldInput
                    LeftIcon={null}
                    name="searchLocation"
                    placeholder="e.g 3401 Civic Center Blvd."
                    {...getInputProps()}
                  />
                  {!!suggestions.length && (
                    <AutoCompleteContainer>
                      {suggestions.map(suggestion => (
                        <AutoCompleteItem
                          isSelected={suggestion.description === location}
                          {...getSuggestionItemProps(suggestion)}
                        >
                          {suggestion.description}
                        </AutoCompleteItem>
                      ))}
                    </AutoCompleteContainer>
                  )}
                </Box>
              )}
            </WrappedPlacesAutocomplete>
          </FormItem>
          <AddressBox>
            <AddressRow>
              <div
                css={`
                  width: 48%;
                `}
              >
                <StyledLabel>Address Line 1:</StyledLabel>
                <FieldInput name="addressLine1" value={values.addressLine1} />
              </div>
              <div
                css={`
                  width: 48%;
                `}
              >
                <StyledLabel>Address Line 2:</StyledLabel>
                <FieldInput name="addressLine2" value={values.addressLine2} />
              </div>
            </AddressRow>
            <AddressRow>
              <div>
                <StyledLabel>City</StyledLabel>
                <FieldInput width="90$" name="city" value={values.city} />
              </div>
              <div>
                <StyledLabel>State/Province:</StyledLabel>
                <FieldInput width="90%" name="state" value={values.state} />
              </div>
              <div>
                <StyledLabel>Zip/Postal Code:</StyledLabel>
                <FieldInput width="90%" name="zip" value={values.zip} />
              </div>
            </AddressRow>
            <AddressRow>
              <div
                css={`
                  width: 100%;
                `}
              >
                <StyledLabel>Country:</StyledLabel>
                <FieldInput name="country" value={values.country} />
              </div>
            </AddressRow>
          </AddressBox>
        </form>
      </ContentRow>
      <ModalFooter {...{ unsetModal, handleSubmit }} />
    </Fragment>
 */