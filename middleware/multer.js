import multer from "multer";
import path from "path";
import fs from "fs";

// Max size in bytes (e.g., 5MB = 5 * 1024 * 1024)
const DEFAULT_MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export const getMulterUpload = (
  folder = "uploads",
  allowedTypes = ["image/", "application/pdf"],
  maxSize = DEFAULT_MAX_SIZE
) => {
  // Ensure folder exists
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, folder);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, Date.now() + ext);
    },
  });

  const fileFilter = (req, file, cb) => {
    const isAllowed = allowedTypes.some(type =>
      file.mimetype.startsWith(type)
    );
    if (isAllowed) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type."), false);
    }
  };

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxSize, // Max size in bytes
    },
  });
};
