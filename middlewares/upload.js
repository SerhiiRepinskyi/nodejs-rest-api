import multer from "multer";
import path from "path";

const tempDir = path.resolve("temp"); // абсолютний шлях до тимчасової папки

// Налаштування multer
const storage = multer.diskStorage({
  destination: tempDir,
  filename: (req, file, cb) => {
    cb(null, file.originalname); // originalname - оригінальне і'мя файлу

    // Додати унікальне ім'я файлу (з доків multer)
    // const uniquePrefix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    // const filename = `${uniquePrefix}_${file.originalname}`;
    // cb(null, filename);
  },
});

// Обмеження на максимальний розмір файлу - 5 МБ
const limits = {
  fileSize: 1024 * 1024 * 5,
};

// middleware upload - екземпляр multer
const upload = multer({
  storage: storage,
  limits,
});

export default upload;
