import multer from "multer";
import cloudinary from "../../authorizations/cloudinary.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";


//filetype consentiti:
const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
//dimensione max:
const maxSize = 1 * 1024 * 1024;

//storage per Cover article:
const coverStorage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'cover'
    },
});

//controllo size e type:
const fileFilter = (req, file, cb) => {
    if(!allowedTypes.includes(file.mimetype)) {
      const error = new Error(`Invalid file type. Try to upload: ${allowedTypes}. Max size: ${maxSize}`);
      error.code = "INVALID_FILE_TYPE";
      return cb(error, false);
    }
    cb(null, true);
}

const coverUpload = multer({
    storage: coverStorage,
    fileFilter: fileFilter,
    limits: {
     fileSize: maxSize
    }  
}).single('cover');


export default coverUpload;