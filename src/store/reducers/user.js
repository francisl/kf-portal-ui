import {
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  REQUEST_PROFILE,
  RECEIVE_PROFILE,
  FAILURE_PROFILE,
  REQUEST_PROFILE_UPDATE,
  FAILURE_UPDATE,
  UPDATE_USER_SUCCESS,
  DELETE_PROFILE,
  REQUEST_IS_PUBLIC_TOGGLE,
  RECEIVE_IS_PUBLIC_TOGGLE,
  FAILURE_IS_PUBLIC_TOGGLE, CLEAR_ERROR_PROFILE,
} from '../actionTypes';

const initialState = {
  loggedInUser: null,
  uid: null,
  isProfileLoading: false,
  profile: null,
  errorProfile: null,
  isTogglingProfileStatus: false,
  isTogglingProfileStatusInError: null,
  isProfileUpdating: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        loggedInUser: action.payload,
        uid: action.payload.egoId,
      };
    case LOGIN_FAILURE:
      return { ...initialState };
    case LOGOUT:
      return { ...initialState };
    case REQUEST_PROFILE:
      return { ...state, isProfileLoading: true };
    case RECEIVE_PROFILE:
      return { ...state, profile: action.payload, isProfileLoading: false };
    case FAILURE_PROFILE:
      return { ...state, errorProfile: action.payload, isProfileLoading: false };
    case REQUEST_PROFILE_UPDATE:
      return { ...state, isProfileUpdating: true };
    case FAILURE_UPDATE:
      return { ...state, errorProfile: action.payload, isProfileLoading: false };
    case UPDATE_USER_SUCCESS:
      return { ...state, profile: action.payload, isProfileUpdating: false };
    case DELETE_PROFILE:
      return { ...state, profile: null };
    case REQUEST_IS_PUBLIC_TOGGLE:
      return { ...state, isTogglingProfileStatus: true };
    case RECEIVE_IS_PUBLIC_TOGGLE: {
      const isPublicBeforeToggle = state.profile.isPublic;

      const copyOfProfile = { ...state.profile };
      copyOfProfile.isPublic = !isPublicBeforeToggle;

      const copyOfLoggedInUser = Boolean(state.loggedInUser) ? { ...state.loggedInUser } : {};
      copyOfLoggedInUser.isPublic = !isPublicBeforeToggle;

      return {
        ...state,
        isTogglingProfileStatus: false,
        profile: copyOfProfile,
        loggedInUser: copyOfLoggedInUser,
      };
    }
    case FAILURE_IS_PUBLIC_TOGGLE:
      return {
        ...state,
        isTogglingProfileStatus: false,
        isTogglingProfileStatusInError: action.payload,
      };
    case CLEAR_ERROR_PROFILE:
      return {
        ...state,
        errorProfile: action.payload,
      };
    default:
      return state;
  }
};
