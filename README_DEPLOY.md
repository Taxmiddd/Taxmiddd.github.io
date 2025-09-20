# Deployment Guide

This guide covers deploying the Graphics Designer Portfolio Website to various platforms, with special focus on Oracle Free Tier.

## 🌐 Oracle Free Tier Deployment

Oracle Cloud Infrastructure (OCI) provides a generous free tier perfect for hosting this portfolio website.

### Prerequisites
- Oracle Cloud account (free tier)
- Basic knowledge of Linux commands
- SSH client (PuTTY, Terminal, etc.)

### Step 1: Create Compute Instance

1. **Login to Oracle Cloud Console**
   - Go to https://cloud.oracle.com/
   - Sign in to your account

2. **Create VM Instance**
   - Navigate to: Compute → Instances
   - Click "Create Instance"
   - Choose these settings:
     - **Name**: `portfolio-server`
     - **Image**: Ubuntu 22.04 (Always Free Eligible)
     - **Shape**: VM.Standard.E2.1.Micro (Always Free)
     - **Boot Volume**: 50GB (Free tier limit)
     - **VCN**: Create new or use existing
     - **Subnet**: Public subnet
     - **Public IP**: Assign public IPv4 address
     - **SSH Keys**: Upload your public key or generate new

3. **Configure Security List**
   - Go to: Networking → Virtual Cloud Networks
   - Select your VCN → Security Lists → Default Security List
   - Add Ingress Rules:
     ```
     Source: 0.0.0.0/0
     Destination Port: 80 (HTTP)
     
     Source: 0.0.0.0/0
     Destination Port: 443 (HTTPS)
     
     Source: 0.0.0.0/0
     Destination Port: 3000 (Development)
     
     Source: 0.0.0.0/0
     Destination Port: 5000 (API)
     ```

### Step 2: Server Setup

1. **Connect via SSH**
   ```bash
   ssh -i your-private-key.pem ubuntu@your-public-ip
   ```

2. **Update System**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

3. **Install Node.js**
   ```bash
   # Install Node.js 18.x
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Verify installation
   node --version
   npm --version
   ```

4. **Install PM2 (Process Manager)**
   ```bash
   sudo npm install -g pm2
   ```

5. **Install Git**
   ```bash
   sudo apt install git -y
   ```

### Step 3: Deploy Application

