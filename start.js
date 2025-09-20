#!/usr/bin/env node

console.log('🚀 Starting Graphics Designer Portfolio...\n');

// Check if running in development
const isDev = process.env.NODE_ENV !== 'production';

if (isDev) {
  console.log('📋 Quick Setup Checklist:');
  console.log('✅ Dependencies installed (you ran npm install)');
  console.log('✅ Database auto-created (JSON files in /data folder)');
  console.log('✅ Default admin account ready\n');
  
  console.log('🔑 Admin Login Info:');
  console.log('   Email: ashfaquet874@gmail.com');
  console.log('   Password: (leave blank - not required for demo)\n');
  
  console.log('🌐 Access URLs:');
  console.log('   Portfolio: http://localhost:3000');
  console.log('   Admin Panel: http://localhost:3000/admin\n');
  
  console.log('🎨 Features:');
  console.log('   • Lush Midnight Theme (dark with emerald/purple accents)');
  console.log('   • Responsive design for all devices');
  console.log('   • File-based database (no external DB needed)');
  console.log('   • Secure media uploads with watermarking');
  console.log('   • Role-based admin access\n');
  
  console.log('📚 Documentation:');
  console.log('   • README.md - Main documentation');
  console.log('   • DATABASE_SETUP.md - Database tutorial');
  console.log('   • README_DEPLOY.md - Deployment guide\n');
  
  console.log('🛠️ Troubleshooting:');
  console.log('   • If login fails: Check browser console for errors');
  console.log('   • If database issues: Delete /data folder and restart');
  console.log('   • If port conflicts: Kill process on port 5000/3000\n');
}

console.log('Starting servers...\n');

// Import the actual server start
import('./server/server.js').catch(err => {
  console.error('❌ Failed to start server:', err.message);
  process.exit(1);
});