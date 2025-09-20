# Graphics Designer Portfolio Website

A modern, elegant, and fully responsive portfolio website for graphics designers with a comprehensive admin panel for content management.

## 🌟 Features

### Frontend
- **Modern React UI** with Tailwind CSS
- **Fully Responsive** design (mobile-first)
- **Smooth Animations** using Framer Motion
- **Dynamic Theme System** with real-time customization
- **Project Gallery** with modal/detail views
- **CV Viewer** with secure download
- **SEO Optimized** structure

### Admin Panel
- **Role-based Access Control** (Owner/Admin/Editor/Viewer)
- **Project Management** with drag-and-drop media upload
- **Content Management** for all website sections
- **Theme Customization** with live preview
- **Media Management** with watermarked thumbnails
- **CV Management** with secure downloads
- **User Management** (Owner only)

### Backend
- **Express.js** server with JWT authentication
- **File-based Database** (JSON storage)
- **Media Protection** with signed URLs and watermarking
- **HMAC Security** for download links
- **Rate Limiting** and security middleware
- **RESTful API** design

### Security Features
- **Signed URLs** for secure file access
- **Watermarked Thumbnails** for public viewing
- **High-res Media Protection** in secure storage
- **JWT Authentication** with role-based permissions
- **HMAC Validation** for download links
- **Rate Limiting** and CORS protection

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Modern web browser

### Installation

1. **Clone or download** this project
2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   - **Portfolio**: http://localhost:3000
   - **Admin Panel**: http://localhost:3000/admin

### Default Admin Access
- **Email**: `ashfaquet874@gmail.com`
- **Role**: Owner (full access)
- **Password**: Not required for demo (just enter the email)

## 📁 Project Structure

```
├── package.json              # Dependencies and scripts
├── vite.config.js            # Vite configuration
├── tailwind.config.cjs       # Tailwind CSS configuration
├── server/                   # Backend server
│   ├── server.js            # Main server file
│   ├── db.js                # Database layer
│   ├── auth.js              # Authentication & authorization
│   ├── signedUrl.js         # Secure URL generation
│   ├── uploads.js           # File upload & processing
│   └── storage/secure/      # Secure file storage
├── src/                     # Frontend React app
│   ├── App.jsx              # Main app component
│   ├── components/          # Reusable components
│   ├── pages/               # Page components
│   └── index.css            # Global styles
├── public/                  # Static files
│   └── thumbnails/          # Generated thumbnails
└── data/                    # JSON database files
```

## 🎨 Admin Panel Usage

### 1. Login
- Navigate to `/admin`
- Enter email: `ashfaquet874@gmail.com`
- Click "Sign In"

### 2. Manage Projects
- **Add Projects**: Upload media, add descriptions, set categories
- **Edit Projects**: Update content, manage media
- **Featured Projects**: Mark projects as featured
- **Categories & Tags**: Organize your work

### 3. Content Management
- **Hero Section**: Update main headline and description
- **About Me**: Edit bio, skills, and personal info
- **Services**: Add/edit services and pricing
- **CV Management**: Upload and manage your CV

### 4. Theme Customization
- **Quick Palettes**: Choose from predefined color schemes
- **Custom Colors**: Set primary, secondary, and background colors
- **Typography**: Select fonts for headings and body text
- **Live Preview**: See changes in real-time

### 5. Media Management
- **Upload Files**: Drag-and-drop or browse to upload
- **Automatic Processing**: Thumbnails generated automatically
- **Secure Storage**: Original files protected with signed URLs
- **Watermarked Previews**: Public sees only watermarked versions

### 6. User Management (Owner Only)
- **Role Assignment**: Set user roles (Viewer/Editor/Admin/Owner)
- **Access Control**: Manage who can edit what
- **User Overview**: See all registered users

## 🔐 Security Features

### Media Protection
- **High-resolution files** stored in `/server/storage/secure`
- **Watermarked thumbnails** generated in `/public/thumbnails`
- **Signed URLs** with HMAC validation and expiry
- **Public access** limited to watermarked previews only

### Authentication & Authorization
- **JWT tokens** for secure authentication
- **Role-based permissions** (Owner > Admin > Editor > Viewer)
- **Protected routes** with middleware validation
- **Automatic user creation** with Viewer role for new logins

### File Security
- **HMAC signatures** for download links
- **Time-based expiry** for signed URLs
- **Secure file serving** with validation
- **Rate limiting** on API endpoints

## 🎯 Customization

### Theme System
The theme system uses CSS custom properties that can be updated dynamically:

```css
:root {
  --color-primary-500: #3B82F6;
  --color-secondary-500: #8B5CF6;
  --color-bg-primary: #FFFFFF;
  --color-bg-secondary: #F8FAFC;
  --font-primary: 'Inter', sans-serif;
  --font-secondary: 'Inter', sans-serif;
}
```

### Adding New Sections
1. Update the database schema in `server/db.js`
2. Add API endpoints in `server/server.js`
3. Create React components in `src/components/`
4. Add admin panel controls in `src/components/AdminPanel.jsx`

### Environment Variables
Set these for production:

```bash
JWT_SECRET=your-super-secret-jwt-key
HMAC_SECRET=your-super-secret-hmac-key
NODE_ENV=production
PORT=5000
```

## 📱 Responsive Design

The website is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

All components adapt gracefully across devices with mobile-first design principles.

## 🔧 API Endpoints

### Public Endpoints
- `GET /api/projects` - Get all projects (public data)
- `GET /api/projects/:id` - Get single project
- `GET /api/content` - Get site content and settings

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Admin Endpoints (Protected)
- `GET /api/admin/projects` - Get all projects (full data)
- `POST /api/admin/projects` - Create project
- `PUT /api/admin/projects/:id` - Update project
- `DELETE /api/admin/projects/:id` - Delete project
- `POST /api/admin/upload` - Upload media files
- `POST /api/admin/upload-cv` - Upload CV
- `GET /api/admin/content` - Get all content
- `PUT /api/admin/content` - Update content
- `GET /api/admin/settings` - Get settings
- `PUT /api/admin/settings` - Update settings

## 🚀 Deployment

See [README_DEPLOY.md](./README_DEPLOY.md) for detailed deployment instructions for various platforms including Oracle Free Tier.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Support

For support or questions:
- Check the documentation
- Review the code comments
- Open an issue on the repository

---

**Built with ❤️ for graphics designers who want a professional online presence**