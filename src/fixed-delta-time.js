export default function (frameΔ, isPaused, onStep) {
  let t = 0;

  function doRunning () {
    t += frameΔ;
    onStep(frameΔ, t);
  }

  return function step () {
    if (!isPaused()) {
      doRunning();
    }
  }
}