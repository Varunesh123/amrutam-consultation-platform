// server.js - Main server entry point
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
require('dotenv').config();

const { connectDB } = require('./src/utils/database');
const errorHandler = require('./src/middleware/errorHandler');
const authMiddleware = require('./src/middleware/auth');

// Route imports
const authRoutes = require('./src/routes/auth');
const doctorRoutes = require('./src/routes/doctors');
const appointmentRoutes = require('./src/routes/appointments');
const userRoutes = require('./src/routes/users');
const adminRoutes = require('./src/routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
connectDB();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});
app.use(limiter);

// Body parsing middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(morgan('combined'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', authMiddleware, appointmentRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/admin', authMiddleware, adminRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

// src/utils/database.js - Database connection and utilities
const { Pool } = require('pg');
const Redis = require('redis');

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Redis connection for caching and slot locking
const redisClient = Redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

const connectDB = async () => {
  try {
    // Test PostgreSQL connection
    await pool.query('SELECT NOW()');
    console.log('PostgreSQL connected successfully');

    // Connect to Redis
    await redisClient.connect();
    console.log('Redis connected successfully');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Database query helper
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', { text, error: error.message });
    throw error;
  }
};

// Transaction helper
const withTransaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  pool,
  redisClient,
  connectDB,
  query,
  withTransaction
};

// src/models/User.js - User model
const { query } = require('../utils/database');
const bcrypt = require('bcrypt');

