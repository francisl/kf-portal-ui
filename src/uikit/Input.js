import React from 'react';
import styled from 'react-emotion';
import Row from 'uikit/Row';
import SearchIcon from 'react-icons/lib/fa/search';
import FaTimesCircleO from 'react-icons/lib/fa/times-circle';
import { flex } from 'styled-system';

/*
  There are a lot of warnings induced by the  "...props festival".
  This festival occurs in some of our external libraries, as well
  which makes it almost impossible at the moment to fix them correctly.
  So, for the sake of depolluting the warnings, I'll use the following method. 
*/
const BLACK_LISTED_PROP_KEYS = ['componentRef'];
const removeUnwantedProps = (incomingProps = {}) => {
  const filteredEntries = Object.entries(incomingProps).filter(
    ([key]) => !BLACK_LISTED_PROP_KEYS.includes(key),
  );
  return Object.fromEntries(filteredEntries);
};

/*
this component should implement the same interface as <input> from react-dom
with some additional props
*/
const FilterInputWrapper = styled(Row)`
  ${({ theme }) => theme.input};
  color: ${({ theme }) => theme.greyScale7};
  align-items: center;
  .icon-left {
    margin-right: 5px;
  }
  .icon-right {
    cursor: pointer;
  }
  input {
    border: none;
    flex: 1;
  }
`;
const setNativeValue = (element, value) => {
  const valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
  const prototype = Object.getPrototypeOf(element);
  const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;

  if (valueSetter && valueSetter !== prototypeValueSetter) {
    prototypeValueSetter.call(element, value);
  } else {
    valueSetter.call(element, value);
  }
};
export const FilterInput = ({
  LeftIcon = SearchIcon,
  RightIcon = FaTimesCircleO,
  className,
  value,
  disabled,
  ref = React.createRef(),
  ...props
}) => {
  const clearInput = () => {
    const input = ref.current;
    setNativeValue(input, '');
    input.dispatchEvent(new Event('input', { bubbles: true }));
  };
  return (
    <FilterInputWrapper disabled={disabled} className={className}>
      {LeftIcon && <LeftIcon className={'icon-left'} />}
      <input {...{ value, disabled, ...removeUnwantedProps(props) }} ref={ref} autoFocus />
      {value && value.length && <RightIcon className={'icon-right'} onClick={clearInput} />}
    </FilterInputWrapper>
  );
};
export default styled('input')`
  ${({ theme }) => theme.input};
  ${({ italic }) => (italic ? `font-style: italic` : ``)};
  ${flex};
`;
