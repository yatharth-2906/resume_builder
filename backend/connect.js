require('dotenv').config();
const mongoose = require('mongoose');

async function connectToDatabase() {
    try {
        const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/resume_builder';
        await mongoose.connect(dbUrl);
        console.log('Connected to the database successfully.');
    }

    catch (error) {
        console.error('Error connecting to the database.:', error);
    }
}

module.exports = connectToDatabase;