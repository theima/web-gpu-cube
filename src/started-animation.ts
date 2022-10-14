import { vec3 } from 'gl-matrix';

export interface StartedAnimation {
  stop: (callback: () => void) => void;
}
