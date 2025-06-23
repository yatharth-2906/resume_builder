const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function copyLatexTemplates(req, res) {
  const uniqueFolderName = crypto.randomBytes(12).toString("hex");
  const localTemplatesPath = path.join(__dirname, "../Templates");

  try {
    if (!fs.existsSync(localTemplatesPath)) {
      throw new Error("Templates folder not found.");
    }

    const filesToUpload = fs.readdirSync(localTemplatesPath).filter(file => {
      const fullPath = path.join(localTemplatesPath, file);
      return fs.statSync(fullPath).isFile() && !file.startsWith(".");
    });

    const uploadResults = [];

    for (const file of filesToUpload) {
      const filePath = path.join(localTemplatesPath, file);

      const result = await cloudinary.uploader.upload(filePath, {
        folder: `resume-templates/${uniqueFolderName}`,
        resource_type: "raw", // for .tex and other non-image files
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      });

      uploadResults.push(result.secure_url);
    }

    return {
      success: true,
      urls: uploadResults,
      folderName: uniqueFolderName,
      folderUrl: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/raw/upload/resume-templates/${uniqueFolderName}/`
    };
  } catch (err) {
    console.error("Error:", err.message);
    return {
      success: false,
      error: err.message,
    };
  }
}

module.exports = {
  copyLatexTemplates,
};