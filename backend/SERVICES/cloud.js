require("dotenv").config();

const os = require("os");
const fs = require("fs").promises;
const path = require("path");
const crypto = require("crypto");
const streamifier = require('streamifier');
const cloudinary = require("cloudinary").v2;

const Version = require('../MODELS/version');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function copyLatexTemplates() {
  const uniqueFolderName = crypto.randomBytes(12).toString("hex");
  const localTemplatesPath = path.join(__dirname, "../Templates");

  try {
    await fs.access(localTemplatesPath);

    const files = await fs.readdir(localTemplatesPath);
    const filesToUpload = [];

    for (const file of files) {
      const fullPath = path.join(localTemplatesPath, file);
      const stats = await fs.stat(fullPath);
      if (stats.isFile() && !file.startsWith(".")) {
        filesToUpload.push(file);
      }
    }

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
  const fileName = `${path.basename(publicId)}-${Date.now()}.tex`;
  /* const fileName = path.basename(publicId) + ".tex"; */
  const tmpFilePath = path.join(os.tmpdir(), fileName);

  try {
    // 1. Write LaTeX to a temporary local file
    await fs.writeFile(tmpFilePath, latexContent.trim(), "utf8");

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
    try {
      if (tmpFilePath) {
        await fs.access(tmpFilePath);
        await fs.unlink(tmpFilePath);
      }
    } catch (cleanupErr) {
      console.warn("Temp file cleanup failed:", cleanupErr.message);
    }
  }
}

async function uploadPDF(buffer, userFolder, templateFileName) {
  const version = Date.now();
  const resumeNumber = templateFileName.replace('template', '').replace('.tex', '');
  const publicId = `resume${resumeNumber}-${version}`;

  const key = `resume${resumeNumber}`;

  try {
    // Delete Older Version 
    const olderVersion = await Version.findOne({ template_folder: userFolder }) || null;
    if (olderVersion && olderVersion[key]) {
      const oldVersion = olderVersion[key];
      const oldPublicId = `resume-templates/${userFolder}/resume${resumeNumber}-${oldVersion}.pdf`;
      await cloudinary.uploader.destroy(oldPublicId, {
        resource_type: 'raw',
        type: 'upload',
        invalidate: true
      });
    } else if (olderVersion) {
      const oldPublicId = `resume-templates/${userFolder}/resume${resumeNumber}.pdf`;
      await cloudinary.uploader.destroy(oldPublicId, {
        resource_type: 'raw',
        type: 'upload',
        invalidate: true
      });
    }

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `resume-templates/${userFolder}`,
          resource_type: "raw",
          public_id: publicId,
          use_filename: true,
          unique_filename: false,
          format: 'pdf',
          overwrite: true,
          invalidate: true,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      streamifier.createReadStream(buffer).pipe(uploadStream);
    });

    // Update version in the database
    await Version.findOneAndUpdate(
      { template_folder: userFolder },
      { $set: { [key]: version } },
      { upsert: true, new: true }
    );

    return {
      success: true,
      message: "PDF Updated Successfully.",
    };
  } catch (err) {
    console.error("Upload and version tracking failed:", err);
    return {
      success: false,
      error: err.message
    };
  }
}

module.exports = {
  copyLatexTemplates,
  updateLatexFile,
  uploadPDF
};