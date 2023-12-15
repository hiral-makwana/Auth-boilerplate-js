"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUploader = void 0;
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
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
let globalFileUploader;
const createDirectory = (directoryPath) => {
    if (!fs_1.default.existsSync(directoryPath)) {
        fs_1.default.mkdirSync(directoryPath);
    }
};
const createUploader = (options = {}) => {
    // Set up multer storage and file filtering
    const uploadFolder = options.uploadFolder || 'uploads/';
    createDirectory(uploadFolder);
    const storage = multer_1.default.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadFolder);
        },
        filename: function (req, file, cb) {
            file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf-8');
            cb(null, file.originalname);
            //cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        },
    });
    return (0, multer_1.default)({ storage: storage }).single('avatar');
};
exports.createUploader = createUploader;
//# sourceMappingURL=mediaUpload.js.map