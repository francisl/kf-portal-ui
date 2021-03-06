import { combineReducers } from 'redux';

import virtualStudies from './virtualStudies';
import currentVirtualStudy from './currentVirtualStudy';
import user from './user';
import ui from './ui';
import errors from './errors';
import enableFeatures from './enableFeatures';

export default combineReducers({
  virtualStudies,
  currentVirtualStudy,
  user,
  ui,
  errors,
  enableFeatures,
});
