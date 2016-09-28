import requireInject from 'require-inject';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

const valueOf = sinon.stub().returns(0);
const moment = () => ({ valueOf });

describe('variable-delta-time', () => {
  const createLoop = requireInject('./variable-delta-time', { moment }).default;

  let loop;
  let callback;
  beforeEach(() => {
    valueOf.returns(0);

    callback = sinon.spy();
    loop = createLoop(() => false, callback)
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

  it('should pass the delta and and elapsed time to the callback', () => {
    valueOf.returns(2);

    loop();
    expect(callback).to.have.been.calledWith(2, 2);

    valueOf.returns(12);

    loop();
    expect(callback).to.have.been.calledWith(10, 12);
  });

  it('should not execute the callback multiple times if more time has passed', () => {
    valueOf.returns(2500);
    loop();

    expect(callback).to.have.been.calledWith(2500);
    expect(callback).to.have.been.calledOnce;
  });

  it('should not execute the callback when paused', () => {
    const paused = createLoop(() => true, callback)
    valueOf.returns(20);
    paused();

    expect(callback).not.to.have.been.called;
  });

  it('should not accumulate time when when paused', () => {
    let pausedValue = true;
    const paused = createLoop(() => pausedValue, callback)
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