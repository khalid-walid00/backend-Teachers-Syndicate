// services/storage.service.js
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const uploadDir = path.join(__dirname, '../../uploads');
const imageDir = path.join(uploadDir, 'images');
const fileDir = path.join(uploadDir, 'files');

// تهيئة Cloudinary لو env موجود
if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('✅ Cloudinary storage enabled');
} else {
  console.log('💾 Using local storage');
  [uploadDir, imageDir, fileDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

/**
 * تحديد نوع الملف (صورة أو ملف عادي)
 */
function getUploadPath(mimetype) {
  if (mimetype && mimetype.startsWith('image/')) {
    return imageDir;
  }
  return fileDir;
}

/**
 * رفع ملف
 * @param {Buffer|string} fileBuffer
 * @param {string} filename
 * @param {string} mimetype - نوع الملف (عشان نحدد مكان التخزين)
 * @returns {string} URL الملف
 */
async function uploadFile(fileBuffer, filename, mimetype) {
  console.log("cloud_name",cloudinary.config());
  if (cloudinary.config().cloud_name) {
    let folder = mimetype && mimetype.startsWith('image/') ? '/Teachers-Syndicate/uploads/images' : '/Teachers-Syndicate/uploads/files';

    let tempFilePath = null;
    if (typeof fileBuffer === 'string') {
      tempFilePath = fileBuffer;
    } else {
      const targetDir = getUploadPath(mimetype);
      tempFilePath = path.join(targetDir, filename);
      fs.writeFileSync(tempFilePath, fileBuffer);
    }

    try {
      const result = await cloudinary.uploader.upload(tempFilePath, {
        public_id:`${Date.now()}-${path.parse(filename).name}`,
        folder: folder, // التخزين جوه فولدر مختلف
        overwrite: true,
        resource_type: 'auto',
      });

      if (typeof fileBuffer !== 'string') {
        fs.unlinkSync(tempFilePath);
      }

      return result.secure_url;
    } catch (err) {
      if (typeof fileBuffer !== 'string' && fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
      throw err;
    }
  } else {
    const targetDir = getUploadPath(mimetype);
    const filePath = path.join(targetDir, filename);
    fs.writeFileSync(filePath, fileBuffer);

    const relativePath = mimetype && mimetype.startsWith('image/')
      ? `/Teachers-Syndicate/uploads/images/${filename}`
      : `/Teachers-Syndicate/uploads/files/${filename}`;

    return relativePath;
  }
}

/**
 * حذف ملف
 * @param {string} filename
 */
async function deleteFile(fileUrl) {
  if (cloudinary.config().cloud_name) {
    try {
      const parts = fileUrl.split("/upload/")[1];
      const publicId = parts.replace(/\.[^/.]+$/, ""); 

      console.log("Deleting publicId:", publicId);
      await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
    } catch (err) {
      console.error("Failed to delete from Cloudinary:", err);
    }
  } else {
    // local deletion
    const localPathImage = path.join(imageDir, fileUrl);
    const localPathFile = path.join(fileDir, fileUrl);
    if (fs.existsSync(localPathImage)) fs.unlinkSync(localPathImage);
    if (fs.existsSync(localPathFile)) fs.unlinkSync(localPathFile);
  }
}


module.exports = {
  uploadFile,
  deleteFile,
};
