import requireInject from 'require-inject';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

const valueOf = sinon.stub().returns(0);
const moment = () => ({ valueOf });

describe('fixed-time-step', () => {
  const configuredDelta = 20;
  const createLoop = requireInject('./fixed-time-step', { moment }).default;

  let loop;
  let callback;
  beforeEach(() => {
    valueOf.returns(1);

    callback = sinon.spy();
    loop = createLoop(configuredDelta, () => false, callback);
    loop();
  })

  it('should execute the function if the configured delta has elapsed', () => {
    valueOf.returns(21);
    loop();

    expect(callback).to.have.been.called;
  });

  it('should execute the function multiple times for each multiple of the configuredDelta', () => {
    valueOf.returns(65);
    loop();

    expect(callback).to.have.callCount(3);
  });

  it('should cap the number of executions to a configured value', () => {
    const cappedLoop = createLoop(configuredDelta, () => false, callback, 20);
    cappedLoop();

    valueOf.returns(65);
    cappedLoop();

    expect(callback).to.have.callCount(1);
  });

  it('should accumulate left over milliseconds between loops', () => {
    valueOf.returns(5);
    loop();
    valueOf.returns(10);
    loop();
    valueOf.returns(19);
    loop();
    expect(callback).not.to.have.been.called;

    valueOf.returns(40);
    loop();
    expect(callback).to.have.callCount(1);

    valueOf.returns(41);
    loop();
    expect(callback).to.have.callCount(2);
  });

  it('should pass the configuredDelta and elapsed time to the callback', () => {
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
    const paused = createLoop(configuredDelta, () => true, callback)
    valueOf.returns(20);
    paused();

    expect(callback).not.to.have.been.called;
  });

  it('should not accumulate time when when paused', () => {
    let pausedValue = true;
    const paused = createLoop(configuredDelta, () => pausedValue, callback)
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