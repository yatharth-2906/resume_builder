require("dotenv").config();

const os = require("os");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function copyLatexTemplates() {
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
        invalidate: true,
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

async function updateLatexFile(fileUrl, latexContent) {
  const url = new URL(fileUrl);
  const pathAfterUpload = url.pathname.split("/upload/")[1];
  if (!pathAfterUpload) throw new Error("Invalid Cloudinary URL");

  const publicId = pathAfterUpload.replace(/\.\w+$/, "");
  const fileName = path.basename(publicId) + ".tex";
  const tmpFilePath = path.join(os.tmpdir(), fileName);
  try {
    // 1. Write LaTeX to a temporary local file
    fs.writeFileSync(tmpFilePath, latexContent.trim(), "utf8");

    // 2. Delete the existing file from Cloudinary
    await cloudinary.uploader.destroy(publicId, {
      resource_type: "raw",
    });

    // 3. Upload new file with same public ID
    const result = await cloudinary.uploader.upload(tmpFilePath, {
      public_id: publicId,
      resource_type: "raw",
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      invalidate: true,
    });

    return {
      "success": true,
      "url": result.secure_url,
      "message": "File modified successfully",
    };
  } catch (err) {
    console.error("Cloudinary update (delete-reupload) error:", err);
    return {
      "success": false,
      "message": err.message,
    };
  } finally {
    fs.unlinkSync(tmpFilePath);
  }
}

module.exports = {
  copyLatexTemplates,
  updateLatexFile,
};