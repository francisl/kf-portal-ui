import { types } from 'util';

const isPromise =
  (types && types.isPromise) ||
  (fn => ['then', 'catch'].every(prop => typeof fn[prop] === 'function'));

/**
 * Wraps the provided `func` in a try/catch and ensures that a Promise is returned.
 * @param {Function} func - any parameterless function
 * @returns - A promise, I promise.
 */
const wrapInPromise = async func =>
  new Promise((resolve, reject) => {
    try {
      const result = func();
      if (isPromise(result)) {
        result.catch(reject).then(resolve);
      } else {
        resolve(result);
      }
    } catch (error) {
      reject(error);
    }
  });

/**
 * Wraps a `func` function and handles either an error or failing promise.
 * @param {Function} func - a function that may throw an error or return a promise.
 * @param {Function} retrialFn - an optional function to call to check wether to retry the `func` or not.
 * @returns {Promise} - a promise that fails if the `func` ends up not being executed successfully
 */
export const handleErrorWithRetry = (func, retrialFn) =>
  new Promise((finalResolve, finalReject) => {
    // wrap the function in a promise for consistency
    wrapInPromise(func)
      // no error : just settle the promise
      .then(finalResolve)
      // an error occured, try to recover from it
      .catch(err =>
        wrapInPromise(() => retrialFn(err))
          .then(() =>
            handleErrorWithRetry(func, retrialFn)
              .then(finalResolve)
              .catch(finalReject),
          )
          .catch(() => finalReject(err)),
      );
  });
