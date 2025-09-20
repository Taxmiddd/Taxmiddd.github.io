import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { AuthContext, ThemeContext } from '../App';
import ProjectForm from './ProjectForm';
import CVViewer from './CVViewer';
import ThemeCustomizer from './ThemeCustomizer';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  Save, 
  X, 
  Eye, 
  Download,
  Users,
  Settings,
  Palette,
  FileText,
  FolderOpen,
  Image,
  Video,
  File
} from 'lucide-react';

const AdminPanel = ({ section }) => {
  const { auth } = useContext(AuthContext);
  const { theme, updateTheme } = useContext(ThemeContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const showMessage = (message, isError = false) => {
    if (isError) {
      setError(message);
      setSuccess('');
    } else {
      setSuccess(message);
      setError('');
    }
  };

  // Render different sections based on the section prop
  switch (section) {
    case 'projects':
      return <ProjectsSection showMessage={showMessage} loading={loading} setLoading={setLoading} />;
    case 'content':
      return <ContentSection showMessage={showMessage} loading={loading} setLoading={setLoading} />;
    case 'media':
      return <MediaSection showMessage={showMessage} loading={loading} setLoading={setLoading} />;
    case 'theme':
      return <ThemeCustomizer />;
    case 'settings':
      return <SettingsSection showMessage={showMessage} loading={loading} setLoading={setLoading} />;
    case 'users':
      return <UsersSection showMessage={showMessage} loading={loading} setLoading={setLoading} />;
    default:
      return <div>Section not found</div>;
  }
};

// Projects Management Section
const ProjectsSection = ({ showMessage, loading, setLoading }) => {
  const [projects, setProjects] = useState([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/projects');
      setProjects(response.data);
    } catch (error) {
      showMessage('Failed to fetch projects', true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      await axios.delete(`/api/admin/projects/${projectId}`);
      setProjects(projects.filter(p => p.id !== projectId));
      showMessage('Project deleted successfully');
    } catch (error) {
      showMessage('Failed to delete project', true);
    }
  };

  const handleProjectSaved = (savedProject) => {
    if (editingProject) {
      setProjects(projects.map(p => p.id === savedProject.id ? savedProject : p));
      showMessage('Project updated successfully');
    } else {
      setProjects([savedProject, ...projects]);
      showMessage('Project created successfully');
    }
    setShowProjectForm(false);
    setEditingProject(null);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600">Manage your portfolio projects</p>
        </div>
        <button
          onClick={() => setShowProjectForm(true)}
          className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Project
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            {/* Project Image */}
            <div className="h-48 bg-gray-100">
              {project.thumbnailPath ? (
                <img
                  src={project.thumbnailPath}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <FolderOpen className="w-12 h-12" />
                </div>
              )}
            </div>

            {/* Project Info */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {project.title}
                </h3>
                {project.featured && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                    Featured
                  </span>
                )}
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {project.description}
              </p>

              {project.category && (
                <span className="inline-block px-2 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded-full mb-4">
                  {project.category}
                </span>
              )}

              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingProject(project);
                      setShowProjectForm(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <a
                  href={`/projects/${project.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  title="View"
                >
                  <Eye className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {projects.length === 0 && !loading && (
        <div className="text-center py-16">
          <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-600 mb-6">Create your first project to get started</p>
          <button
            onClick={() => setShowProjectForm(true)}
            className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Your First Project
          </button>
        </div>
      )}

      {/* Project Form Modal */}
      {showProjectForm && (
        <ProjectForm
          project={editingProject}
          onSave={handleProjectSaved}
          onClose={() => {
            setShowProjectForm(false);
            setEditingProject(null);
          }}
        />
      )}
    </div>
  );
};

// Content Management Section
const ContentSection = ({ showMessage, loading, setLoading }) => {
  const [content, setContent] = useState({
    hero: { title: '', subtitle: '', description: '' },
    about: { title: '', content: '', skills: [] },
    services: { title: '', items: [] }
  });
  const [activeTab, setActiveTab] = useState('hero');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/content');
      setContent(response.data);
    } catch (error) {
      showMessage('Failed to fetch content', true);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await axios.put('/api/admin/content', content);
      showMessage('Content updated successfully');
    } catch (error) {
      showMessage('Failed to update content', true);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'hero', name: 'Hero Section', icon: FileText },
    { id: 'about', name: 'About Me', icon: Users },
    { id: 'services', name: 'Services', icon: Settings },
    { id: 'cv', name: 'CV Management', icon: FileText }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
          <p className="text-gray-600">Edit your website content</p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? (
            <div className="spinner mr-2"></div>
          ) : (
            <Save className="w-5 h-5 mr-2" />
          )}
          Save Changes
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {activeTab === 'hero' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Hero Section</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Main Title
              </label>
              <input
                type="text"
                value={content.hero?.title || ''}
                onChange={(e) => setContent({
                  ...content,
                  hero: { ...content.hero, title: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                placeholder="Your main headline"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subtitle
              </label>
              <input
                type="text"
                value={content.hero?.subtitle || ''}
                onChange={(e) => setContent({
                  ...content,
                  hero: { ...content.hero, subtitle: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                placeholder="Your subtitle"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                rows={4}
                value={content.hero?.description || ''}
                onChange={(e) => setContent({
                  ...content,
                  hero: { ...content.hero, description: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                placeholder="Brief description about yourself"
              />
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">About Me Section</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Title
              </label>
              <input
                type="text"
                value={content.about?.title || ''}
                onChange={(e) => setContent({
                  ...content,
                  about: { ...content.about, title: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                About Content
              </label>
              <textarea
                rows={6}
                value={content.about?.content || ''}
                onChange={(e) => setContent({
                  ...content,
                  about: { ...content.about, content: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                placeholder="Tell your story..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills (one per line)
              </label>
              <textarea
                rows={4}
                value={content.about?.skills?.join('\n') || ''}
                onChange={(e) => setContent({
                  ...content,
                  about: { 
                    ...content.about, 
                    skills: e.target.value.split('\n').filter(skill => skill.trim()) 
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                placeholder="Brand Design&#10;UI/UX Design&#10;Web Development"
              />
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Services & Pricing</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Title
              </label>
              <input
                type="text"
                value={content.services?.title || ''}
                onChange={(e) => setContent({
                  ...content,
                  services: { ...content.services, title: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Services
                </label>
                <button
                  onClick={() => setContent({
                    ...content,
                    services: {
                      ...content.services,
                      items: [...(content.services?.items || []), { title: '', description: '', price: '' }]
                    }
                  })}
                  className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Service
                </button>
              </div>

              <div className="space-y-4">
                {(content.services?.items || []).map((service, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Service {index + 1}</h4>
                      <button
                        onClick={() => setContent({
                          ...content,
                          services: {
                            ...content.services,
                            items: content.services.items.filter((_, i) => i !== index)
                          }
                        })}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="Service title"
                        value={service.title}
                        onChange={(e) => {
                          const newItems = [...content.services.items];
                          newItems[index] = { ...newItems[index], title: e.target.value };
                          setContent({
                            ...content,
                            services: { ...content.services, items: newItems }
                          });
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                      />
                      <input
                        type="text"
                        placeholder="Description"
                        value={service.description}
                        onChange={(e) => {
                          const newItems = [...content.services.items];
                          newItems[index] = { ...newItems[index], description: e.target.value };
                          setContent({
                            ...content,
                            services: { ...content.services, items: newItems }
                          });
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                      />
                      <input
                        type="text"
                        placeholder="Price (optional)"
                        value={service.price}
                        onChange={(e) => {
                          const newItems = [...content.services.items];
                          newItems[index] = { ...newItems[index], price: e.target.value };
                          setContent({
                            ...content,
                            services: { ...content.services, items: newItems }
                          });
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cv' && (
          <CVViewer showMessage={showMessage} />
        )}
      </div>
    </div>
  );
};

// Media Management Section
const MediaSection = ({ showMessage }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = async (uploadedFiles) => {
    const formData = new FormData();
    Array.from(uploadedFiles).forEach(file => {
      formData.append('files', file);
    });

    try {
      setUploading(true);
      const response = await axios.post('/api/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setFiles([...response.data.files, ...files]);
      showMessage(`${response.data.files.length} file(s) uploaded successfully`);
    } catch (error) {
      showMessage('Failed to upload files', true);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileUpload(droppedFiles);
    }
  };

  const getFileIcon = (mimetype) => {
    if (mimetype?.startsWith('image/')) return <Image className="w-6 h-6" />;
    if (mimetype?.startsWith('video/')) return <Video className="w-6 h-6" />;
    return <File className="w-6 h-6" />;
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Media Management</h1>
        <p className="text-gray-600">Upload and manage your portfolio media files</p>
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center mb-8 transition-colors ${
          dragOver ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Media Files</h3>
        <p className="text-gray-600 mb-4">Drag and drop files here, or click to browse</p>
        
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={(e) => handleFileUpload(e.target.files)}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg cursor-pointer transition-colors"
        >
          {uploading ? (
            <>
              <div className="spinner mr-2"></div>
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5 mr-2" />
              Choose Files
            </>
          )}
        </label>
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {files.map((file, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* File Preview */}
            <div className="h-48 bg-gray-100 flex items-center justify-center">
              {file.thumbnailPath ? (
                <img
                  src={file.thumbnailPath}
                  alt={file.originalName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-400">
                  {getFileIcon(file.mimetype)}
                </div>
              )}
            </div>

            {/* File Info */}
            <div className="p-4">
              <h4 className="font-medium text-gray-900 truncate mb-1">
                {file.originalName}
              </h4>
              <p className="text-sm text-gray-500 mb-2">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                  {file.mimetype?.split('/')[1]?.toUpperCase() || 'FILE'}
                </span>
                
                <div className="flex space-x-1">
                  <button
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    title="View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {files.length === 0 && (
        <div className="text-center py-16">
          <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No media files yet</h3>
          <p className="text-gray-600">Upload your first media files to get started</p>
        </div>
      )}
    </div>
  );
};

// Settings Section
const SettingsSection = ({ showMessage }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <p className="text-gray-600">Settings panel coming soon...</p>
      </div>
    </div>
  );
};

// Users Management Section
const UsersSection = ({ showMessage }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/admin/users');
      setUsers(response.data);
    } catch (error) {
      showMessage('Failed to fetch users', true);
    }
  };

  const updateUserRole = async (email, newRole) => {
    try {
      await axios.put(`/api/admin/users/${email}/role`, { role: newRole });
      setUsers(users.map(user => 
        user.email === email ? { ...user, role: newRole } : user
      ));
      showMessage('User role updated successfully');
    } catch (error) {
      showMessage('Failed to update user role', true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">User Management</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Users</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {users.map((user) => (
            <div key={user.id} className="px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{user.email}</h3>
                <p className="text-sm text-gray-500">
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <select
                  value={user.role}
                  onChange={(e) => updateUserRole(user.email, e.target.value)}
                  disabled={user.email === 'ashfaquet874@gmail.com'}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50"
                >
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                  <option value="owner">Owner</option>
                </select>
                
                <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
                  user.role === 'owner' ? 'bg-purple-100 text-purple-800' :
                  user.role === 'admin' ? 'bg-red-100 text-red-800' :
                  user.role === 'editor' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {user.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;