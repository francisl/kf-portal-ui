import { types } from 'util';
// import noop from 'lodash/noop';

/**
 * Wraps a `func` function and handles either an error or failing promise.
 * @param {Function} func - a function that may throw an error or return a promise.
 * @param {Function} retrialFn - an optional function to call to check wether to retry the `func` or not.
 * @returns {Promise} - a promise that fails if the `func` ends up not being executed successfully
 */
export const handleErrorWithRetry = (func, retrialFn) => {
  return new Promise((finalResolve, finalReject) => {
    // wrap the function in a promise for consistency
    //  if it does not returns a promise
    new Promise((resolve, reject) => {
      try {
        const result = func();
        if (types.isPromise(result)) {
          result.catch(reject).then(resolve);
        } else {
          resolve(result);
        }
      } catch (error) {
        reject(error);
      }
    })
      .then(finalResolve)
      .catch(err => {
        if (typeof retrialFn !== 'function') {
          finalReject(err);
        }

        try {
          const result = retrialFn();
          if (!types.isPromise(result)) {
            finalReject(new Error('retrialFn did not return a Promise as expected'));
          }

          result
            .catch(() => {
              finalReject(err);
            })
            .then(() => {
              handleErrorWithRetry(func, retrialFn)
                .then(finalResolve)
                .catch(finalReject);
            });
        } catch (error) {
          finalReject(error);
          return;
        }
      });
  });
};
