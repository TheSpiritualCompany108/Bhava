import { put } from "@vercel/blob";

// Uploads a multer memory-storage file (req.file) to Vercel Blob and
// returns its public URL. Required because Vercel serverless functions
// have a read-only filesystem, so images can't be saved to local disk.
export async function uploadToBlob(file, folder = "tiles") {
  const ext = file.originalname.split(".").pop();
  const filename = `${folder}/${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
  const blob = await put(filename, file.buffer, {
    access: "public",
    contentType: file.mimetype,
    addRandomSuffix: true,
  });
  return blob.url;
}
