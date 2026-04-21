const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const authRoutes = require('./routes/authRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const aiRoutes = require('./routes/aiRoutes');
const objectDetectionRoutes = require('./routes/objectDetectionRoutes');
const featureRoutes = require('./routes/featureRoutes');

app.use('/api/auth', authRoutes);
app.use('/api', registrationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/object-detection', objectDetectionRoutes);
app.use('/api/features', featureRoutes);

module.exports = app;