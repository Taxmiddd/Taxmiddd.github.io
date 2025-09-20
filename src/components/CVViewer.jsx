import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Download, Eye, Trash2, FileText, AlertCircle } from 'lucide-react';
import axios from 'axios';

const CVViewer = ({ showMessage }) => {
  const [cvInfo, setCvInfo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCVInfo();
  }, []);

  const fetchCVInfo = async () => {
    try {
      const response = await axios.get('/api/admin/content');
      setCvInfo(response.data.cv);
    } catch (error) {
      console.error('Failed to fetch CV info:', error);
      showMessage('Failed to load CV information', true);
    } finally {
      setLoading(false);
    }
  };

  const handleCVUpload = async (file) => {
    if (!file) return;

    if (file.type !== 'application/pdf') {
      showMessage('Please upload a PDF file only', true);
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      showMessage('File size must be less than 10MB', true);
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('cv', file);

    try {
      const response = await axios.post('/api/admin/upload-cv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setCvInfo({
        filename: response.data.filename,
        originalName: response.data.originalName,
        uploadedAt: new Date().toISOString()
      });

      showMessage('CV uploaded successfully');
    } catch (error) {
      console.error('CV upload failed:', error);
      showMessage(error.response?.data?.error || 'Failed to upload CV', true);
    } finally {
      setUploading(false);
    }
  };

  const handleCVDelete = async () => {
    if (!window.confirm('Are you sure you want to delete the current CV?')) {
      return;
    }

    try {
      // Update content to remove CV info
      await axios.put('/api/admin/content', {
        cv: {
          filename: null,
          originalName: null,
          uploadedAt: null
        }
      });

      setCvInfo(null);
      showMessage('CV deleted successfully');
    } catch (error) {
      showMessage('Failed to delete CV', true);
    }
  };

  const generateDownloadUrl = async () => {
    if (!cvInfo?.filename) return;

    try {
      const response = await axios.post('/api/admin/generate-download-url', {
        filename: cvInfo.filename,
        type: 'cv'
      });

      // Open download URL in new tab
      window.open(response.data.downloadUrl, '_blank');
    } catch (error) {
      showMessage('Failed to generate download URL', true);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">CV Management</h3>
        {cvInfo && (
          <div className="flex space-x-2">
            <button
              onClick={generateDownloadUrl}
              className="inline-flex items-center px-4 py-2 text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </button>
            <button
              onClick={handleCVDelete}
              className="inline-flex items-center px-4 py-2 text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </button>
          </div>
        )}
      </div>

      {cvInfo ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 rounded-xl p-6"
        >
          {/* Current CV Info */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center">
                <FileText className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">
                  {cvInfo.originalName}
                </h4>
                <p className="text-sm text-gray-600">
                  Uploaded {formatDate(cvInfo.uploadedAt)}
                </p>
                <div className="flex items-center mt-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-green-700 font-medium">Active CV</span>
                </div>
              </div>
            </div>
          </div>

          {/* CV Preview/Actions */}
          <div className="border-t border-gray-200 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={generateDownloadUrl}
                className="flex items-center justify-center px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Eye className="w-5 h-5 mr-2 text-gray-600" />
                <span className="font-medium text-gray-900">View CV</span>
              </button>
              
              <label className="flex items-center justify-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg cursor-pointer transition-colors">
                <Upload className="w-5 h-5 mr-2" />
                <span className="font-medium">
                  {uploading ? 'Uploading...' : 'Replace CV'}
                </span>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleCVUpload(e.target.files[0])}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
          </div>

          {/* Info Note */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">CV Security</p>
                <p>
                  Your CV is stored securely and only accessible via signed download URLs. 
                  Public visitors can request access, but downloads require authentication.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          {/* Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-gray-400 transition-colors">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No CV Uploaded</h3>
            <p className="text-gray-600 mb-6">
              Upload your CV to make it available for download on your portfolio
            </p>
            
            <label className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg cursor-pointer transition-colors">
              {uploading ? (
                <>
                  <div className="spinner mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 mr-2" />
                  Upload CV (PDF)
                </>
              )}
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => handleCVUpload(e.target.files[0])}
                className="hidden"
                disabled={uploading}
              />
            </label>
            
            <p className="text-sm text-gray-500 mt-4">
              Maximum file size: 10MB • PDF format only
            </p>
          </div>

          {/* Benefits */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Professional Display</h4>
              <p className="text-sm text-gray-600">Embedded PDF viewer for easy browsing</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Download className="w-6 h-6" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Secure Downloads</h4>
              <p className="text-sm text-gray-600">Controlled access via signed URLs</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Eye className="w-6 h-6" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Easy Management</h4>
              <p className="text-sm text-gray-600">Update anytime from admin panel</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CVViewer;