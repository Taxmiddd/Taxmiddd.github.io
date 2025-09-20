import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Palette, Save, RotateCcw, Eye, Monitor, Smartphone } from 'lucide-react';
import { ThemeContext } from '../App';
import axios from 'axios';

const ThemeCustomizer = () => {
  const { theme, updateTheme } = useContext(ThemeContext);
  const [localTheme, setLocalTheme] = useState(theme);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [showPreview, setShowPreview] = useState(false);

  // Sync with context theme changes
  useEffect(() => {
    setLocalTheme(theme);
  }, [theme]);

  // Predefined color palettes
  const colorPalettes = [
    {
      name: 'Ocean Blue',
      primary: '#3B82F6',
      secondary: '#8B5CF6',
      bgPrimary: '#FFFFFF',
      bgSecondary: '#F8FAFC'
    },
    {
      name: 'Forest Green',
      primary: '#10B981',
      secondary: '#34D399',
      bgPrimary: '#FFFFFF',
      bgSecondary: '#F0FDF4'
    },
    {
      name: 'Sunset Orange',
      primary: '#F59E0B',
      secondary: '#EF4444',
      bgPrimary: '#FFFFFF',
      bgSecondary: '#FFFBEB'
    },
    {
      name: 'Purple Dream',
      primary: '#8B5CF6',
      secondary: '#EC4899',
      bgPrimary: '#FFFFFF',
      bgSecondary: '#FAF5FF'
    },
    {
      name: 'Dark Mode',
      primary: '#60A5FA',
      secondary: '#A78BFA',
      bgPrimary: '#1F2937',
      bgSecondary: '#111827'
    },
    {
      name: 'Monochrome',
      primary: '#374151',
      secondary: '#6B7280',
      bgPrimary: '#FFFFFF',
      bgSecondary: '#F9FAFB'
    }
  ];

  // Font options
  const fontOptions = [
    { name: 'Inter (Default)', value: 'Inter, sans-serif' },
    { name: 'Poppins', value: 'Poppins, sans-serif' },
    { name: 'Roboto', value: 'Roboto, sans-serif' },
    { name: 'Open Sans', value: 'Open Sans, sans-serif' },
    { name: 'Lato', value: 'Lato, sans-serif' },
    { name: 'Montserrat', value: 'Montserrat, sans-serif' },
    { name: 'Playfair Display', value: 'Playfair Display, serif' },
    { name: 'Merriweather', value: 'Merriweather, serif' }
  ];

  const handleColorChange = (colorType, value) => {
    setLocalTheme({
      ...localTheme,
      [colorType]: value
    });
  };

  const applyPalette = (palette) => {
    setLocalTheme({
      ...localTheme,
      primaryColor: palette.primary,
      secondaryColor: palette.secondary,
      backgroundPrimary: palette.bgPrimary,
      backgroundSecondary: palette.bgSecondary
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateTheme(localTheme);
      // Show success message or handle success
    } catch (error) {
      console.error('Failed to save theme:', error);
      // Show error message
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    const defaultTheme = {
      primaryColor: '#3B82F6',
      secondaryColor: '#8B5CF6',
      backgroundPrimary: '#FFFFFF',
      backgroundSecondary: '#F8FAFC',
      fontPrimary: 'Inter, sans-serif',
      fontSecondary: 'Inter, sans-serif'
    };
    setLocalTheme(defaultTheme);
  };

  const openPreview = () => {
    // Apply temporary theme for preview
    updateTheme(localTheme);
    setShowPreview(true);
    // Open homepage in new tab
    window.open('/', '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Theme Customizer</h1>
          <p className="text-gray-600">Customize your portfolio's appearance and branding</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={openPreview}
            className="inline-flex items-center px-4 py-2 text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </button>
          
          <button
            onClick={handleReset}
            className="inline-flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </button>
          
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? (
              <div className="spinner mr-2"></div>
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Theme Controls */}
        <div className="lg:col-span-2 space-y-8">
          {/* Color Palettes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Palette className="w-5 h-5 mr-2" />
              Quick Color Palettes
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {colorPalettes.map((palette, index) => (
                <button
                  key={index}
                  onClick={() => applyPalette(palette)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors group"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: palette.primary }}
                    />
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: palette.secondary }}
                    />
                    <div
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: palette.bgPrimary }}
                    />
                  </div>
                  <p className="text-sm font-medium text-gray-900 group-hover:text-primary-600">
                    {palette.name}
                  </p>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Custom Colors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Custom Colors</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Primary Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={localTheme.primaryColor}
                    onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                    className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={localTheme.primaryColor}
                    onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Secondary Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={localTheme.secondaryColor}
                    onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                    className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={localTheme.secondaryColor}
                    onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Background Primary
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={localTheme.backgroundPrimary}
                    onChange={(e) => handleColorChange('backgroundPrimary', e.target.value)}
                    className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={localTheme.backgroundPrimary}
                    onChange={(e) => handleColorChange('backgroundPrimary', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Background Secondary
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={localTheme.backgroundSecondary}
                    onChange={(e) => handleColorChange('backgroundSecondary', e.target.value)}
                    className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={localTheme.backgroundSecondary}
                    onChange={(e) => handleColorChange('backgroundSecondary', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Typography */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Typography</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Primary Font
                </label>
                <select
                  value={localTheme.fontPrimary}
                  onChange={(e) => handleColorChange('fontPrimary', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                >
                  {fontOptions.map((font) => (
                    <option key={font.value} value={font.value}>
                      {font.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Secondary Font
                </label>
                <select
                  value={localTheme.fontSecondary}
                  onChange={(e) => handleColorChange('fontSecondary', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                >
                  {fontOptions.map((font) => (
                    <option key={font.value} value={font.value}>
                      {font.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Font Preview */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: localTheme.fontPrimary }}>
                Primary Font Preview
              </h3>
              <p className="text-gray-600" style={{ fontFamily: localTheme.fontSecondary }}>
                This is how your secondary font will look. The quick brown fox jumps over the lazy dog.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Live Preview</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPreviewMode('desktop')}
                  className={`p-2 rounded-lg transition-colors ${
                    previewMode === 'desktop'
                      ? 'bg-primary-100 text-primary-600'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewMode('mobile')}
                  className={`p-2 rounded-lg transition-colors ${
                    previewMode === 'mobile'
                      ? 'bg-primary-100 text-primary-600'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Preview Frame */}
            <div className={`border border-gray-200 rounded-lg overflow-hidden ${
              previewMode === 'mobile' ? 'max-w-sm mx-auto' : ''
            }`}>
              <div 
                className="p-4"
                style={{ 
                  backgroundColor: localTheme.backgroundPrimary,
                  fontFamily: localTheme.fontPrimary
                }}
              >
                {/* Mini Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: localTheme.primaryColor }}
                    >
                      GD
                    </div>
                    <span className="font-bold text-sm">Portfolio</span>
                  </div>
                </div>

                {/* Mini Hero */}
                <div 
                  className="p-4 rounded-lg mb-4"
                  style={{ backgroundColor: localTheme.backgroundSecondary }}
                >
                  <h3 
                    className="font-bold text-lg mb-2"
                    style={{ 
                      background: `linear-gradient(to right, ${localTheme.primaryColor}, ${localTheme.secondaryColor})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    Creative Designer
                  </h3>
                  <p className="text-sm text-gray-600 mb-3" style={{ fontFamily: localTheme.fontSecondary }}>
                    Bringing ideas to life through innovative digital design
                  </p>
                  <button
                    className="px-4 py-2 text-white text-sm font-semibold rounded-lg"
                    style={{ backgroundColor: localTheme.primaryColor }}
                  >
                    View Work
                  </button>
                </div>

                {/* Mini Project Card */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="h-20 bg-gradient-to-br from-gray-100 to-gray-200"></div>
                  <div className="p-3">
                    <h4 className="font-semibold text-sm mb-1">Sample Project</h4>
                    <p className="text-xs text-gray-600 mb-2" style={{ fontFamily: localTheme.fontSecondary }}>
                      Creative design solution
                    </p>
                    <span 
                      className="text-xs px-2 py-1 rounded-full"
                      style={{ 
                        backgroundColor: `${localTheme.primaryColor}20`,
                        color: localTheme.primaryColor 
                      }}
                    >
                      Featured
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Color Swatches */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Current Colors</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: localTheme.primaryColor }}
                  />
                  <span className="text-xs text-gray-600">Primary</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: localTheme.secondaryColor }}
                  />
                  <span className="text-xs text-gray-600">Secondary</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: localTheme.backgroundPrimary }}
                  />
                  <span className="text-xs text-gray-600">BG Primary</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: localTheme.backgroundSecondary }}
                  />
                  <span className="text-xs text-gray-600">BG Secondary</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ThemeCustomizer;