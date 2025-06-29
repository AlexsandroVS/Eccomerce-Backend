import multer from 'multer';
import fs from 'fs';
import path from 'path';

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
      cb(null, `${unique}-${file.originalname}`);
    }
  });

  return multer({ storage });
}
