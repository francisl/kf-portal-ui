import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import { cyan } from 'chalk';

import { handleErrorWithRetry } from './index';

// adds Promise-based testing utilities and assertions
chai.use(chaiAsPromised);

// TODO JB : remove `.only`
describe.only(cyan.bold('errorHandling service'), () => {
  describe('handleErrorWithRetry', () => {
    it('invoke the provided function', () => {
      const func = sinon.spy();
      handleErrorWithRetry(func);
      expect(func.called);
    });

    describe('when the provided function returns a value', () => {
      it('returns a promise that resolves to the returned value', async () => {
        const func = sinon.stub().returns('success!');
        const value = await handleErrorWithRetry(func);
        expect(value).to.equal('success!');
      });
    });

    describe('when the provided function throws', () => {
      it('returns a promise that rejects to the thrown error', () => {
        const func = sinon.stub().throws(new Error('error!'));
        expect(handleErrorWithRetry(func)).to.be.rejectedWith('error!');
      });

      it('allows to retry the provided function, fails it the retrial fails', async () => {
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

        return expect(handleErrorWithRetry(func, retrial)).to.be.rejectedWith('error 3');
      });

      it('allows to retry the provided function until it succeeds', async () => {
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

        return expect(handleErrorWithRetry(func, retrial)).to.eventually.be.equal(42);
      });
    });

    describe('when the provided function returns a resolved promise', () => {
      it('returns a promise that resolves to the same value', async () => {
        const func = sinon.stub().returns(Promise.resolve('success!'));
        const value = await handleErrorWithRetry(func);
        return expect(value).to.be.equal('success!');
      });
    });

    describe('when the provided function returns a rejected promise', () => {
      it('returns a promise that rejects to the same error', async () => {
        const func = sinon.stub().returns(Promise.reject('error!'));
        return expect(handleErrorWithRetry(func)).to.eventually.be.rejectedWith('error!');
      });

      it('allows to retry the provided function, fails it the retrial fails', async () => {
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

        return expect(handleErrorWithRetry(func, retrial)).to.be.rejectedWith('error 3');
      });

      it('allows to retry the provided function until it succeeds', async () => {
        const func = sinon.stub();
        const retrial = sinon.stub();

        // original function call fails
        func.onCall(0).returns(Promise.reject('error 1'));
        retrial.onCall(0).returns(Promise.resolve());

        // third's one a charm
        func.onCall(1).returns(42);

        return expect(handleErrorWithRetry(func, retrial)).to.eventually.be.equal(42);
      });
    });
  });
});
