import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Import our modules
import db from './db.js';
import { authenticate, authorize, loginUser, canAccess } from './auth.js';
import { generateSignedUrl, generateCVSignedUrl, generateMediaSignedUrl, handleSignedUrl } from './signedUrl.js';
import { upload, processUploadedFile, deleteUploadedFile } from './uploads.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for development
  crossOriginEmbedderPolicy: false
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});
app.use('/api', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.com'] 
    : ['http://localhost:3000'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use('/thumbnails', express.static(path.join(__dirname, '../public/thumbnails')));

// ========== PUBLIC API ROUTES ==========

// Get all projects (public)
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await db.getProjects();
    // Return only public data for projects
    const publicProjects = projects.map(project => ({
      id: project.id,
      title: project.title,
      description: project.description,
      category: project.category,
      tags: project.tags,
      thumbnailPath: project.thumbnailPath,
      createdAt: project.createdAt,
      featured: project.featured
    }));
    res.json(publicProjects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Get single project (public)
app.get('/api/projects/:id', async (req, res) => {
  try {
    const project = await db.getProject(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Return public project data with thumbnail media only
    const publicProject = {
      ...project,
      media: project.media?.map(item => ({
        ...item,
        // Only provide thumbnail, not original file path
        url: item.thumbnailPath,
        isWatermarked: true
      }))
    };
    
    res.json(publicProject);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Get site settings and content (public)
app.get('/api/content', async (req, res) => {
  try {
    const [settings, content] = await Promise.all([
      db.getSettings(),
      db.getContent()
    ]);
    
    res.json({
      settings: {
        theme: settings.theme,
        siteTitle: settings.siteTitle,
        siteDescription: settings.siteDescription
      },
      content: {
        hero: content.hero,
        about: content.about,
        services: content.services
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

// ========== AUTHENTICATION ROUTES ==========

// Simple login endpoint (for demo - in production use OAuth)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // For demo purposes, we'll allow login with just email
    // In production, implement proper OAuth or password authentication
    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }
    
    const { user, token } = await loginUser(email);
    
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Get current user info
app.get('/api/auth/me', authenticate, async (req, res) => {
  try {
    const user = await db.getUser(req.user.email);
    res.json({
      id: user.id,
      email: user.email,
      role: user.role,
      lastLogin: user.lastLogin
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user info' });
  }
});

// ========== ADMIN API ROUTES ==========

// Get all projects (admin - includes full data)
app.get('/api/admin/projects', authenticate, authorize('editor'), async (req, res) => {
  try {
    const projects = await db.getProjects();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Create project
app.post('/api/admin/projects', authenticate, authorize('editor'), async (req, res) => {
  try {
    const project = await db.createProject(req.body);
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Update project
app.put('/api/admin/projects/:id', authenticate, authorize('editor'), async (req, res) => {
  try {
    const project = await db.updateProject(req.params.id, req.body);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete project
app.delete('/api/admin/projects/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const project = await db.getProject(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Delete associated media files
    if (project.media) {
      for (const mediaItem of project.media) {
        await deleteUploadedFile(mediaItem.filename);
      }
    }
    
    await db.deleteProject(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// ========== FILE UPLOAD ROUTES ==========

// Upload media files
app.post('/api/admin/upload', authenticate, authorize('editor'), upload.array('files', 10), async (req, res) => {
  try {
    const processedFiles = [];
    
    for (const file of req.files) {
      const fileInfo = await processUploadedFile(file);
      processedFiles.push(fileInfo);
    }
    
    res.json({ files: processedFiles });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload files' });
  }
});

// Upload CV
app.post('/api/admin/upload-cv', authenticate, authorize('admin'), upload.single('cv'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'Only PDF files allowed for CV' });
    }
    
    // Update content with CV info
    await db.updateContent({
      cv: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        uploadedAt: new Date().toISOString()
      }
    });
    
    res.json({
      message: 'CV uploaded successfully',
      filename: req.file.filename,
      originalName: req.file.originalname
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload CV' });
  }
});

// ========== SECURE FILE ACCESS ROUTES ==========

// Serve secure files with signed URLs
app.get('/api/secure/:filename', handleSignedUrl, (req, res) => {
  const filePath = path.join(__dirname, 'storage/secure', req.verifiedFilename);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }
  
  res.sendFile(filePath);
});

// Generate signed URL for media download (admin only)
app.post('/api/admin/generate-download-url', authenticate, authorize('editor'), async (req, res) => {
  try {
    const { filename, type = 'media' } = req.body;
    
    if (!filename) {
      return res.status(400).json({ error: 'Filename required' });
    }
    
    const signedUrl = type === 'cv' 
      ? generateCVSignedUrl(filename)
      : generateMediaSignedUrl(filename);
    
    res.json({ downloadUrl: signedUrl });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate download URL' });
  }
});

// ========== CONTENT MANAGEMENT ROUTES ==========

// Get all content (admin)
app.get('/api/admin/content', authenticate, authorize('editor'), async (req, res) => {
  try {
    const content = await db.getContent();
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

// Update content
app.put('/api/admin/content', authenticate, authorize('editor'), async (req, res) => {
  try {
    const content = await db.updateContent(req.body);
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update content' });
  }
});

// Get settings (admin)
app.get('/api/admin/settings', authenticate, authorize('admin'), async (req, res) => {
  try {
    const settings = await db.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Update settings
app.put('/api/admin/settings', authenticate, authorize('admin'), async (req, res) => {
  try {
    const settings = await db.updateSettings(req.body);
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// ========== USER MANAGEMENT ROUTES ==========

// Get all users (owner only)
app.get('/api/admin/users', authenticate, authorize('owner'), async (req, res) => {
  try {
    const users = await db.getUsers();
    res.json(users.map(user => ({
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Update user role (owner only)
app.put('/api/admin/users/:email/role', authenticate, authorize('owner'), async (req, res) => {
  try {
    const { role } = req.body;
    const validRoles = ['viewer', 'editor', 'admin', 'owner'];
    
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    
    // Prevent changing owner's role
    if (req.params.email === 'ashfaquet874@gmail.com' && role !== 'owner') {
      return res.status(403).json({ error: 'Cannot change owner role' });
    }
    
    const user = await db.updateUser(req.params.email, { role });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'User role updated', user: { email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

// ========== ERROR HANDLING ==========

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔒 JWT Secret: ${process.env.JWT_SECRET ? 'Set' : 'Using default (change in production)'}`);
  console.log(`🔐 HMAC Secret: ${process.env.HMAC_SECRET ? 'Set' : 'Using default (change in production)'}`);
});