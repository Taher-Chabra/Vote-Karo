const express = require('express');
const app = express();
app.use(express.json());
require('dotenv').config();
const db = require('./db');
const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');

const PORT = process.env.PORT || 3000;

function loggingMiddleware(req, res, next) {
   console.log(`[${new Date().toLocaleString()}] - Request made to:  ${req.originalUrl}`);
   next();
}

app.use(loggingMiddleware);
app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));