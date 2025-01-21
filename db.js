const mongoose = require('mongoose');

const db_URL = process.env.DB_URL;

mongoose.connect(db_URL)

const db = mongoose.connection;

db.on('connected', () => console.log('Connected to database'));
db.on('disconnected', () => console.log('Disconnected from database'));
db.on('error', (error) => console.error(error));

module.exports = db;