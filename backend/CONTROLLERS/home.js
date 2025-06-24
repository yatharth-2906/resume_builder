require('dotenv').config();

async function handleHomeGet(req, res) {
    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    return res.status(200).json({ "message": `Hello from ${fullUrl}` });
}

module.exports = {
    handleHomeGet
};