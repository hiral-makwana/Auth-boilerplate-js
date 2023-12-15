import path from 'path'
import multer from 'multer'
import fs from 'fs';
// const tempStorage = multer.diskStorage({
//   destination: path.join(__dirname, '../uploads'),
//   filename: (req: any, file: any, cb: any) => {
//     file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf-8');
//     cb(null, file.originalname)
//   }
// });
// const upload = multer({
//   storage: tempStorage
// })

// function handleFileUpload(req, res) {
//   upload.single('file')(req, res, function (err) {
//     if (err) {
//       return res.status(500).send('File upload failed.');
//     }
//     res.send('File uploaded successfully.');
//   });
// }
//export { upload, tempStorage }

let globalFileUploader: any;
const createDirectory = (directoryPath?: any) => {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath);
  }
};

const createUploader = (options: any = {}) => {
  // Set up multer storage and file filtering
  const uploadFolder = options.uploadFolder || 'uploads/';

  createDirectory(uploadFolder);

  const storage = multer.diskStorage({
    destination: function (req: any, file: any, cb: any) {
      cb(null, uploadFolder);
    },
    filename: function (req: any, file: any, cb: (arg0: any, arg1: any) => void) {
      file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf-8');
      cb(null, file.originalname)
      //cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
  });

  return multer({ storage: storage }).single('avatar');
};

export { createUploader };