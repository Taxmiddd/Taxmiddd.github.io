import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Tag, ExternalLink, ChevronLeft, ChevronRight, Eye, Download } from 'lucide-react';
import axios from 'axios';

const ProjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/projects/${id}`);
      setProject(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch project:', error);
      if (error.response?.status === 404) {
        setError('Project not found');
      } else {
        setError('Failed to load project');
      }
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const nextMedia = () => {
    if (project.media && project.media.length > 0) {
      setCurrentMediaIndex((prev) => (prev + 1) % project.media.length);
      setIsImageLoading(true);
    }
  };

  const prevMedia = () => {
    if (project.media && project.media.length > 0) {
      setCurrentMediaIndex((prev) => (prev - 1 + project.media.length) % project.media.length);
      setIsImageLoading(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The requested project could not be found.'}</p>
          <Link
            to="/projects"
            className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const media = project.media || [];
  const currentMedia = media[currentMediaIndex];

  return (
    <div className="min-h-screen pt-16">
      {/* Back Navigation */}
      <div className="bg-background-secondary border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/projects"
            className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Projects
          </Link>
        </div>
      </div>

      {/* Project Header */}
      <section className="py-12 bg-background-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-4 mb-6">
              {project.category && (
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                  <Tag className="w-4 h-4 mr-1" />
                  {project.category}
                </span>
              )}
              {project.featured && (
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  ⭐ Featured
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {project.title}
            </h1>

            <div className="flex items-center gap-6 text-gray-600 mb-6">
              {project.createdAt && (
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>{formatDate(project.createdAt)}</span>
                </div>
              )}
              {media.length > 0 && (
                <div className="flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  <span>{media.length} media file{media.length !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>

            <p className="text-xl text-gray-600 leading-relaxed">
              {project.description}
            </p>

            {project.projectUrl && (
              <div className="mt-6">
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
          </motion.div>
        </div>
      </section>

      {/* Media Gallery */}
      {media.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Main Media Display */}
              <div className="relative bg-gray-100 rounded-2xl overflow-hidden mb-8">
                <div className="relative aspect-video flex items-center justify-center min-h-[400px]">
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
                  <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg text-sm">
                    Preview Only • Original files available upon request
                  </div>

                  {/* Navigation arrows */}
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
                    </>
                  )}
                </div>
              </div>

              {/* Media Thumbnails */}
              {media.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-4">
                  {media.map((mediaItem, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentMediaIndex(index);
                        setIsImageLoading(true);
                      }}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentMediaIndex
                          ? 'border-primary-600 ring-2 ring-primary-200'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      {mediaItem.thumbnailPath ? (
                        <img
                          src={mediaItem.thumbnailPath}
                          alt={`Media ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <Eye className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Media Info */}
              <div className="text-center text-gray-500 text-sm mt-4">
                {media.length > 1 && (
                  <p className="mb-2">
                    Showing {currentMediaIndex + 1} of {media.length}
                  </p>
                )}
                <p>
                  * Previews are watermarked. High-resolution files are available for authorized users.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Project Details */}
      <section className="py-16 bg-background-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white text-gray-700 text-sm rounded-full border border-gray-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Additional project info can be added here */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h3>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {project.description}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Projects / Call to Action */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Interested in Working Together?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Let's create something amazing for your next project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:contact@designer.com"
                className="inline-flex items-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Start a Project
              </a>
              <Link
                to="/projects"
                className="inline-flex items-center px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                View More Projects
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ProjectPage;