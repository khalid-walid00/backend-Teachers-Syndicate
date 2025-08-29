const { uploadFile } = require('./services/storage.service');
const path = require('path');
const multer = require('multer');
const upload = multer({ dest: 'temp/' }); // مجلد مؤقت لحفظ الملفات المرفوعة

// راوتر رفع ملف
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    // ملف مرفوع مؤقتا على السيرفر
    const tempFilePath = req.file.path; // المسار المؤقت
    const originalName = req.file.originalname; // اسم الملف الأصلي

    // استدعاء دالة الرفع، ترفع من مسار الملف المؤقت
    const fileUrl = await uploadFile(tempFilePath, originalName);

    // حذف الملف المؤقت بعد الرفع (multer لا يحذفه تلقائياً)
    const fs = require('fs');
    fs.unlinkSync(tempFilePath);

    res.json({ url: fileUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'فشل في رفع الملف' });
  }
});
