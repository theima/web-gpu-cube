export function createUniformBindGroup(
  device: GPUDevice,
  pipeline: GPURenderPipeline,
  vertexUniformBuffer: GPUBuffer,
  fragmentUniformBuffer: GPUBuffer,
  lightUniformBuffer: GPUBuffer
): GPUBindGroup {
  return device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      {
        binding: 0,
        resource: {
          buffer: vertexUniformBuffer,
          offset: 0,
          size: 192,
        },
      },
      {
        binding: 1,
        resource: {
          buffer: fragmentUniformBuffer,
          offset: 0,
          size: 32,
        },
      },
      {
        binding: 2,
        resource: {
          buffer: lightUniformBuffer,
          offset: 0,
          size: 48,
        },
      },
    ],
  });
}
