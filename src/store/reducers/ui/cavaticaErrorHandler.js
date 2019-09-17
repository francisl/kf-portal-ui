import * as actionTypes from '../../actionTypes';

const initialState = {
  error: null,
  retry: false,
  cancel: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CAVATICA_STORE_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case actionTypes.CAVATICA_CALL_RETRY:
      return {
        ...initialState,
        retry: true,
      };
    case actionTypes.CAVATICA_CALL_CANCEL:
      return {
        ...initialState,
        cancel: true,
      };
    case actionTypes.CAVATICA_CALL_RESET:
      return { ...initialState };
    default:
      return state;
  }
};
