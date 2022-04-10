const multer = require("multer");

module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/gif"
    ) {
      cb(null, true);
      return;
    }
    cb(new Error("File type is not supported"), false);
  },
});
