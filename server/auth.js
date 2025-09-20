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

// Login user with password authentication
export async function loginUser(email, password = '') {
  try {
    // Get user with password
    let user = await db.getUserWithPassword(email);
    
    if (!user) {
      // Auto-create user only for owner email
      if (email === 'ashfaquet874@gmail.com') {
        user = await db.createUser({
          email,
          role: 'owner'
        });
        console.log(`Created owner user: ${email}`);
      } else {
        throw new Error('User not found. Please contact the administrator.');
      }
    }

    // Check password if user has one set
    if (user.passwordSet && user.password) {
      if (!password) {
        throw new Error('Password is required');
      }
      
      const isValidPassword = await comparePassword(password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid password');
      }
    } else if (user.role === 'owner' && !user.passwordSet) {
      // Owner needs to set password on first login
      return {
        user: { ...user, password: undefined },
        token: null,
        requirePasswordSetup: true
      };
    } else if (password && !user.passwordSet) {
      // User provided password but doesn't have one set - this is suspicious
      throw new Error('Invalid credentials');
    }

    // Update last login
    await db.updateUser(email, { lastLogin: new Date().toISOString() });
    
    // Generate token
    const token = generateToken(user);
    console.log(`User logged in: ${email}, role: ${user.role}`);
    
    return { 
      user: { ...user, password: undefined }, // Never send password to client
      token,
      requirePasswordChange: user.requirePasswordChange
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

// Set user password (for first-time setup or password change)
export async function setUserPassword(email, newPassword, currentPassword = null) {
  try {
    const user = await db.getUserWithPassword(email);
    if (!user) {
      throw new Error('User not found');
    }

    // If user has existing password, verify current password
    if (user.passwordSet && user.password && currentPassword) {
      const isValidCurrentPassword = await comparePassword(currentPassword, user.password);
      if (!isValidCurrentPassword) {
        throw new Error('Current password is incorrect');
      }
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);
    
    // Update user password
    const updatedUser = await db.setUserPassword(email, hashedPassword);
    
    return { success: true, user: { ...updatedUser, password: undefined } };
  } catch (error) {
    console.error('Set password error:', error);
    throw error;
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