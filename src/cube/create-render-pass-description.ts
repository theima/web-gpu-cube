export function createRenderPassDescription(
  device: GPUDevice,
  size: GPUExtent3DStrict,
  textureView: GPUTextureView
): GPURenderPassDescriptor {
  const depthTexture = device.createTexture({
    size,
    format: 'depth24plus',
    usage: GPUTextureUsage.RENDER_ATTACHMENT,
  });

  return {
    colorAttachments: [
      {
        view: textureView,
        clearValue: { r: 0.2, g: 0.247, b: 0.314, a: 1.0 },
        loadOp: 'clear',
        storeOp: 'store',
      },
    ],
    depthStencilAttachment: {
      view: depthTexture.createView(),
      depthClearValue: 1.0,
      depthStoreOp: 'store',
      stencilClearValue: 0,
      depthLoadOp: 'clear',
    },
  };
}
