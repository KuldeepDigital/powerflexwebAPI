require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const publicRoutes = require('./routes/public');
const adminRoutes = require('./routes/admin');

const app = express();

// ── Middleware ────────────────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:5173' })); // Vite dev server
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files (product images, enquiry drawings, etc.)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Root Route ────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'Powerflex API is running', endpoints: ['/api', '/api/admin'] });
});

// ── Routes ────────────────────────────────────────────────────────
app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);

// ── Start ─────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Powerflex API running on http://localhost:${PORT}`));
