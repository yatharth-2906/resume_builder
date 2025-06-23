require('dotenv').config();
const User = require('../MODELS/user');
const { verifyToken } = require('../SERVICES/auth');

async function handleCompilation(req, res) {
    try {
        const { token, templateFileName } = req.body;

        // Checking for missing fields
        if (!token || !templateFileName) {
            return res.status(400).json({ "status": "error", "error": 'Missing token or template name.' });
        }

        // Verifying the token
        const userPayload = verifyToken(token);
        if (!userPayload) {
            return res.status(401).json({ "status": "error", "error": 'Invalid token.' });
        }

        // Making API call for LaTeX compilation
        const cloudinaryUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/raw/upload/resume-templates/${userPayload.template_folder}/${templateFileName}`;
        const compileUrl = `https://latexonline.cc/compile?url=${encodeURIComponent(cloudinaryUrl)}`;
        const response = await fetch(compileUrl);

        if (!response.ok) {
            return res.status(500).json({ error: "LaTeX compilation failed" });
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