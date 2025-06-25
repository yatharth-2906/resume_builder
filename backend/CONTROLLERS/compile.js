require('dotenv').config();
const { verifyToken } = require('../SERVICES/auth');
const { updateLatexFile } = require('../SERVICES/cloud');


async function handleCompilation(req, res) {
    try {
        const latexCode = req.body;
        const token = req.headers["token"]?.split(' ')[1];
        const templateFileName = req.headers['templatefilename'];

        if (!token) {
            return res.status(401).json({ error: 'Missing Token' });
        }

        if (!templateFileName) {
            return res.status(400).json({ error: 'Missing File Name' });
        }

        if (!latexCode) {
            return res.status(400).json({ "status": "error", "error": 'Missing Latex Code' });
        }

        // Verify the token
        const userPayload = verifyToken(token);
        if (!userPayload) {
            return res.status(401).json({ "status": "error", "error": 'Invalid token.' });
        }

        // Update the template file in Cloudinary
        const cloudinaryUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/raw/upload/resume-templates/${userPayload.template_folder}/${templateFileName}`;
        const updateStatus = await updateLatexFile(cloudinaryUrl, latexCode);

        if (!updateStatus.success) {
            return res.status(500).json({ "status": "error", "message": "File Update Failed" });
        }

        // Make API call for LaTeX compilation
        await new Promise(resolve => setTimeout(resolve, 500)); // Delay to ensure the file is updated before compilation
        const compileUrl = `https://latexonline.cc/compile?url=${encodeURIComponent(cloudinaryUrl)}`;
        const response = await fetch(compileUrl);

        if (!response.ok) {
            return res.status(500).json({ "error": "LaTeX compilation failed", "message": "We are processing too many requests right now. Please try again in 2-3 minutes." });
        }

        res.setHeader("Content-Type", "application/pdf");

        // Sending PDF in chunks(streams) as direct response
        const reader = response.body.getReader();
        const stream = new ReadableStream({
            async start(controller) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    controller.enqueue(value);
                }
                controller.close();
            }
        });

        const compiledPdf = new Response(stream);
        const buffer = await compiledPdf.arrayBuffer();
        res.end(Buffer.from(buffer));
    } catch (error) {
        console.error('Error during compilation:', error);
        res.status(500).json({ "status": "error", "error": 'Internal Server Error' });
    }
}

module.exports = {
    handleCompilation
};