class User {
  static async create(userData) {
    const { name, email, phone, password, role = 'patient' } = userData;
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const result = await query(`
      INSERT INTO users (name, email, phone, password, role, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING id, name, email, phone, role, created_at
    `, [name, email, phone, hashedPassword, role]);
    
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await query(
      'SELECT id, name, email, phone, role, avatar, created_at, updated_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async updateProfile(id, profileData) {
    const { name, phone, avatar } = profileData;
    const result = await query(`
      UPDATE users 
      SET name = COALESCE($1, name), 
          phone = COALESCE($2, phone), 
          avatar = COALESCE($3, avatar),
          updated_at = NOW()
      WHERE id = $4
      RETURNING id, name, email, phone, role, avatar, updated_at
    `, [name, phone, avatar, id]);
    
    return result.rows[0];
  }

  static async changePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await query(
      'UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2',
      [hashedPassword, id]
    );
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;

// src/models/Doctor.js - Doctor model
const { query } = require('../utils/database');

class Doctor {
  static async getAll(filters = {}) {
    let queryText = `
      SELECT 
        d.*,
        ARRAY_AGG(DISTINCT s.name) as specializations,
        ARRAY_AGG(DISTINCT l.language) as languages,
        COALESCE(AVG(r.rating), 0) as rating,
        COUNT(DISTINCT r.id) as review_count,
        (
          SELECT MIN(ts.start_time)
          FROM time_slots ts 
          WHERE ts.doctor_id = d.id 
            AND ts.date >= CURRENT_DATE 
            AND ts.status = 'available'
        ) as next_available_slot
      FROM doctors d
      LEFT JOIN doctor_specializations ds ON d.id = ds.doctor_id
      LEFT JOIN specializations s ON ds.specialization_id = s.id
      LEFT JOIN doctor_languages dl ON d.id = dl.doctor_id
      LEFT JOIN languages l ON dl.language_id = l.id
      LEFT JOIN reviews r ON d.id = r.doctor_id
      WHERE d.is_active = true
    `;

    const queryParams = [];
    let paramCount = 0;

    // Apply filters
    if (filters.specialization) {
      paramCount++;
      queryText += ` AND s.name ILIKE $${paramCount}`;
      queryParams.push(`%${filters.specialization}%`);
    }

    if (filters.location) {
      paramCount++;
      queryText += ` AND d.location ILIKE $${paramCount}`;
      queryParams.push(`%${filters.location}%`);
    }

    if (filters.mode) {
      paramCount++;
      queryText += ` AND $${paramCount} = ANY(d.available_modes)`;
      queryParams.push(filters.mode);
    }

    if (filters.rating) {
      paramCount++;
      queryText += ` AND COALESCE(AVG(r.rating), 0) >= $${paramCount}`;
      queryParams.push(parseFloat(filters.rating));
    }

    queryText += `
      GROUP BY d.id
      ORDER BY 
        CASE 
          WHEN $${paramCount + 1} = 'availability' THEN next_available_slot
          WHEN $${paramCount + 1} = 'rating' THEN -COALESCE(AVG(r.rating), 0)
          WHEN $${paramCount + 1} = 'experience' THEN -d.experience
          WHEN $${paramCount + 1} = 'price_low' THEN d.consultation_fee
          WHEN $${paramCount + 1} = 'price_high' THEN -d.consultation_fee
          ELSE d.created_at
        END
      LIMIT $${paramCount + 2} OFFSET $${paramCount + 3}
    `;

    queryParams.push(
      filters.sortBy || 'availability',
      parseInt(filters.limit) || 12,
      (parseInt(filters.page) - 1) * (parseInt(filters.limit) || 12) || 0
    );

    const result = await query(queryText, queryParams);
    
    // Get total count
    const countResult = await query(`
      SELECT COUNT(DISTINCT d.id) as total
      FROM doctors d
      LEFT JOIN doctor_specializations ds ON d.id = ds.doctor_id
      LEFT JOIN specializations s ON ds.specialization_id = s.id
      WHERE d.is_active = true
      ${filters.specialization ? 'AND s.name ILIKE $1' : ''}
      ${filters.location ? `AND d.location ILIKE $${filters.specialization ? 2 : 1}` : ''}
    `, filters.specialization && filters.location ? 
       [`%${filters.specialization}%`, `%${filters.location}%`] :
       filters.specialization ? [`%${filters.specialization}%`] :
       filters.location ? [`%${filters.location}%`] : []
    );

    return {
      doctors: result.rows,
      totalCount: parseInt(countResult.rows[0].total)
    };
  }

  static async getById(id) {
    const result = await query(`
      SELECT 
        d.*,
        ARRAY_AGG(DISTINCT s.name) as specializations,
        ARRAY_AGG(DISTINCT l.language) as languages,
        COALESCE(AVG(r.rating), 0) as rating,
        COUNT(DISTINCT r.id) as review_count
      FROM doctors d
      LEFT JOIN doctor_specializations ds ON d.id = ds.doctor_id
      LEFT JOIN specializations s ON ds.specialization_id = s.id
      LEFT JOIN doctor_languages dl ON d.id = dl.doctor_id
      LEFT JOIN languages l ON dl.language_id = l.id
      LEFT JOIN reviews r ON d.id = r.doctor_id
      WHERE d.id = $1 AND d.is_active = true
      GROUP BY d.id
    `, [id]);

    return result.rows[0];
  }

  static async getSlots(doctorId, date) {
    const result = await query(`
      SELECT 
        ts.*,
        CASE 
          WHEN a.id IS NOT NULL THEN 'booked'
          ELSE ts.status
        END as actual_status
      FROM time_slots ts
      LEFT JOIN appointments a ON ts.id = a.time_slot_id AND a.status != 'cancelled'
      WHERE ts.doctor_id = $1 AND ts.date = $2
      ORDER BY ts.start_time
    `, [doctorId, date]);

    return result.rows;
  }

  static async search(searchQuery, filters = {}) {
    const queryText = `
      SELECT 
        d.*,
        ARRAY_AGG(DISTINCT s.name) as specializations,
        ARRAY_AGG(DISTINCT l.language) as languages,
        COALESCE(AVG(r.rating), 0) as rating,
        COUNT(DISTINCT r.id) as review_count
      FROM doctors d
      LEFT JOIN doctor_specializations ds ON d.id = ds.doctor_id
      LEFT JOIN specializations s ON ds.specialization_id = s.id
      LEFT JOIN doctor_languages dl ON d.id = dl.doctor_id
      LEFT JOIN languages l ON dl.language_id = l.id
      LEFT JOIN reviews r ON d.id = r.doctor_id
      WHERE d.is_active = true
        AND (
          d.name ILIKE $1 OR 
          d.bio ILIKE $1 OR 
          s.name ILIKE $1 OR
          d.location ILIKE $1
        )
      GROUP BY d.id
      ORDER BY d.name
      LIMIT 20
    `;

    const result = await query(queryText, [`%${searchQuery}%`]);
    return result.rows;
  }
}

module.exports = Doctor;