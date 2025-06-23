const crypto = require("crypto");
const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function copyLatexTemplates(req, res) {
  const uniqueFolderName = crypto.randomBytes(12).toString("hex");
  const tempSourceRepoPath = path.join(__dirname, "temp-resume-templates");
  const sourceRepoUrl = "https://github.com/yatharthprivate/resume-templates.git";

  try {
    // Cleanup if folder exists
    if (fs.existsSync(tempSourceRepoPath)) {
      fs.rmSync(tempSourceRepoPath, { recursive: true, force: true });
    }

    // Clone the source repo
    execSync(`git clone --depth=1 ${sourceRepoUrl} ${tempSourceRepoPath}`);

    // Get files to upload (only root-level non-hidden files)
    const filesToUpload = fs.readdirSync(tempSourceRepoPath).filter(file => {
      const fullPath = path.join(tempSourceRepoPath, file);
      return fs.statSync(fullPath).isFile() && !file.startsWith('.');
    });

    // Upload each file to Cloudinary
    const uploadResults = [];
    for (const file of filesToUpload) {
      const filePath = path.join(tempSourceRepoPath, file);
      const result = await cloudinary.uploader.upload(filePath, {
        folder: `resume-templates/${uniqueFolderName}`,
        resource_type: "raw", // For .tex files
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      });
      uploadResults.push(result.secure_url);
    }

    // Cleanup temp folder
    fs.rmSync(tempSourceRepoPath, { recursive: true, force: true });

    return {
      success: true,
      folderName: uniqueFolderName,
      files: uploadResults,
      repoUrl: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/raw/upload/resume-templates/${uniqueFolderName}/`
    };
  } catch (err) {
    console.error("Error:", err.message);
    if (fs.existsSync(tempSourceRepoPath)) {
      fs.rmSync(tempSourceRepoPath, { recursive: true, force: true });
    }
    return {
      success: false,
      error: err.message,
    };
  }
}

module.exports = {
  copyLatexTemplates,
};
