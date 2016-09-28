import now from './now';

export default function (Δ, isPaused, onStep, onRemainder) {
  let t0 = now();
  let accumulator = 0;
  let t = 0;

  const updateT0 = (t1) => (t0 = t1);

  function doRunning (t1) {
    accumulator += (t1 - t0);
    updateT0(t1);

    while(accumulator >= Δ) {
      t += Δ;
      onStep(Δ, t);
      accumulator -= Δ;
    }

    onRemainder(accumulator, t + accumulator);
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