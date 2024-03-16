const multer = require('multer');
const Image = require('../models/Image');

// Настройка multer для сохранения файлов в папку uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage }).single('image'); // Здесь 'image' - имя поля из формы, где передается файл

exports.uploadImage = (req, res, next) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      // Ошибка multer
      return res.status(400).json({ message: 'Multer error: ' + err.message });
    } else if (err) {
      // Другие ошибки
      return res.status(500).json({ message: 'Error uploading file: ' + err.message });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No image file uploaded' });
      }

      // Создаем новую запись в базе данных для загруженного изображения
      const newImage = new Image({
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
      });

      // Сохраняем изображение в базе данных
      await newImage.save();

      // Формируем URL для доступа к загруженному изображению
      const imageUrl = `${req.protocol}://${req.get('host')}/${newImage.path}`;

      res.status(200).json({ message: 'Image uploaded successfully', imageUrl });
    } catch (error) {
      next(error);
    }
  });
};
