import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import { cyan } from 'chalk';

import { handleErrorWithRetry } from './index';

// adds Promise-based testing utilities and assertions
chai.use(chaiAsPromised);

describe(cyan.bold('errorHandling service'), () => {
  const rejector = () => Promise.reject();

  describe('handleErrorWithRetry', () => {
    it('invoke the provided function', () => {
      const func = sinon.spy();
      handleErrorWithRetry(func, rejector);
      expect(func.called);
    });

    describe('when the provided function returns a value', () => {
      it('returns a promise that resolves to the returned value', async () => {
        const func = sinon.stub().returns('success!');
        return expect(handleErrorWithRetry(func, rejector)).to.eventually.be.equal('success!');
      });
    });

    describe('when the provided function throws', () => {
      it('returns a promise that rejects to the thrown error', () => {
        const func = sinon.stub().throws(new Error('error!'));
        expect(handleErrorWithRetry(func, rejector)).to.be.rejectedWith('error!');
      });

      it('allows to retry the provided function, fails it the retrial fails', () => {
        const func = sinon.stub();
        const retrial = sinon.stub();

        // original function call fails
        func.onCall(0).throws(new Error('error 1'));
        retrial.onCall(0).returns(Promise.resolve());

        // second function call fails
        func.onCall(1).throws(new Error('error 2'));
        retrial.onCall(1).returns(Promise.resolve());

        // third function call fails
        func.onCall(2).throws(new Error('error 3'));
        retrial.onCall(2).returns(Promise.reject(new Error('OVER')));

        expect(handleErrorWithRetry(func, retrial)).to.be.rejectedWith('error 3');
      });

      it('allows to retry the provided function until it succeeds', () => {
        const func = sinon.stub();
        const retrial = sinon.stub();

        // original function call fails
        func.onCall(0).throws(new Error('error 1'));
        retrial.onCall(0).returns(Promise.resolve());

        // second function call fails
        func.onCall(1).throws(new Error('error 2'));
        retrial.onCall(1).returns(Promise.resolve());

        // third's one a charm
        func.onCall(2).returns(42);

        expect(handleErrorWithRetry(func, retrial)).to.eventually.be.equal(42);
      });

      it('passes the original error to the retrial function', async () => {
        const func = sinon.stub();
        const thrownError = new Error('error 1');
        func.onCall(0).throws(thrownError);
        func.onCall(1).returns();

        const retrial = sinon.stub().returns(Promise.resolve());

        return handleErrorWithRetry(func, retrial).then(() => {
          return expect(retrial.firstCall.args[0]).to.be.eq(thrownError);
        });
      });

      it('fails if no retrial function is provided', async () => {
        const func = sinon.stub().throws(new Error('error!'));
        expect(handleErrorWithRetry(func)).to.be.rejectedWith('error!');
      });
    });

    describe('when the provided function returns a resolved promise', () => {
      it('returns a promise that resolves to the same value', () => {
        const func = sinon.stub().returns(Promise.resolve('success!'));
        expect(handleErrorWithRetry(func, rejector)).to.eventually.be.equal('success!');
      });
    });

    describe('when the provided function returns a rejected promise', () => {
      it('returns a promise that rejects to the same error', () => {
        const func = sinon.stub().returns(Promise.reject('error!'));
        expect(handleErrorWithRetry(func, rejector)).to.be.rejectedWith('error!');
      });

      it('allows to retry the provided function, fails it the retrial fails', () => {
        const func = sinon.stub();
        const retrial = sinon.stub();

        // original function call fails
        func.onCall(0).returns(Promise.reject('error 1'));
        retrial.onCall(0).returns(Promise.resolve());

        // second function call fails
        func.onCall(1).returns(Promise.reject('error 2'));
        retrial.onCall(1).returns(Promise.resolve());

        // third function call fails
        func.onCall(2).returns(Promise.reject('error 3'));
        retrial.onCall(2).returns(Promise.reject(new Error('OVER')));

        expect(handleErrorWithRetry(func, retrial)).to.be.rejectedWith('error 3');
      });

      it('allows to retry the provided function until it succeeds', () => {
        const func = sinon.stub();
        const retrial = sinon.stub();

        // original function call fails
        func.onCall(0).returns(Promise.reject('error 1'));
        retrial.onCall(0).returns(Promise.resolve());

        // third's one a charm
        func.onCall(1).returns(42);

        expect(handleErrorWithRetry(func, retrial)).to.eventually.be.equal(42);
      });

      it('passes the original rejection reason to the retrial function', async () => {
        const func = sinon.stub();
        const reason = 'error 1';
        func.onCall(0).returns(Promise.reject(reason));
        func.onCall(1).returns();

        const retrial = sinon.stub().returns(Promise.resolve());

        return handleErrorWithRetry(func, retrial).then(() => {
          return expect(retrial.firstCall.args[0]).to.be.eq(reason);
        });
      });
    });
  });
});
