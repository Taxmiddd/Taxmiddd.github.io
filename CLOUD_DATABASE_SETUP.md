# 🌐 Cloud Database Setup Guide

This guide shows you how to set up a secure cloud database for your portfolio with password protection.

## 🚀 Quick Setup Options

### Option 1: MongoDB Atlas (Recommended - Free Tier Available)

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/atlas
   - Sign up for free account
   - Create a new cluster (M0 Sandbox - FREE)

2. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://username:password@cluster.mongodb.net/portfolio`

3. **Set Environment Variable**
   ```bash
   # Create .env file in your project root
   echo "MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio" > .env
   ```

4. **Start Your App**
   ```bash
   npm install
   npm run dev
   ```

### Option 2: Railway (Easy Deploy + Database)

1. **Sign up at Railway.app**
2. **Deploy from GitHub**
3. **Add MongoDB Plugin**
4. **Railway automatically sets MONGODB_URI**

### Option 3: Vercel + PlanetScale

1. **Deploy to Vercel**
2. **Add PlanetScale database**
3. **Set DATABASE_URL in Vercel environment**

## 🔐 Password Security Features

### Automatic Security Setup
- ✅ **Password Hashing**: Uses bcrypt with salt rounds
- ✅ **Secure Storage**: Passwords stored as hashes, never plain text
- ✅ **JWT Tokens**: Secure authentication tokens
- ✅ **Cloud Sync**: All data synced to cloud database
- ✅ **Role-based Access**: Owner/Admin/Editor/Viewer permissions

### First-Time Setup Flow
1. **Visit Admin Panel**: http://localhost:3000/admin
2. **Enter Owner Email**: `ashfaquet874@gmail.com`
3. **Set Your Password**: You'll be prompted to create a secure password
4. **Login Securely**: Use your email and password from now on

## 🛠️ Environment Variables

Create a `.env` file in your project root:

```bash
# Database (choose one)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio
# OR
DATABASE_URL=mysql://username:password@host:port/database

# Security (required)
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
HMAC_SECRET=your-super-secret-hmac-key-for-file-downloads

# Optional
NODE_ENV=production
PORT=5000
```

## 📊 Database Schema

### Users Collection
```javascript
{
  email: "ashfaquet874@gmail.com",
  password: "$2b$10$hashedPasswordHere", // Bcrypt hash
  role: "owner", // owner|admin|editor|viewer
  passwordSet: true,
  requirePasswordChange: false,
  createdAt: "2024-01-01T00:00:00Z",
  lastLogin: "2024-01-01T12:00:00Z"
}
```

### Projects Collection
```javascript
{
  title: "My Project",
  description: "Project description",
  category: "Web Design",
  tags: ["design", "web"],
  featured: true,
  media: [/* media files */],
  createdAt: "2024-01-01T00:00:00Z"
}
```

## 🔄 Migration from Local to Cloud

### Automatic Migration
When you add a cloud database, the app automatically:
1. **Creates owner account** with your email
2. **Migrates existing data** from JSON files
3. **Switches to cloud storage** for new data
4. **Keeps local files as backup**

### Manual Migration (if needed)
```bash
# Export local data
node -e "
const db = require('./server/db.js').default;
console.log('Projects:', JSON.stringify(await db.getProjects()));
console.log('Settings:', JSON.stringify(await db.getSettings()));
"

# Then import to your cloud database
```

## 🌐 Cloud Deployment with Database

### Deploy to Railway
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login and deploy
railway login
railway init
railway add mongodb
railway deploy
```

### Deploy to Render
```bash
# 1. Connect GitHub repo to Render
# 2. Add MongoDB addon
# 3. Set environment variables
# 4. Deploy
```

### Deploy to Heroku
```bash
# 1. Install Heroku CLI
# 2. Create app
heroku create your-portfolio-app

# 3. Add MongoDB addon
heroku addons:create mongolab:sandbox

# 4. Deploy
git push heroku main
```

## 🔒 Security Best Practices

### Password Requirements
- ✅ **Minimum 8 characters**
- ✅ **Uppercase and lowercase letters**
- ✅ **Numbers and special characters**
- ✅ **Strength indicator** in UI
- ✅ **Password confirmation** required

### Database Security
- ✅ **Connection encryption** (TLS/SSL)
- ✅ **Authentication required**
- ✅ **IP whitelisting** (if needed)
- ✅ **Regular backups**
- ✅ **Environment variables** for secrets

### Application Security
- ✅ **JWT tokens** with expiration
- ✅ **CORS protection**
- ✅ **Rate limiting**
- ✅ **Input validation**
- ✅ **XSS protection**

## 🧪 Testing Your Setup

### 1. Test Database Connection
```bash
# Start your app
npm run dev

# Check console for:
# ✅ Connected to cloud database (MongoDB)
# ✅ Created owner user in cloud database
```

### 2. Test Password Setup
1. Go to http://localhost:3000/admin
2. Enter: `ashfaquet874@gmail.com`
3. Should prompt for password setup
4. Create strong password
5. Should login automatically

### 3. Test Password Login
1. Logout from admin panel
2. Try to login with wrong password (should fail)
3. Login with correct password (should work)

### 4. Test Data Persistence
1. Create a test project
2. Restart your server
3. Data should still be there (stored in cloud)

## 🆘 Troubleshooting

### Database Connection Issues
```bash
# Check connection string format
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname

# Common issues:
# - Wrong username/password
# - Network access not configured
# - Database name missing
# - Special characters in password need encoding
```

### Password Issues
```bash
# Reset password (owner only)
# 1. Stop server
# 2. Connect to database
# 3. Update user record: { passwordSet: false, requirePasswordChange: true }
# 4. Restart server
# 5. Go through password setup again
```

### Environment Variables
```bash
# Check if variables are loaded
node -e "console.log('MONGODB_URI:', !!process.env.MONGODB_URI)"
node -e "console.log('JWT_SECRET:', !!process.env.JWT_SECRET)"

# Load from .env file
npm install dotenv
# Add to server.js: require('dotenv').config()
```

## 📱 Production Deployment Checklist

- [ ] **Cloud database** configured and accessible
- [ ] **Environment variables** set in production
- [ ] **Strong JWT/HMAC secrets** (not defaults)
- [ ] **Database backups** enabled
- [ ] **SSL/HTTPS** enabled
- [ ] **Domain configured** with CORS
- [ ] **Password set** for owner account
- [ ] **File uploads** working with cloud storage
- [ ] **Monitoring** setup (optional)

## 🎯 Quick Commands

```bash
# Install with cloud database support
npm install

# Start with cloud database
MONGODB_URI="your-connection-string" npm run dev

# Deploy to Railway with database
railway init && railway add mongodb && railway deploy

# Check database connection
curl http://localhost:5000/api/auth/me
```

---

## 🎉 Success!

Your portfolio now has:
- ✅ **Secure password authentication**
- ✅ **Cloud database storage**
- ✅ **Encrypted data transmission**
- ✅ **Professional security standards**
- ✅ **Automatic backups** (via cloud provider)

**Your admin panel is now enterprise-grade secure!** 🔐