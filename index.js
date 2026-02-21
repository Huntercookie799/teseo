const express = require('express');
const app = express();

const sessionMiddleware = require('./config/session');

// Rutas
const statusRoutes = require('./routes/status');
const driveRoutes = require('./routes/drive');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');

// Middleware sesión
app.use(sessionMiddleware);

// Rutas
app.use('/', statusRoutes);
app.use('/drive', driveRoutes);
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);

// Servidor
app.listen(3000, () => console.log('🚀 Servidor en http://localhost:3000'));