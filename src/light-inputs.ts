import { vec3 } from 'gl-matrix';

export interface LightInputs {
  colour: vec3;
  ambientIntensity: number;
  diffuseIntensity: number;
  specularIntensity: number;
  shininess: number;
  specularColour: vec3;
}
