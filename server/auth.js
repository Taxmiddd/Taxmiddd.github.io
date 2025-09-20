import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import db from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const SALT_ROUNDS = 10;

// Role hierarchy for access control
const ROLES = {
  viewer: 1,
  editor: 2,
  admin: 3,
  owner: 4
};

// Generate JWT token
export function generateToken(user) {
  return jwt.sign(
    { 
      id: user.id,
      email: user.email,
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Verify JWT token
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Hash password
export async function hashPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

// Compare password
export async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

// Authentication middleware
export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }

  req.user = decoded;
  next();
}

// Authorization middleware - check if user has required role level
export function authorize(requiredRole) {
  return async (req, res, next) => {
    try {
      const userRole = req.user.role;
      const userLevel = ROLES[userRole] || 0;
      const requiredLevel = ROLES[requiredRole] || 0;

      if (userLevel < requiredLevel) {
        return res.status(403).json({ 
          error: 'Insufficient permissions',
          required: requiredRole,
          current: userRole 
        });
      }

      next();
    } catch (error) {
      res.status(500).json({ error: 'Authorization error' });
    }
  };
}

// Login user (simplified for demo)
export async function loginUser(email, password = '') {
  try {
    // For demo purposes, accept any email but give special treatment to owner
    let user = await db.getUser(email);
    
    if (!user) {
      // Auto-create user
      const role = email === 'ashfaquet874@gmail.com' ? 'owner' : 'viewer';
      user = await db.createUser({
        email,
        role
      });
      console.log(`Created new user: ${email} with role: ${role}`);
    }

    // Update last login
    await db.updateUser(email, { lastLogin: new Date().toISOString() });
    
    // Fetch updated user
    user = await db.getUser(email);
    
    const token = generateToken(user);
    console.log(`User logged in: ${email}, role: ${user.role}`);
    
    return { user, token };
  } catch (error) {
    console.error('Login error:', error);
    throw new Error('Login failed: ' + error.message);
  }
}

// Get user role level
export function getRoleLevel(role) {
  return ROLES[role] || 0;
}

// Check if user can perform action on resource
export function canAccess(userRole, requiredRole) {
  const userLevel = ROLES[userRole] || 0;
  const requiredLevel = ROLES[requiredRole] || 0;
  return userLevel >= requiredLevel;
}