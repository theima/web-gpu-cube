import { mat4, vec3 } from 'gl-matrix';
import { createCube } from './cube/create-cube';
import './style.css';
import { LightInputs } from './light-inputs';
import { initGPU } from './init-gpu';
import { createLightParams } from './cube/create-light-params';

const canvas: HTMLCanvasElement = document.getElementById('canvas') as any;

function parseColour(colourString: String): vec3 {
  const pairs: [number, number, number] = colourString
    .slice(1)
    .match(/.{1,2}/g)!
    .map((hex) => parseInt(hex, 16))
    .map((v) => v / 255) as [number, number, number];

  return pairs;
}
function getColourFromColourInput(id: string): vec3 {
  const colourInput: HTMLInputElement = document.getElementById(id) as any;
  return parseColour(colourInput?.value ?? '#000000');
}

function getValueFromRangeInput(id: string): number {
  const input: HTMLInputElement = document.getElementById(id) as any;
  return parseFloat(input?.value ?? '0');
}
let stopAnimation: undefined | ((stopCallback: (pos: vec3, mat: mat4) => void) => void);
const start = () => {
  const animate: boolean = shouldAnimate();
  if (stopAnimation) {
    stopAnimation((position: vec3, cameraMatrix: mat4) => {
      init(animate, position, cameraMatrix);
    });
    return;
  }
  init(animate);
};
const init = async (animate: boolean, position?: vec3, cameraMatrix?: mat4) => {
  const li: LightInputs = {
    colour: getColourFromColourInput('colour'),
    specularColour: getColourFromColourInput('specular-colour'),
    ambientIntensity: getValueFromRangeInput('ambient'),
    diffuseIntensity: getValueFromRangeInput('diffuse'),
    specularIntensity: getValueFromRangeInput('specular'),
    shininess: getValueFromRangeInput('shininess'),
  };
  const gpuInfo = await initGPU(canvas);
  stopAnimation = createCube(gpuInfo, createLightParams(li), animate, position, cameraMatrix);
};

function setListeners(ids: string[], type: 'click' | 'change' | 'input') {
  ids.map((id) =>
    (document.getElementById(id) as HTMLInputElement).addEventListener(type, () => {
      start();
    })
  );
}
function shouldAnimate() {
  const radio: HTMLInputElement = document.getElementById('animate') as any;
  return radio.checked;
}
setListeners(['colour', 'specular-colour', 'ambient', 'diffuse', 'specular', 'shininess'], 'input');
setListeners(['animate'], 'click');
if (navigator.gpu) {
  start();
} else {
  document.getElementsByClassName('content')[0].innerHTML = "Browser doesn't support Webgpu";
}
