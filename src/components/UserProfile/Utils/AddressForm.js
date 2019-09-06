import React from 'react';
import { geocodeByPlaceId } from 'react-places-autocomplete';
import { FieldContainer, LabelInput, SuggestionItem } from './Editor';
import PlacesAutocomplete from 'react-places-autocomplete';
import scriptjs from 'scriptjs';
import { googleMapsKey } from 'common/injectGlobals';

export default class AddressForm extends React.Component {
  constructor(props) {
    super(props);

    const { addressLine1, addressLine2, country, state, city, zip } = this.props.profile || '';

    this.state = {
      addressLine1,
      addressLine2,
      country,
      city,
      state,
      zip,
      searchAddressVal: '',
      isGoogleScriptLoaded: false,
    };

    this.suggestions = [];
  }

  componentDidMount() {
    scriptjs(`https://maps.googleapis.com/maps/api/js?key=${googleMapsKey}&libraries=places`, () =>
      this.setState({ isGoogleScriptLoaded: true }),
    );
  }

  handleChange = searchAddressVal => {
    this.setState({ searchAddressVal });
  };

  handleSelect = (address, placeId) => {
    geocodeByPlaceId(placeId)
      .then(results => {
        const defaultObject = { long_name: '' };
        const country = (
          results[0].address_components.find(c => c.types.includes('country')) || defaultObject
        ).long_name;
        const state = (
          results[0].address_components.find(c =>
            c.types.includes('administrative_area_level_1'),
          ) || defaultObject
        ).long_name;
        const city = (
          results[0].address_components.find(c => c.types.includes('locality')) || defaultObject
        ).long_name;
        const streetNumber = (
          results[0].address_components.find(c => c.types.includes('street_number')) ||
          defaultObject
        ).long_name;
        const route = (
          results[0].address_components.find(c => c.types.includes('route')) || defaultObject
        ).long_name;
        const zip = (
          results[0].address_components.find(
            c => c.types.includes('zip') || c.types.includes('postal_code'),
          ) || defaultObject
        ).long_name;

        this.setState({
          addressLine1: `${streetNumber} ${route}`,
          state,
          city,
          zip,
          country,
          searchAddressVal: '',
        });
      })
      .catch(error => console.error(error));
  };

  render() {
    const {
      isGoogleScriptLoaded,
      addressLine1,
      addressLine2,
      country,
      city,
      state,
      zip,
      searchAddressVal,
    } = this.state;
    if (!isGoogleScriptLoaded) {
      return null;
    }

    const { profile } = this.props;

    return (
      <div>
        <PlacesAutocomplete
          value={searchAddressVal}
          onChange={this.handleChange}
          onSelect={this.handleSelect}
        >
          {({ getInputProps, suggestions, getSuggestionItemProps }) => (
            <div>
              <LabelInput label={'Search For Your Location'} {...getInputProps()} />
              {suggestions.map((suggestion, index) => {
                return (
                  <SuggestionItem
                    key={index}
                    suggestion={suggestion}
                    getSuggestionItemProps={getSuggestionItemProps}
                  />
                );
              })}
            </div>
          )}
        </PlacesAutocomplete>
        <FieldContainer>
          <LabelInput
            profile={profile}
            field={'addressLine1'}
            label={'Address Line 1'}
            value={addressLine1}
          />
          <LabelInput
            profile={profile}
            field={'addressLine2'}
            label={'Address Line 2'}
            value={addressLine2}
          />
          <LabelInput profile={profile} field={'city'} label={'City'} value={city} />
          <LabelInput profile={profile} field={'state'} label={'State'} value={state} />
          <LabelInput profile={profile} field={'zip'} label={'ZIP Code'} value={zip} />
          <LabelInput profile={profile} field={'country'} label={'Country'} value={country} />
        </FieldContainer>
      </div>
    );
  }
}
