import now from './now';

export default function (isPaused, onStep) {
  let t0 = now();
  let t = 0;

  const updateT0 = (t1) => (t0 = t1);

  function doRunning (t1) {
    const frameΔ = (t1 - t0);
    updateT0(t1);

    if (frameΔ > 0) {
      t += frameΔ;
      onStep(frameΔ, t);
    }
  }

  return function step () {
    const t1 = now();

    if (isPaused()) {
      updateT0(t1);
    } else {
      doRunning(t1);
    }
  }
}