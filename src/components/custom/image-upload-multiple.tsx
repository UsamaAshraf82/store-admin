/* eslint-disable @next/next/no-img-element */
"use client";
import usePintura from "@/hooks/usePintura";
import { Trash } from "lucide-react";
import { useEffect, useState } from "react";
import {
  OnSelectProps,
  ReactDropzoneVV,
  useReactDropzoneVV,
} from "react-dropzone-vv";
import { Button } from "../ui/button";

export default function ImageUploadMultiple({
  cropAspect,
  file,
  onupdatefiles,
}: {
  cropAspect?: number;
  file?: File[];
  onupdatefiles?: (file: File[]) => void;
}) {
  const { pintura } = usePintura();

  const [acceptedFiles, setAcceptedFiles] = useState<
    {
      file: File;
      url: string;
    }[]
  >([]);

  useEffect(() => {
    onupdatefiles && onupdatefiles(acceptedFiles.map((i) => i.file));
  }, [acceptedFiles, onupdatefiles]);

  const reactDropzoneVV = useReactDropzoneVV();

  const handleSelect = async ({ acceptedFiles }: OnSelectProps) => {
    const select: {
      file: File;
      url: string;
    }[] = [];
    for (let index = 0; index < acceptedFiles.length; index++) {
      const element = acceptedFiles[index];

      const ele = await pintura({
        file: element,
        cropAspect: cropAspect,
        quality: 80,
        targetSize: {
          width: 2000,
          height: 2000,
          fit: "contain",
          upscale: false,
        },
      });

      select.push({
        file: ele,
        url: URL.createObjectURL(ele),
      });
    }
    setAcceptedFiles((files) => [...files, ...select]);
  };

  return (
    <>
      <ReactDropzoneVV
        reactDropzoneVV={reactDropzoneVV}
        accept="image/*"
        multiple
        onSelect={handleSelect}
        // onError={handleError}
      >
        <div className="p-4 border w-1/3 border-neutral-800 border-dashed bg-transparent">
          <p>Drag & drop image</p>
        </div>
      </ReactDropzoneVV>
      <div className="grid grid-cols-3 gap-2">
        {acceptedFiles.map((i, k) => (
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
                setAcceptedFiles((files) => {
                  files.splice(k, 1);
                  return [...files];
                });
              }}
            >
              <Trash />
            </Button>
          </div>
        ))}
      </div>
    </>
  );
}
