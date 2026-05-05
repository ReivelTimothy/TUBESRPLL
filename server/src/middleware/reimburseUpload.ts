import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/apiError';

const reimburseUploadPath = path.resolve(process.cwd(), 'uploads', 'reimbursements');
fs.mkdirSync(reimburseUploadPath, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, reimburseUploadPath);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    cb(new ApiError(400, 'Only JPG, JPEG, and PNG files are allowed.') as any);
    return;
  }
  cb(null, true);
};

export const reimburseUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

export const uploadReimburseReceipt = (req: Request, res: Response, next: NextFunction) => {
  const handler = reimburseUpload.single('receipt');
  handler(req, res, (err: any) => {
    if (!err) {
      next();
      return;
    }

    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
      next(new ApiError(400, 'File is too large. Maximum allowed size is 2MB.'));
      return;
    }

    next(err);
  });
};
