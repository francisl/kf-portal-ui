import {
  CLEAR_ERROR_PROFILE,
  DELETE_PROFILE,
  FAILURE_IS_PUBLIC_TOGGLE,
  FAILURE_PROFILE,
  FAILURE_UPDATE,
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
  LOGOUT,
  RECEIVE_IS_PUBLIC_TOGGLE,
  RECEIVE_PROFILE,
  REQUEST_IS_PUBLIC_TOGGLE,
  REQUEST_PROFILE,
  REQUEST_PROFILE_UPDATE,
  UPDATE_USER_SUCCESS,
} from '../actionTypes';
import { apiInitialized } from 'services/api';
import { getOtherUserProfile, getUserLoggedInProfile, updateProfile } from 'services/profiles';
import { selectProfile } from '../selectors/users';

const updateProfileFromUser = updateProfile(apiInitialized);

export const loginSuccess = loggedInUser => {
  return {
    type: LOGIN_SUCCESS,
    payload: loggedInUser,
  };
};

export const loginFailure = () => {
  return {
    type: LOGIN_FAILURE,
    payload: null,
  };
};

export const logout = () => {
  return {
    type: LOGOUT,
    payload: null,
  };
};

export const requestProfile = () => {
  return {
    type: REQUEST_PROFILE,
  };
};

export const receiveProfile = fetchedProfile => {
  return {
    type: RECEIVE_PROFILE,
    payload: fetchedProfile,
  };
};

export const failureProfile = error => {
  return {
    type: FAILURE_PROFILE,
    payload: error,
  };
};

export const updateProfileSuccess = updatedProfile => {
  return {
    type: UPDATE_USER_SUCCESS,
    payload: updatedProfile,
  };
};

const fetchProfile = userInfo => {
  return async dispatch => {
    const onSuccess = profile => {
      return dispatch(receiveProfile(profile));
    };
    const onError = error => {
      return dispatch(failureProfile(error));
    };

    dispatch(requestProfile());
    try {
      const fetchedProfile = await (userInfo.isSelf
        ? getUserLoggedInProfile()
        : getOtherUserProfile(userInfo.userID));
      return onSuccess(fetchedProfile);
    } catch (e) {
      return onError(e);
    }
  };
};

const shouldFetchProfile = (state, userInfo) => {
  const profileInStore = selectProfile(state);
  if (!Boolean(profileInStore)) {
    return true;
  }
  return profileInStore._id !== userInfo.userID;
};

export const fetchProfileIfNeeded = userInfo => {
  return (dispatch, getState) => {
    if (shouldFetchProfile(getState(), userInfo)) {
      return dispatch(fetchProfile(userInfo));
    }
  };
};

export const requestUpdateProfile = () => {
  return {
    type: REQUEST_PROFILE_UPDATE,
  };
};

export const failureUpdateProfile = error => {
  return {
    type: FAILURE_UPDATE,
    payload: error,
  };
};

export const updateUserProfile = user => {
  return async dispatch => {
    dispatch(requestUpdateProfile());
    try {
      const updatedProfile = await updateProfileFromUser({
        user,
      });
      return dispatch(updateProfileSuccess(updatedProfile));
    } catch (e) {
      return dispatch(failureUpdateProfile(e));
    }
  };
};

export const requestIsPublicToggle = () => {
  return {
    type: REQUEST_IS_PUBLIC_TOGGLE,
  };
};

export const receiveIsPublicToggle = () => {
  return {
    type: RECEIVE_IS_PUBLIC_TOGGLE,
  };
};

export const failureIsPublicToggle = error => {
  return {
    type: FAILURE_IS_PUBLIC_TOGGLE,
    payload: error,
  };
};

export const toggleIsPublic = user => {
  return async dispatch => {
    dispatch(requestIsPublicToggle());
    try {
      await updateProfileFromUser({
        user,
      });
      return dispatch(receiveIsPublicToggle());
    } catch (e) {
      return dispatch(failureIsPublicToggle(e));
    }
  };
};

export const deleteProfile = () => {
  return dispatch => dispatch({ type: DELETE_PROFILE });
};

export const requestClearErrorProfile = () => {
  return {
    type: CLEAR_ERROR_PROFILE,
    payload: null,
  };
};