1. **Clone/Upload Your Project**
   ```bash
   # Option 1: If using Git
   git clone https://github.com/your-username/portfolio.git
   cd portfolio
   
   # Option 2: Upload files via SCP
   scp -i your-key.pem -r ./portfolio ubuntu@your-ip:/home/ubuntu/
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Environment Variables**
   ```bash
   # Create environment file
   nano .env
   ```
   
   Add these variables:
   ```env
   NODE_ENV=production
   PORT=5000
   JWT_SECRET=your-super-secret-jwt-key-change-this
   HMAC_SECRET=your-super-secret-hmac-key-change-this
   ```

4. **Build Frontend**
   ```bash
   npm run build
   ```

5. **Configure Server for Production**
   
   Update `server/server.js` to serve built frontend:
   ```javascript
   // Add this after other middleware, before API routes
   if (process.env.NODE_ENV === 'production') {
     app.use(express.static(path.join(__dirname, '../dist')));
     
     // Serve React app for all non-API routes
     app.get('*', (req, res, next) => {
       if (req.path.startsWith('/api')) {
         return next();
       }
       res.sendFile(path.join(__dirname, '../dist/index.html'));
     });
   }
   ```

6. **Start with PM2**
   ```bash
   # Start the application
   pm2 start server/server.js --name "portfolio"
   
   # Save PM2 configuration
   pm2 save
   pm2 startup
   
   # Follow the instructions from pm2 startup command
   ```

### Step 4: Configure Firewall

1. **Configure Ubuntu Firewall**
   ```bash
   # Enable firewall
   sudo ufw enable
   
   # Allow SSH
   sudo ufw allow 22
   
   # Allow HTTP/HTTPS
   sudo ufw allow 80
   sudo ufw allow 443
   
   # Allow Node.js app
   sudo ufw allow 5000
   sudo ufw allow 3000
   
   # Check status
   sudo ufw status
   ```

### Step 5: Set Up Reverse Proxy (Optional but Recommended)

1. **Install Nginx**
   ```bash
   sudo apt install nginx -y
   ```

2. **Configure Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/portfolio
   ```
   
   Add configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com your-public-ip;
       
       # Serve static files
       location / {
           try_files $uri $uri/ @backend;
       }
       
       # Proxy API requests
       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
       
       # Fallback to Node.js app
       location @backend {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. **Enable Site**
   ```bash
   sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

### Step 6: SSL Certificate (Optional)

1. **Install Certbot**
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   ```

2. **Get Certificate**
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

## 🚀 Alternative Deployment Options

### 1. Heroku Deployment

1. **Install Heroku CLI**
2. **Create Heroku App**
   ```bash
   heroku create your-portfolio-app
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your-secret
   heroku config:set HMAC_SECRET=your-hmac-secret
   ```

4. **Create Procfile**
   ```
   web: node server/server.js
   ```

5. **Deploy**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

### 2. DigitalOcean Droplet

Similar to Oracle setup but using DigitalOcean:

1. **Create Droplet** (Ubuntu 22.04, $5/month)
2. **Follow Oracle steps 2-6**
3. **Configure domain** in DigitalOcean DNS

### 3. Vercel (Frontend Only)

For frontend-only deployment:

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Configure API Routes** (use Vercel Functions)

### 4. Netlify (Frontend Only)

1. **Build Project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag `dist` folder to Netlify
   - Or connect Git repository

## 🔧 Production Optimizations

### 1. Database Optimization

For production, consider upgrading to a proper database:

```javascript
// Example: MongoDB integration
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Define schemas
const ProjectSchema = new mongoose.Schema({
  title: String,
  description: String,
  // ... other fields
});
```

### 2. File Storage Optimization

For better performance, use cloud storage:

```javascript
// Example: AWS S3 integration
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

// Upload to S3
const uploadToS3 = async (file) => {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: file.filename,
    Body: file.buffer,
    ContentType: file.mimetype
  };
  
  return s3.upload(params).promise();
};
```

### 3. CDN Integration

Add CloudFlare or AWS CloudFront for better performance:

1. **Sign up for CloudFlare**
2. **Add your domain**
3. **Configure DNS**
4. **Enable caching rules**

### 4. Monitoring Setup

Add monitoring with PM2:

```bash
# Install PM2 monitoring
pm2 install pm2-server-monit

# Monitor logs
pm2 logs portfolio

# Monitor performance
pm2 monit
```

## 🔒 Security Checklist

### Production Security

- [ ] Change default JWT and HMAC secrets
- [ ] Enable HTTPS with SSL certificate
- [ ] Configure proper CORS origins
- [ ] Set up rate limiting
- [ ] Enable firewall rules
- [ ] Regular security updates
- [ ] Backup data regularly
- [ ] Monitor logs for suspicious activity

### Environment Variables

```env
# Required for production
NODE_ENV=production
PORT=5000
JWT_SECRET=your-256-bit-secret-key
HMAC_SECRET=your-256-bit-hmac-key

# Optional
MONGODB_URI=mongodb://localhost:27017/portfolio
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
S3_BUCKET=your-s3-bucket
```

## 📊 Monitoring & Maintenance

### Log Management

```bash
# View PM2 logs
pm2 logs portfolio

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# View system logs
sudo journalctl -f
```

### Backup Strategy

1. **Database Backup**
   ```bash
   # Backup data directory
   tar -czf backup-$(date +%Y%m%d).tar.gz data/
   ```

2. **Media Backup**
   ```bash
   # Backup uploads
   tar -czf media-backup-$(date +%Y%m%d).tar.gz server/storage/
   ```

3. **Automated Backups**
   ```bash
   # Add to crontab
   0 2 * * * /home/ubuntu/backup-script.sh
   ```

### Updates

```bash
# Update application
git pull origin main
npm install
npm run build
pm2 restart portfolio

# Update system
sudo apt update && sudo apt upgrade -y
```

## 🆘 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   sudo lsof -i :5000
   sudo kill -9 PID
   ```

2. **Permission Errors**
   ```bash
   sudo chown -R ubuntu:ubuntu /home/ubuntu/portfolio
   chmod -R 755 /home/ubuntu/portfolio
   ```

3. **Memory Issues**
   ```bash
   # Check memory usage
   free -h
   
   # Restart PM2 if needed
   pm2 restart portfolio
   ```

4. **File Upload Issues**
   ```bash
   # Check disk space
   df -h
   
   # Check upload directory permissions
   ls -la server/storage/
   ```

### Getting Help

- Check application logs: `pm2 logs portfolio`
- Monitor system resources: `htop`
- Test API endpoints: `curl http://localhost:5000/api/projects`
- Verify database files: `ls -la data/`

---

**🎉 Your portfolio is now live and ready to showcase your amazing work!**