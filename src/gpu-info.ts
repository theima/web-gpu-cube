export interface GpuInfo {
  device: GPUDevice;
  canvas: HTMLCanvasElement;
  format: GPUTextureFormat;
  context: GPUCanvasContext;
}
