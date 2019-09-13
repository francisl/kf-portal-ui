import { get } from 'lodash';
import { css } from 'react-emotion';
import { ROLES } from 'common/constants';
import isPlainObject from 'lodash/isPlainObject';

export const getRoleTypeFromProfile = (profile, defaultValue = '') =>
  get(profile, ['roles', 0], defaultValue);

export const userProfileBackground = (
  loggedInUser,
  { showBanner = true, gradientDirection = 'right' } = {},
) => {
  const role = ROLES.find(x => x.type === getRoleTypeFromProfile(loggedInUser)) || {};
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

/* used to detect a change that helps us to decide whether or not we should refetch the profile */
export const isProfileToBeRefreshed = (prevLocation = {}, location = {}) => {
  const hasPathNameChanged = prevLocation.pathname !== location.pathname;

  const doesPrevLocationAsksToBeRefreshed =
    isPlainObject((prevLocation || {}).state) && Boolean(prevLocation.state.refreshProfile);
  const doesCurrentLocationAsksToBeRefreshed =
    isPlainObject((location || {}).state) && Boolean(location.state.refreshProfile);
  return (
    hasPathNameChanged ||
    (!doesPrevLocationAsksToBeRefreshed && doesCurrentLocationAsksToBeRefreshed)
  );
};
