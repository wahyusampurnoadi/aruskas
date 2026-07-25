export async function uploadImage(file) {
  if (!file) return "";

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName) {
    throw new Error(
      "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME belum diisi di .env.local"
    );
  }

  if (!uploadPreset) {
    throw new Error(
      "NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET belum diisi di .env.local"
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("Cloudinary Error:", data);

    throw new Error(
      data?.error?.message ||
        "Upload gambar ke Cloudinary gagal."
    );
  }

  return data.secure_url;
}