/* eslint-disable @next/next/no-img-element */
"use client";

import usePintura from "@/hooks/usePintura";
import {
  OnSelectProps,
  ReactDropzoneVV,
  useReactDropzoneVV,
} from "react-dropzone-vv";

export default function ImageUpload({
  cropAspect,
  file,
  onupdatefiles,
}: {
  cropAspect?: number;
  file?: { file: File | null; url: string };
  onupdatefiles?: (file: { file: File; url: string }) => void;
}) {
  const { pintura } = usePintura();
  const reactDropzoneVV = useReactDropzoneVV();

  const handleSelect = async ({ acceptedFiles }: OnSelectProps) => {
    const select: {
      file: File;
      url: string;
    }[] = [];

    if (acceptedFiles[0]) {
      const ele = await pintura({
        file: acceptedFiles[0],
        cropAspect: cropAspect,
        quality: 80,
        targetSize: {
          width: 2000,
          height: 2000,
          fit: "contain",
          upscale: false,
        },
      });
      onupdatefiles &&
        onupdatefiles({
          file: ele,
          url: URL.createObjectURL(ele),
        });
    }
  };

  return (
    <>
      <ReactDropzoneVV
        reactDropzoneVV={reactDropzoneVV}
        accept="image/*"
        onSelect={handleSelect}
        // onError={handleError}
      >
        <div className="p-4 border  border-neutral-800 border-dashed bg-transparent">
          {file?.url ? (
            <img
              src={file?.url}
              className="max-h-96 object-contain w-full"
              alt=""
            />
          ) : (
            <p>Drag & drop image</p>
          )}
        </div>
      </ReactDropzoneVV>
      <div className="grid grid-cols-3 gap-2">
        {/* {file?.map((i, k) => (
          <div key={i.url} className="bg-black/50 relative">
            <img
              src={i.url}
              className="max-h-96 object-contain w-full"
              alt=""
            />
            <Button
              variant={"ghost"}
              className="absolute top-2 right-2 text-white"
              onClick={() => {
                // setAcceptedFiles((files) => {
                file.splice(k, 1);
                onupdatefiles && onupdatefiles([...file]);
                // return [...files];
                // });
              }}
            >
              <Trash />
            </Button>
          </div>
        ))} */}
      </div>
    </>
  );
}
