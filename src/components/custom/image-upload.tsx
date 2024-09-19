"use client";

import {
  createDefaultImageReader,
  createDefaultImageWriter,
  getEditorDefaults,
  openEditor,
  processImage,
} from "@/modules/pintura/pintura";

import FilePondPluginImageEditor from "@pqina/filepond-plugin-image-editor";
import FilePondPluginFilePoster from "filepond-plugin-file-poster";
import { FilePond, registerPlugin } from "react-filepond";

registerPlugin(FilePondPluginImageEditor, FilePondPluginFilePoster);

export default function ImageUpload({
  cropAspect,
  file,
  onupdatefiles,
}: {
  cropAspect?: number;
  file?: File;
  onupdatefiles?: (file: File) => void;
}) {
  return (
    <FilePond
      allowImageEditor
      imageEditorInstantEdit
      imageEditorAllowEdit
      imageEditorAfterWriteImage={(e) => {
        if (e.dest) {
          onupdatefiles && onupdatefiles(e.dest as unknown as File);
        }

        return e.dest;
      }}
      imageEditor={{
        // used to create the editor, receives editor configuration, should return an editor instance
        createEditor: openEditor,

        // Required, used for reading the image data
        imageReader: [createDefaultImageReader],

        // optionally. can leave out when not generating a preview thumbnail and/or output image
        imageWriter: [createDefaultImageWriter],
        // used to generate poster images, runs an editor in the background
        imageProcessor: processImage,

        // Pintura Image Editor properties
        editorOptions: {
          ...getEditorDefaults({}),
          imageCropAspectRatio: cropAspect,
        },
      }}
      acceptedFileTypes={["images/*"]}
      // files={file ? [file] : []}
      name="files" /* sets the file input name, it's filepond by default */
      labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
    />
  );
}
