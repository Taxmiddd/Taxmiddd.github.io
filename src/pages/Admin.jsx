import React, { useState, useContext, useEffect } from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LogIn, 
  Home, 
  FolderOpen, 
  Settings, 
  Users, 
  FileText, 
  Palette, 
  Upload,
  Eye,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { AuthContext } from '../App';
import AdminPanel from '../components/AdminPanel';

const Admin = () => {
  const { auth, login, logout } = useContext(AuthContext);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    const result = await login(loginForm.email, loginForm.password);
    
    if (!result.success) {
      setLoginError(result.error);
    }
    
    setLoginLoading(false);
  };

  // Navigation items based on user role
  const getNavigationItems = (userRole) => {
    const baseItems = [
      { name: 'Dashboard', href: '/admin', icon: Home, roles: ['viewer', 'editor', 'admin', 'owner'] },
      { name: 'Projects', href: '/admin/projects', icon: FolderOpen, roles: ['editor', 'admin', 'owner'] },
      { name: 'Content', href: '/admin/content', icon: FileText, roles: ['editor', 'admin', 'owner'] },
      { name: 'Media', href: '/admin/media', icon: Upload, roles: ['editor', 'admin', 'owner'] },
      { name: 'Theme', href: '/admin/theme', icon: Palette, roles: ['admin', 'owner'] },
      { name: 'Settings', href: '/admin/settings', icon: Settings, roles: ['admin', 'owner'] },
      { name: 'Users', href: '/admin/users', icon: Users, roles: ['owner'] },
    ];

    return baseItems.filter(item => item.roles.includes(userRole));
  };

  const isActive = (href) => {
    if (href === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(href);
  };

  // Login Form Component
  const LoginForm = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mb-6">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h2>
            <p className="text-gray-600">Sign in to manage your portfolio</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password (Optional for demo)
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Enter your password (optional)"
              />
            </div>

            {loginError && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                {loginError}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loginLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loginLoading ? (
                  <div className="spinner"></div>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 mr-2" />
                    Sign In
                  </>
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Demo: Use <code className="bg-gray-100 px-2 py-1 rounded">ashfaquet874@gmail.com</code> for owner access
              </p>
            </div>
          </form>

          <div className="mt-8 text-center">
            <Link
              to="/"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
            >
              <Eye className="w-4 h-4 mr-1" />
              View Portfolio
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );

  // If not authenticated, show login form
  if (!auth.isAuthenticated) {
    return <LoginForm />;
  }

  const navigationItems = getNavigationItems(auth.user?.role || 'viewer');

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden`} onClick={() => setSidebarOpen(false)} />
      
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-30 w-64 transition duration-300 transform bg-white lg:translate-x-0 lg:static lg:inset-0 shadow-lg`}>
        <div className="flex items-center justify-between flex-shrink-0 p-4 border-b border-gray-200">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">GD</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Admin Panel</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive(item.href)
                  ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-500'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">{auth.user?.email}</p>
              <p className="text-xs text-gray-500 capitalize">{auth.user?.role}</p>
            </div>
            <button
              onClick={logout}
              className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
            <Link
              to="/"
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <Eye className="w-6 h-6" />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/projects" element={<AdminPanel section="projects" />} />
            <Route path="/content" element={<AdminPanel section="content" />} />
            <Route path="/media" element={<AdminPanel section="media" />} />
            <Route path="/theme" element={<AdminPanel section="theme" />} />
            <Route path="/settings" element={<AdminPanel section="settings" />} />
            <Route path="/users" element={<AdminPanel section="users" />} />
            <Route path="*" element={<Navigate to="/admin" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

// Dashboard Component
const AdminDashboard = () => {
  const { auth } = useContext(AuthContext);
  const [stats, setStats] = useState({
    projects: 0,
    media: 0,
    users: 1
  });

  useEffect(() => {
    // Load dashboard stats
    loadStats();
  }, []);

  const loadStats = async () => {
    // This would fetch actual stats from the API
    setStats({
      projects: 12,
      media: 48,
      users: 3
    });
  };

  const quickActions = [
    { name: 'Add Project', href: '/admin/projects', icon: FolderOpen, color: 'bg-blue-500' },
    { name: 'Upload Media', href: '/admin/media', icon: Upload, color: 'bg-green-500' },
    { name: 'Edit Content', href: '/admin/content', icon: FileText, color: 'bg-purple-500' },
    { name: 'Customize Theme', href: '/admin/theme', icon: Palette, color: 'bg-pink-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {auth.user?.email?.split('@')[0]}!
          </h1>
          <p className="text-gray-600">
            Manage your portfolio content and settings from this dashboard.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Projects</p>
                <p className="text-3xl font-bold text-gray-900">{stats.projects}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FolderOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Media Files</p>
                <p className="text-3xl font-bold text-gray-900">{stats.media}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Upload className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.users}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.name}
                to={action.href}
                className="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
              >
                <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-gray-900">{action.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <FolderOpen className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New project added</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <Upload className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Media files uploaded</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                <Palette className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Theme updated</p>
                <p className="text-xs text-gray-500">3 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Admin;