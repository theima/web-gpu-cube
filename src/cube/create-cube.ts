import { vec3, mat4 } from 'gl-matrix';
import { createGPUBuffer } from '../create-gpu-buffer';
import { createViewProjection } from './create-view-projection';
import { createTransforms } from './create-transforms';
import { startAnimation } from '../start-animation';
import { getCubeData } from './get-cube.vertex-data';
import { GpuInfo } from '../gpu-info';
import { createPipeline } from './create-pipeline';
import { createRenderPassDescription } from './create-render-pass-description';
import { createUniformBindGroup } from './create-uniform-bind-group';
const createCamera = require('3d-view-controls');

export function createCube(
  gpu: GpuInfo,
  lightParams: Float32Array,
  animate: boolean = true,
  rotation: vec3 = vec3.fromValues(0, 0, 0),
  vMatrix?: mat4
): (stopCallback: (pos: vec3, mat: mat4) => void) => void {
  const data = getCubeData();

  const vertexData = data.positions;
  const normalData = data.normals;
  const device = gpu.device;

  const pipeline = createPipeline(device, gpu.format);

  const vertexUniformBuffer = createBuffer(device, 192);
  const fragmentUniformBuffer = createBuffer(device, 32);
  const lightUniformBuffer = createBuffer(device, 48);

  const uniformBindGroup = createUniformBindGroup(
    device,
    pipeline,
    vertexUniformBuffer,
    fragmentUniformBuffer,
    lightUniformBuffer
  );

  const renderPassDescription = createRenderPassDescription(
    device,
    [gpu.canvas.width, gpu.canvas.height, 1],
    gpu.context.getCurrentTexture().createView()
  );

  device.queue.writeBuffer(lightUniformBuffer, 0, lightParams);

  const normalMatrix = mat4.create();
  const modelMatrix = mat4.create();

  const vp = createViewProjection(gpu.canvas.width / gpu.canvas.height);
  let vpMatrix = vp.viewProjectionMatrix;

  var camera = createCamera(gpu.canvas, vp.cameraOption);
  if (vMatrix) {
    camera.matrix = vMatrix;
  }

  const numberOfVertices = vertexData.length / 3;
  const vertexBuffer = createGPUBuffer(device, vertexData);
  const normalBuffer = createGPUBuffer(device, normalData);

  function drawFrame() {
    if (animate) {
      rotation[0] += 0.01;
      rotation[1] += 0.01;
      rotation[2] += 0.01;
    }
    if (camera.tick()) {
      const pMatrix = vp.projectionMatrix;
      vMatrix = camera.matrix;
      mat4.multiply(vpMatrix, pMatrix, vMatrix!);
      const eyePosition = new Float32Array(camera.eye.flat());
      const lightPosition = eyePosition;
      device.queue.writeBuffer(vertexUniformBuffer, 0, vpMatrix as ArrayBuffer);
      device.queue.writeBuffer(fragmentUniformBuffer, 0, eyePosition);
      device.queue.writeBuffer(fragmentUniformBuffer, 16, lightPosition);
    }

    createTransforms(modelMatrix, [0, 0, 0], rotation);
    mat4.invert(normalMatrix, modelMatrix);
    mat4.transpose(normalMatrix, normalMatrix);
    device.queue.writeBuffer(vertexUniformBuffer, 64, modelMatrix as ArrayBuffer);
    device.queue.writeBuffer(vertexUniformBuffer, 128, normalMatrix as ArrayBuffer);

    (renderPassDescription.colorAttachments as any)[0].view = gpu.context.getCurrentTexture().createView();
    const commandEncoder = device.createCommandEncoder();
    const renderPass = commandEncoder.beginRenderPass(renderPassDescription);

    renderPass.setPipeline(pipeline);
    renderPass.setVertexBuffer(0, vertexBuffer);
    renderPass.setVertexBuffer(1, normalBuffer);
    renderPass.setBindGroup(0, uniformBindGroup);
    renderPass.draw(numberOfVertices);
    renderPass.end();

    device.queue.submit([commandEncoder.finish()]);
  }
  const startedAnimation = startAnimation(drawFrame);

  return (stopCallback: (pos: vec3, cameraMatrix: mat4) => void) => {
    startedAnimation.stop(() => {
      stopCallback(rotation, vMatrix!);
    });
  };
}

function createBuffer(device: GPUDevice, size: number): GPUBuffer {
  return device.createBuffer({
    size,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
}
