import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { put } from "@vercel/blob";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Uploads a multer memory-storage file (req.file).
// Uses Vercel Blob if token exists; falls back to saving locally in backend/uploads.
export async function uploadToBlob(file, folder = "tiles") {
  // If Vercel Blob token is configured, use Vercel Blob
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const ext = (file.originalname || "image.png").split(".").pop();
      const filename = `${folder}/${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
      const blob = await put(filename, file.buffer, {
        access: "public",
        contentType: file.mimetype || "image/png",
        addRandomSuffix: true,
      });
      return blob.url;
    } catch (blobErr) {
      console.warn("Vercel Blob upload failed, falling back to local storage:", blobErr.message);
    }
  }

  // Local filesystem fallback: write file to backend/uploads
  const uploadsDir = path.join(__dirname, "..", "uploads", folder);
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const ext = (file.originalname || "image.png").split(".").pop().toLowerCase();
  const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
  const targetPath = path.join(uploadsDir, safeName);

  await fs.promises.writeFile(targetPath, file.buffer);
  return `/uploads/${folder}/${safeName}`;
}
