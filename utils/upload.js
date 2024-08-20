// const multer = require("multer");
// const crypto = require("crypto");

// const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];

// const storageImages = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./uploads/images");
//   },
//   filename: function (req, file, cb) {
//     // console.log("====>>>", file);
//     cb(
//       null,
//       "y" +
//         new Date().toISOString().replace(/:/g, "-") +
//         "-" +
//         crypto.randomUUID() +
//         file.originalname
//     );
//   },
// });
// const storageFiles = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./uploads/files");
//   },
//   filename: function (req, file, cb) {
//     console.log("====>>>", file);
//     cb(
//       null,
//       new Date().toISOString().replace(/:/g, "-") +
//         "-" +
//         crypto.randomUUID() +
//         file.originalname
//     );
//   },
// });

// const fileFilter = function (req, file, cb) {
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Invalid file type. Only PNG, JPG, JPEG,files are allowed."));
//   }
// };

// const upload = multer({ storage: storageImages });
// const uploadFile = multer({ storage: storageFiles });

// module.exports = { upload, uploadFile };

const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");
// const allowedTypes = [
//   "image/png",
//   "image/jpg",
//   "image/jpeg",
//   //   "video/mp4",
//   //   "video/mkv",
//   //   "video/webm",
//   //   "audio/mp3",
// ];

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
  },
  region: "ap-south-1",
});

const s3Storage = multerS3({
  s3: s3,
  bucket: "pakprintwishes-main",
  acl: "public-read", // storage access type
  metadata: (req, file, cb) => {
    cb(null, { fieldname: file.fieldname });
  },
  key: (req, file, cb) => {
    const folder = "uploads/files/";
    const fileName = Date.now() + "-" + file.originalname;
    const key = folder + fileName;
    cb(null, key);
  },
});
// const filefilter = (req, file, cb) => {
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     // cb(null, false);
//     cb(
//       new Error(
//         "Invalid file type. For images PNG,JPJ,JPEG are allowed.For Videos MP4,MKV,webm are allowed and For Audio MP3 is allowed"
//       )
//     );
//   }
// };
const upload = multer({
  storage: s3Storage,
});
module.exports = { upload };
