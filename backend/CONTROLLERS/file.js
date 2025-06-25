const { verifyToken } = require('../SERVICES/auth');

async function handleGetFile(req, res) {
    try {
        const { fileName } = req.body;
        const token = req.headers["token"]?.split(' ')[1];

        // Check for missing values 
        if (!token || !fileName) {
            return res.status(400).json({ "status": "error", "message": 'Missing token or fileName' });
        }

        // Extract user details from token
        const userDetails = verifyToken(token);
        if (!userDetails) {
            return res.status(401).json({ "status": "error", "message": 'Invalid token' });
        }

        // Fetch the file from Cloud Storage 
        const cloudinaryUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/raw/upload/resume-templates/${userDetails.template_folder}/${fileName}`;
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

module.exports = {
    handleGetFile
};