import { combineReducers } from 'redux';
import participantEntityPage from './participantEntityPage';
import cohortBuilderPage from './cohortBuilderPage';
import userDashboardPage from './userDashboardPage';
import modalComponent from './modalComponent';
import cavaticaErrorHandler from './cavaticaErrorHandler';

export default combineReducers({
  participantEntityPage,
  cohortBuilderPage,
  userDashboardPage,
  modalComponent,
  cavaticaErrorHandler,
});
