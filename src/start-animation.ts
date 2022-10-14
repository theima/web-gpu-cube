import { StartedAnimation } from './started-animation';

export function startAnimation(drawFrame: () => any): StartedAnimation {
  let stopped: boolean = false;
  let stopCallback: () => void;
  const stopCall = (callback: () => void) => {
    stopCallback = callback;
    stopped = true;
  };
  const readyToRestart = () => {
    stopCallback?.();
  };
  function frame() {
    drawFrame();
    if (!stopped) {
      requestAnimationFrame(frame);
    } else {
      readyToRestart();
    }
  }
  requestAnimationFrame(frame);
  return {
    stop: stopCall,
  };
}
