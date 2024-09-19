import { useCallback } from "react";
/** @module Hooks */
/**
 * Pintura Hook to open pintura image editing modal
 *
 * @todo switch pintura to paid version
 *

 *
 * @function
 */
const usePintura = () => {
  const pintura = useCallback(
    ({
      file,
      cropAspect,
      quality = 0.7,
      targetSize = {
        width: 3000,
        height: 3000,
        fit: "contain",
        upscale: false,
      },
    }: {
      file: File | string;
      cropAspect?: number;
      quality?: number;
      targetSize?: null | {
        width: number;
        height: number;
        fit: string;
        upscale: boolean;
      };
    }) => {
      return new Promise<File>((resolve, reject) => {
        let url: string;
        if (typeof file === "string") {
          url = file;
        } else {
          url = URL.createObjectURL(file);
        }

        import("../modules/pintura/pintura").then(({ openDefaultEditor }) => {
          const editor: any = openDefaultEditor({
            src: url,
            imageWriter: {
              canvasMemoryLimit: 2048 * 2048,

              copyImageHead: false,
              quality: quality,
              mimeType: "image/jpeg",
              targetSize: targetSize,
            },
            imageCropAspectRatio: cropAspect,
          });

          editor.on("close", () => {
            URL.revokeObjectURL(url);
            reject("canceled");
            // the user cancelled editing the image
          });
          editor.on("process", async ({ dest }: ImageState) => {
            URL.revokeObjectURL(url);
            resolve(dest);
          });
        });
      });
    },
    []
  );

  interface ImageState {
    imageState: {
      crop: { width: number; height: number };
    };
    dest: File;
  }

  const pinturaImageState = useCallback(
    ({
      file,
      cropAspect,
      quality = 0.7,
      targetSize = {
        width: 3000,
        height: 3000,
        fit: "contain",
        upscale: false,
      },
    }: {
      file: File | string;
      cropAspect?: number;
      quality?: number;
      targetSize?: {
        width: number;
        height: number;
        fit: string;
        upscale: boolean;
      };
    }) => {
      return new Promise<ImageState>((resolve, reject) => {
        let url: string;
        if (typeof file === "string") {
          url = file;
        } else {
          url = URL.createObjectURL(file);
        }

        import("../modules/pintura/pintura").then(({ openDefaultEditor }) => {
          const editor: any = openDefaultEditor({
            src: url,
            imageWriter: {
              canvasMemoryLimit: 4096 * 4096,
              copyImageHead: false,
              quality: quality,
              mimeType: "image/jpeg",
              targetSize: targetSize,
            },
            imageCropAspectRatio: cropAspect,
          });

          editor.on("close", () => {
            URL.revokeObjectURL(url);
            reject("canceled");
            // the user cancelled editing the image
          });
          editor.on("process", async ({ dest, imageState }: ImageState) => {
            URL.revokeObjectURL(url);
            resolve({ imageState, dest });
          });
        });
      });
    },
    []
  );

  const pinturaImageProcess = useCallback(
    ({
      file,
      cropAspect,
      quality = 0.7,
      targetSize = {
        width: 3000,
        height: 3000,
        fit: "contain",
        upscale: false,
      },
    }: {
      file: File | string;
      cropAspect?: number;
      quality?: number;
      targetSize?: {
        width: number;
        height: number;
        fit: string;
        upscale: boolean;
      };
    }) => {
      return new Promise<ImageState>((resolve) => {
        let url: string;
        if (typeof file === "string") {
          url = file;
        } else {
          url = URL.createObjectURL(file);
        }

        import("../modules/pintura/pintura").then(
          async ({ processDefaultImage }) => {
            const { dest, imageState } = await processDefaultImage(url, {
              imageWriter: {
                canvasMemoryLimit: 4096 * 4096,
                copyImageHead: false,
                quality: quality,
                mimeType: "image/jpeg",
                targetSize: targetSize,
              },
              imageCropAspectRatio: cropAspect,
            });

            resolve({ imageState, dest });
          }
        );
      });
    },
    []
  );

  return { pintura, pinturaImageState, pinturaImageProcess };
};
export default usePintura;
