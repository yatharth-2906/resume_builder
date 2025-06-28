// Packages Imports
require('dotenv').config();
const cors = require('cors');
const express = require('express');

// Routers Import and DB Connection
const connectToDatabase = require('./connect');
const homeRouter = require('./ROUTES/home');
const authRouter = require('./ROUTES/auth');
const compileRouter = require('./ROUTES/compile');
const fileRouter = require('./ROUTES/file');

const app = express();
const port = Number(process.env.PORT) || 3000;

// CORS options
const corsOptions = {
  origin: (origin, callback) => {
    callback(null, true); // allow all origins
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
};

// Middlewares
app.use(express.json());
app.use(express.text());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));

// Routers
app.use('/', homeRouter);
app.use('/auth', authRouter);
app.use('/compile', compileRouter);
app.use('/file', fileRouter);

// Starting the server and DB Connection 
connectToDatabase();
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});