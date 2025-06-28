require('dotenv').config();

async function handleHomeGet(req, res) {
    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    return res.status(200).json({ "message": `Hello from ${fullUrl}` });
}

async function handleHealth(req, res) {
    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    return res.status(200).json(({ "status":"success", "message": `✅ Backend is up and running at ${fullUrl}` }));
}

module.exports = {
    handleHomeGet,
    handleHealth
};