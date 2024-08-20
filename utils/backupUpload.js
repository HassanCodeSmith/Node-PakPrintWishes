const fs = require("fs");
const path = require("path");
const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
  region: "ap-south-1",
});

const s3 = new AWS.S3();

const localPath = path.join(__dirname, "../DB_BACKUP/backup.json");

const readFilesFromPath = (path) => {
  try {
    const stats = fs.statSync(path);

    if (stats.isFile()) {
      return [path];
    } else if (stats.isDirectory()) {
      return fs.readdirSync(path).map((file) => path.join(path, file));
    } else {
      throw new Error("Path is neither a file nor a directory");
    }
  } catch (error) {
    console.error("Error reading files from path:", error);
    return [];
  }
};

const uploadFileToS3 = async (filePath) => {
  const fileContent = fs.readFileSync(filePath);
  const fileName = path.basename(filePath);

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const newFileName = `${timestamp}_${fileName}`;

  const s3Key = `db_backup/${newFileName}`;

  const params = {
    Bucket: "pakprintwishes-main",
    Key: s3Key,
    Body: fileContent,
  };

  try {
    await s3.upload(params).promise();
    console.log(`File ${s3Key} uploaded successfully.`);
  } catch (error) {
    console.error(`Error uploading file ${s3Key}:`, error.message);
    console.error(error.stack);
  }
};

const uploadImagesToS3 = async () => {
  const files = readFilesFromPath(localPath);

  console.log("Files to upload:", files);

  for (const filePath of files) {
    console.log("Uploading file:", filePath);
    await uploadFileToS3(filePath);
  }
};

module.exports = {
  readFilesFromPath,
  uploadFileToS3,
  uploadImagesToS3,
};
