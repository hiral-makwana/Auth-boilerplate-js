const multer = require('multer');
const fs = require('fs');

let globalFileUploader;

const createDirectory = (directoryPath) => {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath);
  }
};

const createUploader = (options = {}) => {
  // Set up multer storage and file filtering
  const uploadFolder = options.uploadFolder || 'uploads/';

  createDirectory(uploadFolder);

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadFolder);
    },
    filename: function (req, file, cb) {
      file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf-8');
      cb(null, file.originalname);
    },
  });

  return multer({ storage: storage }).single('avatar');
};

module.exports = { createUploader };
