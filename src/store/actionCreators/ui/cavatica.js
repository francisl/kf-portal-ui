import * as actionTypes from '../../actionTypes';
import { store } from 'store/index';

import { cavaticaApiRoot } from 'common/injectGlobals';
import ajax from 'services/ajax';
import { handleErrorWithRetry } from 'services/errorHandling';

import { registerModal } from 'components/Modal/modalFactory';
import CavaticaErrorModal from 'components/cavatica/CavaticaErrorModal';

import { openModal, closeModal } from 'store/actionCreators/ui/modalComponent';

// TODO JB : MOVE
// hook the error handling modal to the modal registry
const cavaticaErrorModalName = 'CavaticaErrorModal';
registerModal(cavaticaErrorModalName, CavaticaErrorModal);

export const cavaticaApi = callOptions => {
  return handleErrorWithRetry(
    () => ajax.post(cavaticaApiRoot, callOptions),
    cavaticaRetrialMechanism,
  )
    .then(value => {
      console.log('🔥 SUCCESS', value);
      store.dispatch(closeModal(cavaticaErrorModalName));
      store.dispatch(resetCavaticaCall());
      return value;
    })
    .catch(err => {
      console.error('🔥 FAILED', err);
      store.dispatch(closeModal(cavaticaErrorModalName));
      store.dispatch(resetCavaticaCall());
      throw err;
    });
};

const cavaticaRetrialMechanism = async err => {
  // push the error in the store
  store.dispatch(storeCavaticaError(err));

  return new Promise((resolve, reject) => {
    const tick = () => {
      const state = store.getState();
      const { retry, cancel } = state.ui.cavaticaErrorHandler;

      if (retry) {
        return resolve();
      }
      if (cancel) {
        return reject(new Error('Aborted...'));
      }
      requestAnimationFrame(tick);
    };

    // show the modal
    store.dispatch(
      openModal(cavaticaErrorModalName, {}, '', {
        retry: retryCavaticaCall(),
        cancel: cancelCavaticaCall(),
      }),
    );

    tick();
  });
};

/**
 * Store an error to be displayed in the modal.
 * @param {Object} error - the original error
 */
export const storeCavaticaError = error => ({
  type: actionTypes.CAVATICA_STORE_ERROR,
  payload: error,
});

export const retryCavaticaCall = () => ({
  type: actionTypes.CAVATICA_CALL_RETRY,
});

export const cancelCavaticaCall = () => ({
  type: actionTypes.CAVATICA_CALL_CANCEL,
});

export const resetCavaticaCall = () => ({
  type: actionTypes.CAVATICA_CALL_RESET,
});
