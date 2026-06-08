require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

// ─── CRIT-1: Enforce JWT_SECRET from environment ───────────────────────────
if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET environment variable is not set. Set it in your .env file.');
  process.exit(1);
}

const authRoutes = require('./routes/auth');
const propertiesRoutes = require('./routes/properties');
const unitsRoutes = require('./routes/units');
const tenantsRoutes = require('./routes/tenants');
const rentRoutes = require('./routes/rent');
const maintenanceRoutes = require('./routes/maintenance');
const notificationsRoutes = require('./routes/notifications');
const documentsRoutes = require('./routes/documents');
const communicationRoutes = require('./routes/communication');
const aiRoutes = require('./routes/ai');
const invitationsRoutes = require('./routes/invitations');
const subscriptionsRoutes = require('./routes/subscriptions');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── CRIT-2: Restrict CORS to known origin ──────────────────────────────────
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── CRIT-3: Rate Limiting on Auth Routes ───────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  message: { error: 'Too many login attempts, please try again in 1 minute.' },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertiesRoutes);
app.use('/api/units', unitsRoutes);
app.use('/api/tenants', tenantsRoutes);
app.use('/api/rent', rentRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/communication', communicationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/invitations', invitationsRoutes);
app.use('/api/subscriptions', subscriptionsRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'HantiOS Backend is running' });
});

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  const isDev = process.env.NODE_ENV !== 'production';
  res.status(err.status || 500).json({
    error: isDev ? err.message : 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} | ENV: ${process.env.NODE_ENV || 'development'}`);
});
