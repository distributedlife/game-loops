import now from './now';

export default function (isPaused, onStep) {
  let t0;
  let t = 0;

  const updateT0 = (t1) => (t0 = t1);

  function doRunning (t1) {
    const frameΔ = (t1 - t0);

    if (frameΔ > 0) {
      t += frameΔ;
      onStep(frameΔ, t);
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