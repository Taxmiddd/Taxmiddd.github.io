import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

// Import components
import Header from './components/Header';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectPage from './pages/ProjectPage';
import Admin from './pages/Admin';

// Theme context
export const ThemeContext = React.createContext();
export const AuthContext = React.createContext();

function App() {
  // Theme state
  const [theme, setTheme] = useState({
    primaryColor: '#3B82F6',
    secondaryColor: '#8B5CF6',
    backgroundPrimary: '#FFFFFF',
    backgroundSecondary: '#F8FAFC',
    fontPrimary: 'Inter, sans-serif',
    fontSecondary: 'Inter, sans-serif'
  });

  // Site content state
  const [siteContent, setSiteContent] = useState({
    hero: {
      title: 'Creative Graphics Designer',
      subtitle: 'Bringing ideas to life through innovative digital design',
      description: 'Welcome to my portfolio. I specialize in creating stunning visual experiences that communicate your brand\'s story effectively.'
    },
    about: {
      title: 'About Me',
      content: 'I am a passionate graphics designer with years of experience in creating compelling visual content.',
      skills: ['Brand Design', 'Digital Media', 'UI/UX Design', 'Print Design']
    },
    services: {
      title: 'Services & Pricing',
      items: []
    }
  });

  // Authentication state
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
    token: null,
    loading: true
  });

  // Load theme and content on app start
  useEffect(() => {
    loadInitialData();
    checkAuthStatus();
  }, []);

  // Apply theme to CSS variables when theme changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const loadInitialData = async () => {
    try {
      const response = await axios.get('/api/content');
      const { settings, content } = response.data;
      
      if (settings.theme) {
        setTheme(settings.theme);
      }
      
      if (content) {
        setSiteContent(content);
      }
    } catch (error) {
      console.error('Failed to load initial data:', error);
    }
  };

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setAuth(prev => ({ ...prev, loading: false }));
        return;
      }

      // Verify token with server
      const response = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAuth({
        isAuthenticated: true,
        user: response.data,
        token,
        loading: false
      });

      // Set default axios header for authenticated requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (error) {
      // Token is invalid, remove it
      localStorage.removeItem('auth_token');
      delete axios.defaults.headers.common['Authorization'];
      setAuth({
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false
      });
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user } = response.data;

      localStorage.setItem('auth_token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setAuth({
        isAuthenticated: true,
        user,
        token,
        loading: false
      });

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    delete axios.defaults.headers.common['Authorization'];
    setAuth({
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false
    });
  };

  const applyTheme = (themeData) => {
    const root = document.documentElement;
    
    // Generate color variations for primary color
    const primaryVariations = generateColorVariations(themeData.primaryColor);
    const secondaryVariations = generateColorVariations(themeData.secondaryColor);
    
    // Apply primary color variations
    Object.entries(primaryVariations).forEach(([shade, color]) => {
      root.style.setProperty(`--color-primary-${shade}`, color);
    });
    
    // Apply secondary color variations
    Object.entries(secondaryVariations).forEach(([shade, color]) => {
      root.style.setProperty(`--color-secondary-${shade}`, color);
    });
    
    // Apply background colors
    root.style.setProperty('--color-bg-primary', themeData.backgroundPrimary);
    root.style.setProperty('--color-bg-secondary', themeData.backgroundSecondary);
    
    // Apply fonts
    root.style.setProperty('--font-primary', themeData.fontPrimary);
    root.style.setProperty('--font-secondary', themeData.fontSecondary);
  };

  const generateColorVariations = (baseColor) => {
    // Simple color variation generator
    // In a real app, you might use a more sophisticated color library
    const hex = baseColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    const variations = {};
    const steps = [0.95, 0.9, 0.8, 0.6, 0.4, 0.2, 0.1, 0.05, 0.02]; // 50-900
    const shades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];
    
    shades.forEach((shade, index) => {
      if (shade === '500') {
        variations[shade] = baseColor;
      } else {
        const factor = steps[index];
        const newR = Math.round(r + (255 - r) * factor);
        const newG = Math.round(g + (255 - g) * factor);
        const newB = Math.round(b + (255 - b) * factor);
        
        if (index > 4) {
          // Darker shades
          const darkFactor = 1 - (index - 4) * 0.15;
          variations[shade] = `rgb(${Math.round(r * darkFactor)}, ${Math.round(g * darkFactor)}, ${Math.round(b * darkFactor)})`;
        } else {
          variations[shade] = `rgb(${newR}, ${newG}, ${newB})`;
        }
      }
    });
    
    return variations;
  };

  const updateTheme = async (newTheme) => {
    setTheme(newTheme);
    
    // If authenticated, save to server
    if (auth.isAuthenticated && auth.user?.role === 'admin' || auth.user?.role === 'owner') {
      try {
        await axios.put('/api/admin/settings', { theme: newTheme });
      } catch (error) {
        console.error('Failed to save theme:', error);
      }
    }
  };

  const updateContent = async (newContent) => {
    setSiteContent(newContent);
    
    // If authenticated, save to server
    if (auth.isAuthenticated) {
      try {
        await axios.put('/api/admin/content', newContent);
      } catch (error) {
        console.error('Failed to save content:', error);
      }
    }
  };

  // Protected route component
  const ProtectedRoute = ({ children, requiredRole = 'viewer' }) => {
    if (auth.loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="spinner"></div>
        </div>
      );
    }

    if (!auth.isAuthenticated) {
      return <Navigate to="/admin" />;
    }

    const roleHierarchy = { viewer: 1, editor: 2, admin: 3, owner: 4 };
    const userLevel = roleHierarchy[auth.user?.role] || 0;
    const requiredLevel = roleHierarchy[requiredRole] || 0;

    if (userLevel < requiredLevel) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      );
    }

    return children;
  };

  if (auth.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      <AuthContext.Provider value={{ auth, login, logout }}>
        <Router>
          <div className="App min-h-screen">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={
                <>
                  <Header siteContent={siteContent} />
                  <Home siteContent={siteContent} updateContent={updateContent} />
                </>
              } />
              
              <Route path="/projects" element={
                <>
                  <Header siteContent={siteContent} />
                  <Projects />
                </>
              } />
              
              <Route path="/projects/:id" element={
                <>
                  <Header siteContent={siteContent} />
                  <ProjectPage />
                </>
              } />
              
              {/* Admin routes */}
              <Route path="/admin/*" element={<Admin />} />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </Router>
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}

export default App;