import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

describe('fixed-delta-time', () => {
  const configuredDelta = 20;
  const createLoop = require('./fixed-delta-time').default;

  let loop;
  let callback;
  beforeEach(() => {
    callback = sinon.spy();
    loop = createLoop(configuredDelta, () => false, callback)
  })

  it('should execute the function each time it is called', () => {
    loop();
    loop();

    expect(callback).to.have.been.calledTwice;
  });

  it('should pass the configuredDelta and elapsed time to the callback', () => {
    loop();
    expect(callback).to.have.been.calledWith(configuredDelta, 20);

    loop();
    expect(callback).to.have.been.calledWith(configuredDelta, 40);
  });

  it('should not execute the callback when paused', () => {
    const loop2 = createLoop(configuredDelta, () => true, callback)
    loop2();

    expect(callback).not.to.have.been.called;
  });

  it('should not increase elapsed time the callback when paused', () => {
    let pausedValue = true;
    const loop2 = createLoop(configuredDelta, () => pausedValue, callback)
    loop2();
    loop2();
    loop2();
    pausedValue = false;
    loop2();

    expect(callback).to.have.been.calledWith(configuredDelta, 20);
  });
});