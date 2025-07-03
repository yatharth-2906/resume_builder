require('dotenv').config();
const User = require('../MODELS/user');
const { copyLatexTemplates } = require('../SERVICES/cloud');
const { generateToken, verifyToken } = require('../SERVICES/auth');
const { hashPassword, verifyPassword } = require('../SERVICES/encryption');

async function verifyUserLogin(req, res) {
    try {
        const token = req.headers['token']?.split(' ')[1];

        // Check if token is provided
        if (!token) {
            return res.status(400).json({ "status": "error", "message": 'Missing Token.' });
        }

        // Verify the token
        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({ "status": "error", "message": 'Invalid Token.' });
        }

        // If everything is fine, return success response
        return res.status(200).json({ "status": "success", "message": 'User login verified successfully.', "user": decoded });
    } catch (error) {
        console.error('Error during user login verification:', error);
        return res.status(500).json({ "status": "error", "message": 'Internal Server Error.' });
    }
}

async function handleUserLogin(req, res) {
    try {
        const { email, password } = req.body;

        // Check if all required fields are provided
        if (!email || !password) {
            return res.status(400).json({ "status": "error", "message": 'Missing Details.' });
        }

        // Check if user exists
        const user = await User.findOne({ user_email: email });
        if (!user) {
            return res.status(404).json({ "status": "error", "message": `User with ${email} does not exist.` });
        }

        // Verify password
        const isValid = verifyPassword(password, user.salt, user.password_hash);
        if (!isValid) {
            return res.status(401).json({ "status": "error", "message": 'Invalid Password.' });
        }

        // Generate JWT token
        const userPayload = { user_id: user._id, user_name:user.user_name, user_email: user.user_email, template_folder: user.template_folder };
        const token = generateToken(userPayload);

        // If everything is fine, return success response
        return res.status(200).json({ "status": "success", "message": 'User logged in successfully.', "token": token, "user": userPayload });
    } catch (error) {
        console.error('Error during user login:', error);
        return res.status(500).json({ "status": "error", "message": 'Internal Server Error.' });
    }
}

async function handleUserSignup(req, res) {
    try {
        const { name, email, password } = req.body;

        // Check if all required fields are provided
        if (!name || !email || !password) {
            return res.status(400).json({ "status": "error", "message": 'Missing Details.' });
        }

        // Check if user already exists
        const existing_user = await User.findOne({ user_email: email });
        if (existing_user) {
            return res.status(401).json({ "status": "error", "message": `User with ${email} already exists.` });
        }

        // Copy LaTeX templates to cloud storage
        const copyResult = await copyLatexTemplates();
        if (!copyResult.success) {
            return res.status(500).json({ error: copyResult.error });
        }

        // Hash and create a new user 
        const { salt, hash } = hashPassword(password);
        await User.create({
            user_name: name,
            user_email: email,
            salt: salt,
            password_hash: hash,
            template_folder: copyResult.folderName,
        });

        // Create a new entry in the Version collection 
        await Version.create({template_folder: copyResult.folderName});

        // If everything is fine, return success response
        return res.status(200).json({"status": "success", "message": 'User created successfully.'});

    } catch (error) {
        console.error('Error during user signup:', error);
        return res.status(500).json({ "status": "error", "message": 'Internal Server Error.' });
    }
}

module.exports = {
    verifyUserLogin,
    handleUserLogin,
    handleUserSignup
};