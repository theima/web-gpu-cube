import { GpuInfo } from './gpu-info';

export async function initGPU(canvas: HTMLCanvasElement): Promise<GpuInfo> {
  const adapter = await navigator.gpu?.requestAdapter();
  const device = (await adapter?.requestDevice()) as GPUDevice;
  const context = canvas.getContext('webgpu') as unknown as GPUCanvasContext;
  const format = navigator.gpu.getPreferredCanvasFormat();

  context.configure({
    device: device,
    format: format,
    alphaMode: 'opaque',
  });
  return { device, canvas, format, context };
}
