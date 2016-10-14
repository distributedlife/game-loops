import now from './now';

export default function (Δ, isPaused, onStep, maxFrameStep = Infinity) {
  let t0;
  let accumulator = 0;
  let t = 0;

  const updateT0 = (t1) => (t0 = t1);

  function doRunning (t1) {
    const frameStep = (t1 - t0);
    accumulator += Math.min(frameStep, maxFrameStep);

    while(accumulator >= Δ) {
      t += Δ;
      onStep(Δ, t);
      accumulator -= Δ;
    }
  }

  return function step () {
    t0 = t0 || now();
    const t1 = now();

    if (!isPaused()) {
      doRunning(t1);
    }

    updateT0(t1);
  }
}