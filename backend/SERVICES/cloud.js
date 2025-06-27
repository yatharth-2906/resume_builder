require("dotenv").config();

const os = require("os");
const fs = require("fs").promises;
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
  const fileName = path.basename(publicId) + ".tex";
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

// async function savePDF(arrayBuffer, publicId) {
//   const fileName = path.basename(publicId);
//   const tmpFilePath = path.join(os.tmpdir(), fileName);

//   try {
//     const buffer = Buffer.from(arrayBuffer); // ✅ Fix here
//     await fs.writeFile(tmpFilePath, buffer);

//     const result = await cloudinary.uploader.upload(tmpFilePath, {
//       public_id: publicId,
//       resource_type: "raw",
//       use_filename: true,
//       unique_filename: false,
//       overwrite: true,
//       invalidate: true,
//       type: "upload", 
//       access_mode: "public"
//     });

//     return {
//       success: true,
//       url: result.secure_url,
//       message: "PDF uploaded successfully",
//     };
//   } catch (err) {
//     console.error("PDF upload failed:", err);
//     return {
//       success: false,
//       message: err.message,
//     };
//   } finally {
//     try {
//       await fs.access(tmpFilePath); // Check if file exists
//       await fs.unlink(tmpFilePath); // Delete file
//     } catch (cleanupErr) {
//       console.warn("Temporary PDF cleanup failed:", cleanupErr.message);
//     }
//   }
// }


module.exports = {
  copyLatexTemplates,
  updateLatexFile,
};