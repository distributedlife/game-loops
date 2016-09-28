import requireInject from 'require-inject';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

const valueOf = sinon.stub().returns(0);
const moment = () => ({ valueOf });

describe('semi-fixed-time-step', () => {
  const maxDelta = 20;
  const createLoop = requireInject('./semi-fixed-time-step', { moment }).default;

  let loop;
  let callback;
  beforeEach(() => {
    valueOf.returns(0);

    callback = sinon.spy();
    loop = createLoop(maxDelta, () => false, callback)
  })

  it('should not execute the function if no time has elapsed', () => {
    valueOf.returns(0);
    loop();

    expect(callback).not.to.have.been.called;
  });

  it('should execute the function if any time has elapsed', () => {
    valueOf.returns(1);
    loop();

    expect(callback).to.have.been.called;
  });

  it('should pass the delta and elapsed time to the callback', () => {
    valueOf.returns(2);
    loop();

    expect(callback).to.have.been.calledWith(2, 2);
  });

  it('should pass the maxDelta time to the callback if more time has passed', () => {
    valueOf.returns(25);
    loop();

    expect(callback).to.have.been.calledWith(20, 20);
  });

  it('should execute the callback multiple times if more time has passed', () => {
    valueOf.returns(25);
    loop();

    expect(callback).to.have.been.calledWith(20, 20);
    expect(callback).to.have.been.calledWith(5, 25);
    expect(callback).to.have.been.calledTwice;
  });

  it('should not execute the callback when paused', () => {
    const paused = createLoop(maxDelta, () => true, callback)
    valueOf.returns(20);
    paused();

    expect(callback).not.to.have.been.called;
  });

  it('should not accumulate time when when paused', () => {
    let pausedValue = true;
    const paused = createLoop(maxDelta, () => pausedValue, callback)
    valueOf.returns(20);
    paused();
    valueOf.returns(40);
    paused();
    valueOf.returns(60);
    paused();

    valueOf.returns(65);
    pausedValue = false;
    paused();

    expect(callback).to.have.callCount(1);
    expect(callback).to.have.been.calledWith(5, 5);
  });
});