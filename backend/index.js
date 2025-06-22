// Packages Imports
require('dotenv').config();
const express = require('express');

// Routers Import and DB Connection
const connectToDatabase = require('./connect');
const homeRouter = require('./ROUTES/home');
const authRouter = require('./ROUTES/auth');

const app = express();
const port = Number(process.env.PORT) || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routers
app.use('/', homeRouter);
app.use('/auth', authRouter);

// Starting the server and DB Connection 
connectToDatabase();
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});