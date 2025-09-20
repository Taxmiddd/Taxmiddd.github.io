import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Download, Eye, Calendar, Tag, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectModal = ({ project, isOpen, onClose }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setCurrentMediaIndex(0);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!project) return null;

  const media = project.media || [];
  const currentMedia = media[currentMediaIndex];

  const nextMedia = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % media.length);
    setIsImageLoading(true);
  };

  const prevMedia = () => {
    setCurrentMediaIndex((prev) => (prev - 1 + media.length) % media.length);
    setIsImageLoading(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-6xl max-h-[90vh] w-full overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full transition-all"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
              {/* Media Section */}
              <div className="lg:w-2/3 relative bg-gray-100">
                {media.length > 0 ? (
                  <>
                    {/* Main Media Display */}
                    <div className="relative h-64 lg:h-full min-h-[400px] flex items-center justify-center">
                      {currentMedia?.mimetype?.startsWith('image/') ? (
                        <>
                          {isImageLoading && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="spinner"></div>
                            </div>
                          )}
                          <img
                            src={currentMedia.url || currentMedia.thumbnailPath}
                            alt={project.title}
                            className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${
                              isImageLoading ? 'opacity-0' : 'opacity-100'
                            }`}
                            onLoad={() => setIsImageLoading(false)}
                          />
                        </>
                      ) : currentMedia?.mimetype?.startsWith('video/') ? (
                        <video
                          src={currentMedia.url || currentMedia.thumbnailPath}
                          controls
                          className="max-w-full max-h-full"
                          onLoadStart={() => setIsImageLoading(false)}
                        >
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center text-gray-500">
                            <Eye className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p>Media preview not available</p>
                          </div>
                        </div>
                      )}

                      {/* Watermark notice */}
                      <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                        Preview Only
                      </div>
                    </div>

                    {/* Media Navigation */}
                    {media.length > 1 && (
                      <>
                        <button
                          onClick={prevMedia}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full transition-all"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          onClick={nextMedia}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full transition-all"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>

                        {/* Media indicators */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                          {media.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                setCurrentMediaIndex(index);
                                setIsImageLoading(true);
                              }}
                              className={`w-2 h-2 rounded-full transition-all ${
                                index === currentMediaIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="h-64 lg:h-full min-h-[400px] flex items-center justify-center bg-gradient-to-br from-primary-100 to-secondary-100">
                    <div className="text-center text-primary-400">
                      <Eye className="w-16 h-16 mx-auto mb-4" />
                      <p>No media available</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="lg:w-1/3 p-6 lg:p-8 overflow-y-auto">
                <div className="space-y-6">
                  {/* Header */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      {project.category && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                          <Tag className="w-4 h-4 mr-1" />
                          {project.category}
                        </span>
                      )}
                      {project.featured && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                          ⭐ Featured
                        </span>
                      )}
                    </div>

                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                      {project.title}
                    </h2>

                    {project.createdAt && (
                      <p className="flex items-center text-gray-500 text-sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDate(project.createdAt)}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Project</h3>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                      {project.description}
                    </p>
                  </div>

                  {/* Tags */}
                  {project.tags && project.tags.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Project Link */}
                  {project.projectUrl && (
                    <div>
                      <a
                        href={project.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-5 h-5 mr-2" />
                        View Live Project
                      </a>
                    </div>
                  )}

                  {/* Media Count */}
                  {media.length > 0 && (
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-500">
                        {media.length} media file{media.length !== 1 ? 's' : ''} • 
                        Showing {currentMediaIndex + 1} of {media.length}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        * Previews are watermarked. Original high-resolution files available upon request.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;