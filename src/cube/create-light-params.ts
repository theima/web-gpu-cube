import { LightInputs } from '../light-inputs';

export function createLightParams(li: LightInputs): Float32Array {
  const lightParams = [] as any;
  lightParams.push([li.colour[0], li.colour[1], li.colour[2], 1.0]);
  lightParams.push([li.specularColour[0], li.specularColour[1], li.specularColour[2], 1.0]);
  lightParams.push([li.ambientIntensity, li.diffuseIntensity, li.specularIntensity, li.shininess]);
  return new Float32Array(lightParams.flat());
}
