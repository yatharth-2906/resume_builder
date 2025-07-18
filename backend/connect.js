require('dotenv').config();
const mongoose = require('mongoose');

async function connectToDatabase() {
    try {
        const dbUrl = process.env.DB_ONLINE_URL;
        await mongoose.connect(dbUrl);
        console.log('Connected to the database successfully.');
    }

    catch (error) {
        console.error('Error connecting to the database.:', error);
    }
}

module.exports = connectToDatabase;