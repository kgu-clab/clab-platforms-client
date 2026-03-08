const IMAGE_EXTENSIONS = /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i;

export const isImageFile = (fileName: string): boolean =>
  IMAGE_EXTENSIONS.test(fileName);
