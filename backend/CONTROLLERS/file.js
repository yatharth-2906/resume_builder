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

module.exports = {
    handleGetFile
};