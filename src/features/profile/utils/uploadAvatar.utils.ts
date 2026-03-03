import { profileApi } from "../api/api";
import { createCloudinaryClient } from "../api/cloudinary";

/**
 * Upload avatar แบบ Signed Upload
 */
export async function uploadAvatar(file: File): Promise<string> {
  // 1️⃣ ขอ signature จาก backend
  const sigRes = await profileApi.getAvatarSignature();

  const { timestamp, signature, cloudName, apiKey, folder, publicId } =
    sigRes.data.data;

  // 2️⃣ เตรียม formData
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("folder", folder);
  formData.append("public_id", publicId);
  formData.append("overwrite", "true");

  // 3️⃣ ยิงไป Cloudinary ด้วย axios
  const cloudinary = createCloudinaryClient(cloudName);

  const { data } = await cloudinary.post("/image/upload", formData);

  if (!data.secure_url) {
    throw new Error("Invalid Cloudinary response");
  }

  return data.secure_url as string;
}
