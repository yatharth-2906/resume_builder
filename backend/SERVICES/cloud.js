const crypto = require("crypto");
const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

async function copyLatexTemplates(req, res) {
    const uniqueFolderName = crypto.randomBytes(12).toString("hex");

    const tempSourceRepoPath = path.join(__dirname, "temp-resume-templates");
    const tempTargetRepoPath = path.join(__dirname, "temp-latex-storage");

    const sourceRepoUrl = "https://github.com/yatharthprivate/resume-templates.git";
    const targetRepoUrl = `https://${process.env.GITHUB_TOKEN}@github.com/yatharthprivate/latex-storage.git`;

    const targetFolderInsideRepo = path.join(tempTargetRepoPath, uniqueFolderName);

    try {
        // Cleanup if folders already exist
        [tempSourceRepoPath, tempTargetRepoPath].forEach(dir => {
            if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
        });

        // Clone source and target repos
        execSync(`git clone --depth=1 ${sourceRepoUrl} ${tempSourceRepoPath}`);
        execSync(`git clone ${targetRepoUrl} ${tempTargetRepoPath}`);

        // Create unique folder inside target repo
        fs.mkdirSync(targetFolderInsideRepo, { recursive: true });

        // Copy root-level files from source repo to target folder
        const filesToCopy = fs.readdirSync(tempSourceRepoPath).filter(file => {
            const fullPath = path.join(tempSourceRepoPath, file);
            return fs.statSync(fullPath).isFile() && !file.startsWith('.');
        });

        filesToCopy.forEach(file => {
            fs.copyFileSync(
                path.join(tempSourceRepoPath, file),
                path.join(targetFolderInsideRepo, file)
            );
        });

        // Git operations: add, commit, push
        execSync(`git -C ${tempTargetRepoPath} pull`);
        execSync(`git -C ${tempTargetRepoPath} add .`);
        execSync(`git -C ${tempTargetRepoPath} commit -m "Add resume template in ${uniqueFolderName}"`);
        execSync(`git -C ${tempTargetRepoPath} push ${targetRepoUrl} main`);

        // Cleanup temporary folders
        fs.rmSync(tempSourceRepoPath, { recursive: true, force: true });
        fs.rmSync(tempTargetRepoPath, { recursive: true, force: true });

        return {
            success: true,
            folderName: uniqueFolderName,
            repoUrl: `https://github.com/yatharthprivate/latex-storage/tree/main/${uniqueFolderName}`
        };
    } catch (err) {
        console.error("Error:", err.message);
        // Cleanup if error occurred
        [tempSourceRepoPath, tempTargetRepoPath].forEach(dir => {
            if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
        });
        return {
            success: false,
            error: err.message
        };
    }
}

module.exports = {
    copyLatexTemplates
};