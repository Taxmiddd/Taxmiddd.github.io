# Database Setup Tutorial

This portfolio uses a simple **file-based JSON database** that requires NO external database setup! Everything works out of the box.

## 🚀 Quick Start (No Setup Required!)

The database automatically initializes when you start the server. Just run:

```bash
npm install
npm run dev
```

That's it! The database is ready to use.

## 📁 How It Works

### Automatic Database Creation
When you start the server, it automatically creates these files in the `/data` folder:

- `projects.json` - Stores all your projects
- `users.json` - Stores user accounts and roles  
- `settings.json` - Stores theme and site settings
- `content.json` - Stores page content (hero, about, services)

### Default Data Structure

**users.json** (Created automatically):
```json
[
  {
    "id": "1",
    "email": "ashfaquet874@gmail.com",
    "role": "owner",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "lastLogin": null
  }
]
```

**settings.json** (Created automatically):
```json
{
  "theme": {
    "primaryColor": "#10b981",
    "secondaryColor": "#8b5cf6", 
    "backgroundPrimary": "#0f172a",
    "backgroundSecondary": "#1e293b",
    "fontPrimary": "Inter, sans-serif",
    "fontSecondary": "Inter, sans-serif"
  },
  "siteTitle": "Graphics Designer Portfolio",
  "siteDescription": "Professional graphics designer showcasing creative digital media work"
}
```

## 🔑 Admin Access

### Default Owner Account
- **Email**: `ashfaquet874@gmail.com`
- **Role**: `owner` (full access)
- **Password**: Not required (just enter the email)

### Login Steps
1. Go to http://localhost:3000/admin
2. Enter email: `ashfaquet874@gmail.com`
3. Leave password blank (or enter anything)
4. Click "Sign In"

## 🎯 Testing the Database

### 1. Check Database Files
After starting the server, check that these files exist:
```bash
ls -la data/
# Should show: projects.json, users.json, settings.json, content.json
```

### 2. Test Login
- Visit: http://localhost:3000/admin
- Login with: `ashfaquet874@gmail.com`
- You should see the admin dashboard

### 3. Test Project Creation
- Go to Projects section in admin panel
- Click "Add Project"
- Fill in details and save
- Check `data/projects.json` - your project should be there

### 4. Test Theme Changes
- Go to Theme section in admin panel
- Change colors
- Click "Save Changes"  
- Check `data/settings.json` - theme should be updated

## 🛠️ Database Operations

### Viewing Data
You can directly view/edit the JSON files:

```bash
# View all projects
cat data/projects.json

# View users
cat data/users.json

# View settings
cat data/settings.json
```

### Manual Data Entry
You can manually add data by editing the JSON files:

**Adding a project to projects.json**:
```json
[
  {
    "id": "1",
    "title": "My First Project",
    "description": "A beautiful design project",
    "category": "Web Design",
    "tags": ["design", "web", "ui"],
    "featured": true,
    "media": [],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Backup Your Data
Simply copy the entire `/data` folder:

```bash
# Create backup
cp -r data/ data-backup-$(date +%Y%m%d)/

# Restore backup
rm -rf data/
cp -r data-backup-20240101/ data/
```

## 🔧 Advanced Configuration

### Custom Database Location
You can change where data is stored by modifying `server/db.js`:

```javascript
// Change these paths
const DB_DIR = path.join(__dirname, '../your-custom-data-folder');
```

### Adding New Data Types
To add new data types, modify `server/db.js`:

```javascript
// Add new default data
const defaultNewData = { /* your data structure */ };

// Add new file path
const NEW_DATA_FILE = path.join(DB_DIR, 'newdata.json');

// Add new methods
async getNewData() {
  return await this.readFile(NEW_DATA_FILE) || defaultNewData;
}
```

## 🚨 Troubleshooting

### Database Not Creating
If files aren't created automatically:

1. **Check permissions**:
   ```bash
   chmod 755 data/
   ```

2. **Check server logs**:
   ```bash
   npm run server
   # Look for "Database initialization" messages
   ```

3. **Manually create data folder**:
   ```bash
   mkdir -p data
   ```

### Login Not Working
1. **Check server is running**: http://localhost:5000/api/auth/me
2. **Check user file exists**: `cat data/users.json`
3. **Check console logs** in browser developer tools

### Data Not Saving
1. **Check file permissions**:
   ```bash
   ls -la data/
   # All files should be writable
   ```

2. **Check disk space**:
   ```bash
   df -h
   ```

3. **Check server logs** for write errors

## 📊 Production Considerations

### For Production Deployment
The file-based database works great for small to medium portfolios, but consider:

1. **Regular Backups**: Set up automated backups
2. **File Permissions**: Ensure proper read/write permissions
3. **Concurrent Access**: File-based DB handles single-user scenarios well

### Upgrading to Real Database (Optional)
If you need more features later, you can upgrade to:

- **SQLite**: Local database file
- **MongoDB**: Document database
- **PostgreSQL**: Full-featured database

The current structure makes migration easy since it's already JSON-based.

## ✅ Success Checklist

- [ ] Server starts without errors
- [ ] `/data` folder exists with JSON files
- [ ] Can login with `ashfaquet874@gmail.com`
- [ ] Can access admin dashboard
- [ ] Can create/edit projects
- [ ] Can change theme settings
- [ ] Data persists after server restart

## 🆘 Still Having Issues?

1. **Delete data folder and restart**:
   ```bash
   rm -rf data/
   npm run dev
   ```

2. **Check Node.js version**:
   ```bash
   node --version
   # Should be 16+ 
   ```

3. **Check port availability**:
   ```bash
   lsof -i :5000
   # Port 5000 should be free or used by this app
   ```

---

**🎉 Your database is now ready! No complex setup required - just start coding!**