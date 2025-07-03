import multer from 'multer';
import fs from 'fs';
import path from 'path';
import slugify from 'slugify';

export function createMulterUploader(folderName: string) {
  const storage = multer.diskStorage({
    destination: (req, _file, cb) => {
      const itemId = req.params.id;
      const uploadPath = path.join('uploads', folderName, itemId);

      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: (_req, file, cb) => {
      const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const originalName = file.originalname;
      const ext = path.extname(originalName);
      const base = path.basename(originalName, ext);
      const safeBase = slugify(base, { lower: true, strict: true });
      const safeName = `${safeBase}${ext}`;
      cb(null, `${unique}-${safeName}`);
    }
  });

  return multer({ storage });
}
