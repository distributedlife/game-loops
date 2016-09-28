import now from './now';

export default function (maxΔ, isPaused, onStep) {
  let t0 = now();
  let t = 0;

  const updateT0 = (t1) => (t0 = t1);

  function doRunning (t1) {
    let frameΔ = (t1 - t0);
    updateT0(t1);

    while(frameΔ > 0) {
      const Δ = Math.min(frameΔ, maxΔ);
      t += Δ;
      onStep(Δ, t);
      frameΔ -= Δ;
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