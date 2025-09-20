import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Cloud database integration (optional)
let mongoose = null;
let User = null;
let Project = null;
let Settings = null;
let Content = null;

// Try to import mongoose for cloud database support
try {
  if (process.env.MONGODB_URI || process.env.DATABASE_URL) {
    const mongooseModule = await import('mongoose');
    mongoose = mongooseModule.default;
    
    // Define schemas
    const userSchema = new mongoose.Schema({
      email: { type: String, required: true, unique: true },
      password: { type: String, default: null },
      role: { type: String, enum: ['viewer', 'editor', 'admin', 'owner'], default: 'viewer' },
      passwordSet: { type: Boolean, default: false },
      requirePasswordChange: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now },
      lastLogin: { type: Date, default: null }
    });

    const projectSchema = new mongoose.Schema({
      title: String,
      description: String,
      category: String,
      tags: [String],
      featured: { type: Boolean, default: false },
      media: [Object],
      projectUrl: String,
      thumbnailPath: String,
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    });

    const settingsSchema = new mongoose.Schema({
      theme: Object,
      siteTitle: String,
      siteDescription: String,
      updatedAt: { type: Date, default: Date.now }
    });

    const contentSchema = new mongoose.Schema({
      hero: Object,
      about: Object,
      services: Object,
      cv: Object,
      updatedAt: { type: Date, default: Date.now }
    });

    User = mongoose.model('User', userSchema);
    Project = mongoose.model('Project', projectSchema);
    Settings = mongoose.model('Settings', settingsSchema);
    Content = mongoose.model('Content', contentSchema);

    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || process.env.DATABASE_URL;
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to cloud database (MongoDB)');
    
    // Initialize default data if needed
    await initializeCloudData();
  }
} catch (error) {
  console.log('📁 Using local file database (MongoDB not available)');
  mongoose = null;
}

// Initialize cloud database with default data
async function initializeCloudData() {
  if (!mongoose) return;
  
  try {
    // Check if owner user exists
    const ownerExists = await User.findOne({ email: 'ashfaquet874@gmail.com' });
    if (!ownerExists) {
      await User.create({
        email: 'ashfaquet874@gmail.com',
        role: 'owner',
        passwordSet: false,
        requirePasswordChange: true
      });
      console.log('✅ Created owner user in cloud database');
    }

    // Initialize settings if not exists
    const settingsExists = await Settings.findOne();
    if (!settingsExists) {
      await Settings.create({
        theme: {
          primaryColor: '#10b981',
          secondaryColor: '#8b5cf6',
          backgroundPrimary: '#0f172a',
          backgroundSecondary: '#1e293b',
          fontPrimary: 'Inter, sans-serif',
          fontSecondary: 'Inter, sans-serif'
        },
        siteTitle: 'Graphics Designer Portfolio',
        siteDescription: 'Professional graphics designer showcasing creative digital media work'
      });
      console.log('✅ Initialized settings in cloud database');
    }

    // Initialize content if not exists
    const contentExists = await Content.findOne();
    if (!contentExists) {
      await Content.create({
        hero: {
          title: 'Creative Graphics Designer',
          subtitle: 'Bringing ideas to life through innovative digital design',
          description: 'Welcome to my portfolio. I specialize in creating stunning visual experiences that communicate your brand\'s story effectively.'
        },
        about: {
          title: 'About Me',
          content: 'I am a passionate graphics designer with years of experience in creating compelling visual content. My expertise spans across branding, digital media, and creative design solutions.',
          skills: ['Brand Design', 'Digital Media', 'UI/UX Design', 'Print Design']
        },
        services: {
          title: 'Services & Pricing',
          items: []
        },
        cv: {
          filename: null,
          uploadedAt: null
        }
      });
      console.log('✅ Initialized content in cloud database');
    }
  } catch (error) {
    console.error('Error initializing cloud data:', error);
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file paths
const DB_DIR = path.join(__dirname, '../data');
const PROJECTS_FILE = path.join(DB_DIR, 'projects.json');
const USERS_FILE = path.join(DB_DIR, 'users.json');
const SETTINGS_FILE = path.join(DB_DIR, 'settings.json');
const CONTENT_FILE = path.join(DB_DIR, 'content.json');

// Ensure database directory exists
await fs.mkdir(DB_DIR, { recursive: true });

// Default data structures
const defaultProjects = [];
const defaultUsers = [
  {
    id: '1',
    email: 'ashfaquet874@gmail.com',
    password: null, // Will be set on first login
    role: 'owner',
    createdAt: new Date().toISOString(),
    lastLogin: null,
    passwordSet: false,
    requirePasswordChange: true
  }
];
const defaultSettings = {
  theme: {
    primaryColor: '#10b981',
    secondaryColor: '#8b5cf6',
    backgroundPrimary: '#0f172a',
    backgroundSecondary: '#1e293b',
    fontPrimary: 'Inter, sans-serif',
    fontSecondary: 'Inter, sans-serif'
  },
  siteTitle: 'Graphics Designer Portfolio',
  siteDescription: 'Professional graphics designer showcasing creative digital media work'
};
const defaultContent = {
  hero: {
    title: 'Creative Graphics Designer',
    subtitle: 'Bringing ideas to life through innovative digital design',
    description: 'Welcome to my portfolio. I specialize in creating stunning visual experiences that communicate your brand\'s story effectively.'
  },
  about: {
    title: 'About Me',
    content: 'I am a passionate graphics designer with years of experience in creating compelling visual content. My expertise spans across branding, digital media, and creative design solutions.',
    skills: ['Brand Design', 'Digital Media', 'UI/UX Design', 'Print Design']
  },
  services: {
    title: 'Services & Pricing',
    items: []
  },
  cv: {
    filename: null,
    uploadedAt: null
  }
};

// Database class for file-based storage
class Database {
  constructor() {
    this.init();
  }

  async init() {
    try {
      // Initialize files if they don't exist
      await this.ensureFile(PROJECTS_FILE, defaultProjects);
      await this.ensureFile(USERS_FILE, defaultUsers);
      await this.ensureFile(SETTINGS_FILE, defaultSettings);
      await this.ensureFile(CONTENT_FILE, defaultContent);
    } catch (error) {
      console.error('Database initialization error:', error);
    }
  }

  async ensureFile(filePath, defaultData) {
    try {
      await fs.access(filePath);
    } catch {
      await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2));
    }
  }

  async readFile(filePath) {
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading ${filePath}:`, error);
      return null;
    }
  }

  async writeFile(filePath, data) {
    try {
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error(`Error writing ${filePath}:`, error);
      return false;
    }
  }

  // Projects CRUD
  async getProjects() {
    return await this.readFile(PROJECTS_FILE) || [];
  }

  async getProject(id) {
    const projects = await this.getProjects();
    return projects.find(p => p.id === id);
  }

  async createProject(project) {
    const projects = await this.getProjects();
    const newProject = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    projects.push(newProject);
    await this.writeFile(PROJECTS_FILE, projects);
    return newProject;
  }

  async updateProject(id, updates) {
    const projects = await this.getProjects();
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    projects[index] = {
      ...projects[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    await this.writeFile(PROJECTS_FILE, projects);
    return projects[index];
  }

  async deleteProject(id) {
    const projects = await this.getProjects();
    const filteredProjects = projects.filter(p => p.id !== id);
    await this.writeFile(PROJECTS_FILE, filteredProjects);
    return true;
  }

  // Users CRUD - Cloud or Local
  async getUsers() {
    if (mongoose && User) {
      return await User.find().select('-password').lean();
    }
    return await this.readFile(USERS_FILE) || [];
  }

  async getUser(email) {
    if (mongoose && User) {
      return await User.findOne({ email }).lean();
    }
    const users = await this.getUsers();
    return users.find(u => u.email === email);
  }

  async getUserWithPassword(email) {
    if (mongoose && User) {
      return await User.findOne({ email }).lean();
    }
    const users = await this.readFile(USERS_FILE) || [];
    return users.find(u => u.email === email);
  }

  async createUser(user) {
    const newUser = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      lastLogin: null,
      passwordSet: false,
      requirePasswordChange: user.role === 'owner'
    };

    if (mongoose && User) {
      const created = await User.create(newUser);
      return created.toObject();
    }

    const users = await this.getUsers();
    users.push(newUser);
    await this.writeFile(USERS_FILE, users);
    return newUser;
  }

  async updateUser(email, updates) {
    if (mongoose && User) {
      const updated = await User.findOneAndUpdate(
        { email },
        { ...updates, updatedAt: new Date() },
        { new: true }
      ).lean();
      return updated;
    }

    const users = await this.readFile(USERS_FILE) || [];
    const index = users.findIndex(u => u.email === email);
    if (index === -1) return null;
    
    users[index] = {
      ...users[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    await this.writeFile(USERS_FILE, users);
    return users[index];
  }

  async setUserPassword(email, hashedPassword) {
    const updates = {
      password: hashedPassword,
      passwordSet: true,
      requirePasswordChange: false,
      updatedAt: new Date().toISOString()
    };
    
    return await this.updateUser(email, updates);
  }

  // Settings
  async getSettings() {
    return await this.readFile(SETTINGS_FILE) || defaultSettings;
  }

  async updateSettings(updates) {
    const settings = await this.getSettings();
    const newSettings = { ...settings, ...updates };
    await this.writeFile(SETTINGS_FILE, newSettings);
    return newSettings;
  }

  // Content
  async getContent() {
    return await this.readFile(CONTENT_FILE) || defaultContent;
  }

  async updateContent(updates) {
    const content = await this.getContent();
    const newContent = { ...content, ...updates };
    await this.writeFile(CONTENT_FILE, newContent);
    return newContent;
  }
}

// Export singleton instance
export default new Database();