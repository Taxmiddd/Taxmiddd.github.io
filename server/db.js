import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

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
    role: 'owner',
    createdAt: new Date().toISOString(),
    lastLogin: null
  }
];
const defaultSettings = {
  theme: {
    primaryColor: '#3B82F6',
    secondaryColor: '#8B5CF6',
    backgroundPrimary: '#FFFFFF',
    backgroundSecondary: '#F8FAFC',
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

  // Users CRUD
  async getUsers() {
    return await this.readFile(USERS_FILE) || [];
  }

  async getUser(email) {
    const users = await this.getUsers();
    return users.find(u => u.email === email);
  }

  async createUser(user) {
    const users = await this.getUsers();
    const newUser = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      lastLogin: null
    };
    users.push(newUser);
    await this.writeFile(USERS_FILE, users);
    return newUser;
  }

  async updateUser(email, updates) {
    const users = await this.getUsers();
    const index = users.findIndex(u => u.email === email);
    if (index === -1) return null;
    
    users[index] = {
      ...users[index],
      ...updates
    };
    await this.writeFile(USERS_FILE, users);
    return users[index];
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