// middlewares/upload.middleware.js
const multer = require('multer');
const path = require('path');
const os = require('os');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, os.tmpdir()); // مجلد مؤقت للنظام
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = file.fieldname + '-' + Date.now() + ext;
    cb(null, name);
  },
});

const upload = multer({ storage });

module.exports = upload;
