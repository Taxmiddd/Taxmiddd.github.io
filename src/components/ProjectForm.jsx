import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { X, Upload, Image, Video, Trash2, Save, Eye } from 'lucide-react';
import axios from 'axios';

const ProjectForm = ({ project, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    category: project?.category || '',
    tags: project?.tags?.join(', ') || '',
    featured: project?.featured || false,
    projectUrl: project?.projectUrl || '',
    media: project?.media || []
  });
  
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Handle file upload
  const onDrop = useCallback(async (acceptedFiles) => {
    setUploading(true);
    
    try {
      const formDataUpload = new FormData();
      acceptedFiles.forEach(file => {
        formDataUpload.append('files', file);
      });

      const response = await axios.post('/api/admin/upload', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const newFiles = response.data.files;
      setUploadedFiles([...uploadedFiles, ...newFiles]);
      setFormData({
        ...formData,
        media: [...formData.media, ...newFiles]
      });
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload files. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [formData, uploadedFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.webm', '.ogg']
    },
    multiple: true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const projectData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        thumbnailPath: formData.media[0]?.thumbnailPath || null
      };

      const response = project
        ? await axios.put(`/api/admin/projects/${project.id}`, projectData)
        : await axios.post('/api/admin/projects', projectData);

      onSave(response.data);
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save project. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const removeMediaFile = (index) => {
    const newMedia = formData.media.filter((_, i) => i !== index);
    setFormData({ ...formData, media: newMedia });
  };

  const getFileIcon = (mimetype) => {
    if (mimetype?.startsWith('image/')) return <Image className="w-6 h-6" />;
    if (mimetype?.startsWith('video/')) return <Video className="w-6 h-6" />;
    return <Upload className="w-6 h-6" />;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50" onClick={onClose} />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl relative"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {project ? 'Edit Project' : 'Add New Project'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter project title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., Web Design, Branding"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                placeholder="Describe your project..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  placeholder="design, branding, web"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project URL (optional)
                </label>
                <input
                  type="url"
                  value={formData.projectUrl}
                  onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            {/* Featured Toggle */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                Mark as featured project
              </label>
            </div>

            {/* Media Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Project Media
              </label>
              
              {/* Upload Area */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                {uploading ? (
                  <div className="flex items-center justify-center">
                    <div className="spinner mr-2"></div>
                    <span className="text-gray-600">Uploading...</span>
                  </div>
                ) : (
                  <>
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      {isDragActive ? 'Drop files here' : 'Upload project media'}
                    </p>
                    <p className="text-gray-600">
                      Drag and drop images/videos, or click to browse
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Supports: JPG, PNG, GIF, WebP, MP4, WebM
                    </p>
                  </>
                )}
              </div>

              {/* Uploaded Media Preview */}
              {formData.media.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Uploaded Media ({formData.media.length})
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {formData.media.map((file, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          {file.thumbnailPath ? (
                            <img
                              src={file.thumbnailPath}
                              alt={file.originalName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              {getFileIcon(file.mimetype)}
                            </div>
                          )}
                        </div>
                        
                        {/* File Actions */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => removeMediaFile(index)}
                            className="p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {/* File Info */}
                        <div className="mt-2">
                          <p className="text-xs text-gray-600 truncate">
                            {file.originalName}
                          </p>
                          {index === 0 && (
                            <p className="text-xs text-primary-600 font-medium">
                              Thumbnail
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              
              {project && (
                <a
                  href={`/projects/${project.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-2 text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </a>
              )}
              
              <button
                type="submit"
                disabled={saving || uploading}
                className="inline-flex items-center px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="spinner mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {project ? 'Update Project' : 'Create Project'}
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectForm;