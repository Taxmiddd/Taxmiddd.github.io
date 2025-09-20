# 🚀 Quick Start Guide

## ⚡ Super Fast Setup (2 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Start everything
npm run dev
```

**That's it!** Your portfolio is now running with:
- **Portfolio**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin

## 🔑 Login to Admin Panel

1. Go to: http://localhost:3000/admin
2. **Email**: `ashfaquet874@gmail.com`
3. **Password**: Leave blank (or type anything)
4. Click "Sign In"

## ✅ What You Get

- ✅ **Lush Midnight Theme** - Dark theme with emerald/purple accents
- ✅ **Fully Responsive** - Works on mobile, tablet, desktop
- ✅ **No Database Setup** - Uses JSON files (auto-created)
- ✅ **Admin Panel** - Complete content management
- ✅ **Media Management** - Upload with watermarking
- ✅ **Theme Customizer** - Change colors/fonts live
- ✅ **Role System** - Owner/Admin/Editor/Viewer roles

## 🎯 First Steps After Login

1. **Add Your First Project**:
   - Go to Projects → Add Project
   - Upload images, add description
   - Mark as featured

2. **Customize Your Content**:
   - Go to Content → Edit hero section
   - Update About Me section
   - Add your services/pricing

3. **Upload Your CV**:
   - Go to Content → CV Management
   - Upload PDF file

4. **Customize Theme**:
   - Go to Theme → Try different color palettes
   - Change fonts and colors

## 🛠️ Common Issues & Fixes

### Login Not Working?
```bash
# Check if server is running
curl http://localhost:5000/api/auth/me
# Should return 401 (that's normal without token)

# If server not running:
npm run server
```

### Database Issues?
```bash
# Reset database (deletes all data)
rm -rf data/
npm run dev
# Database will be recreated automatically
```

### Port Already in Use?
```bash
# Kill processes on ports
lsof -ti:3000 | xargs kill -9
lsof -ti:5000 | xargs kill -9

# Then restart
npm run dev
```

### Responsive Issues?
- **Clear browser cache**: Ctrl+F5 (Windows) / Cmd+Shift+R (Mac)
- **Try different browser**: Chrome, Firefox, Safari
- **Check mobile view**: Browser dev tools → Toggle device toolbar

### Theme Not Loading?
- **Hard refresh**: Ctrl+Shift+R
- **Check console**: F12 → Console tab for errors
- **Reset theme**: Admin Panel → Theme → Reset button

## 📱 Mobile Testing

Test on mobile by:
1. **Same Network**: Use your local IP
   ```bash
   # Find your IP
   ipconfig getifaddr en0  # Mac
   ip route get 1 | awk '{print $7}'  # Linux
   ipconfig | findstr IPv4  # Windows
   
   # Then visit: http://YOUR-IP:3000
   ```

2. **Browser Dev Tools**: F12 → Toggle device toolbar

## 🎨 Customization Tips

### Change Theme Colors
1. Admin Panel → Theme
2. Try "Lush Midnight" palette (default)
3. Or create custom colors with color picker
4. Save Changes → Preview

### Add Content
- **Hero**: Main headline and description  
- **About**: Your story and skills
- **Services**: What you offer and pricing
- **Projects**: Your portfolio work

### Upload Media
- **Drag & Drop**: Works in project form and media section
- **Formats**: JPG, PNG, GIF, WebP, MP4, WebM
- **Auto-Processing**: Thumbnails generated automatically
- **Security**: High-res files protected with signed URLs

## 📊 File Structure

```
portfolio/
├── data/               # Database (auto-created)
│   ├── projects.json   # Your projects
│   ├── users.json      # User accounts  
│   ├── settings.json   # Theme settings
│   └── content.json    # Page content
├── server/storage/secure/  # Uploaded files
├── public/thumbnails/      # Generated thumbnails
└── src/                    # React frontend
```

## 🆘 Still Having Issues?

### Check Logs
```bash
# Server logs
npm run server
# Look for error messages

# Browser logs  
# F12 → Console tab → Look for red errors
```

### Reset Everything
```bash
# Nuclear option - starts fresh
rm -rf data/
rm -rf node_modules/
npm install
npm run dev
```

### Get Help
1. **Check Documentation**: README.md, DATABASE_SETUP.md
2. **Browser Console**: F12 → Console (look for errors)
3. **Server Logs**: Terminal running `npm run server`

---

## 🎉 You're Ready!

Your portfolio is now running with a beautiful lush midnight theme. Start adding your projects and customizing the content through the admin panel!

**Key URLs to Bookmark**:
- Portfolio: http://localhost:3000
- Admin: http://localhost:3000/admin
- Owner Email: `ashfaquet874@gmail.com`