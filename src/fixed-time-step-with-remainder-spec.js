import requireInject from 'require-inject';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

const valueOf = sinon.stub().returns(0);
const moment = () => ({ valueOf });

describe('fixed-time-step-with-remainder', () => {
  const configuredDelta = 20;
  const createLoop = requireInject('./fixed-time-step-with-remainder', { moment }).default;

  let loop;
  let callback;
  let remainderCallback;
  beforeEach(() => {
    valueOf.returns(0);

    callback = sinon.spy();
    remainderCallback = sinon.spy();
    loop = createLoop(configuredDelta, () => false, callback, remainderCallback)
  })

  it('should execute the function if the configured delta has elapsed', () => {
    valueOf.returns(20);
    loop();

    expect(callback).to.have.been.called;
    expect(remainderCallback).to.have.been.called;
  });

  it('should execute the function multiple times for each multiple of the configuredDelta', () => {
    valueOf.returns(65);
    loop();

    expect(callback).to.have.callCount(3);
  });

  it('should accumulate left over milliseconds between loops', () => {
    valueOf.returns(5);
    loop();
    valueOf.returns(10);
    loop();
    valueOf.returns(19);
    loop();
    expect(callback).not.to.have.been.called;

    valueOf.returns(39);
    loop();
    expect(callback).to.have.callCount(1);

    valueOf.returns(40);
    loop();
    expect(callback).to.have.callCount(2);
  });

  it('should call the remainder callback with the remaining milliseconds', () => {
    valueOf.returns(25);
    loop();

    expect(remainderCallback).to.have.been.calledWith(5, 25)
  })

  it('should pass the configuredDelta to the callback', () => {
    valueOf.returns(25);
    loop();

    expect(callback).to.have.been.calledWith(20, 20);

    valueOf.returns(45);
    loop();

    expect(callback).to.have.been.calledWith(20, 40);
  });

  it('should execute the function if the configured delta has not elapsed', () => {
    valueOf.returns(19);
    loop();

    expect(callback).not.to.have.been.called;
  });

  it('should not execute the callback when paused', () => {
    const paused = createLoop(configuredDelta, () => true, callback, remainderCallback)
    valueOf.returns(20);
    paused();

    expect(callback).not.to.have.been.called;
  });

  it('should not accumulate time when when paused', () => {
    let pausedValue = true;
    const paused = createLoop(configuredDelta, () => pausedValue, callback, remainderCallback)
    valueOf.returns(20);
    paused();
    valueOf.returns(40);
    paused();
    valueOf.returns(60);
    paused();

    valueOf.returns(65);
    pausedValue = false;
    paused();

    expect(callback).not.to.have.callCount(1);

    valueOf.returns(80);
    paused();
    expect(callback).to.have.been.calledWith(20, 20);
  });
});