require('dotenv').config();
const { Readable } = require('stream');

const Version = require('../MODELS/version');

async function handleGetFile(req, res) {
    try {
        const { fileName, template_folder } = req.body;

        // Check for missing values 
        if (!template_folder || !fileName) {
            return res.status(400).json({ "status": "error", "message": 'Missing template_folder or fileName' });
        }

        // Fetch the file from Cloud Storage 
        const cloudinaryUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/raw/upload/resume-templates/${template_folder}/${fileName}`;
        const response = await fetch(cloudinaryUrl);

        if (!response.ok) {
            return res.status(404).send('File not found.');
        }

        const fileText = await response.text();
        res.setHeader('Content-Type', 'text/plain');
        res.send(fileText);

    } catch (error) {
        console.error('Error in handleGetFile:', error);
        res.status(500).json({ "status": "error", "message": 'Internal Server Error' });
    }
}

async function handleGetResumeFile(req, res) {
    try {
        const { fileName, template_folder } = req.body;

        // Check for missing values 
        if (!template_folder || !fileName) {
            return res.status(400).json({ "status": "error", "message": 'Missing template_folder or fileName' });
        }

        // Check for file existance 
        const resumeFile = await Version.findOne({ template_folder }) || null;
        console.log('Resume File:', resumeFile);
        if (!resumeFile || !resumeFile[fileName]) {
            return res.status(404).json({ "status": "error", "message": 'File not found in the database' });
        }

        // Fetch the file from Cloud Storage 
        const cloudinaryUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/raw/upload/resume-templates/${template_folder}/${fileName}-${resumeFile[fileName]}.pdf`;
        const response = await fetch(cloudinaryUrl);

        if (!response.ok) {
            return res.status(404).send('File not found.');
        }

        // Convert Web ReadableStream to Node Readable
        const nodeReadable = Readable.fromWeb(response.body);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `inline; filename="${fileName}.pdf"`);

        // Stream the response directly to the client
        nodeReadable.pipe(res);
    } catch (error) {
        console.error('Error in handleGetFile:', error);
        res.status(500).json({ "status": "error", "message": 'Internal Server Error' });
    }
}

module.exports = {
    handleGetFile,
    handleGetResumeFile,
};