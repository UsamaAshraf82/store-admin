export interface cloudinaryUploadType {
  file: File;
  upload_preset?: string;
}

export const upload_cloudinary = async ({
  file,
  upload_preset = "fwelpdrw",
}: cloudinaryUploadType) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", upload_preset);

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/dm4djeo8m/image/upload",
    { method: "post", body: formData }
  );

  const data = await response.json();

  return data as { secure_url: string; width: number; height: number };
};
