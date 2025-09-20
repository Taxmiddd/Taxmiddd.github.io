import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ProjectsGrid from '../components/ProjectsGrid';
import ProjectModal from '../components/ProjectModal';

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openProjectModal = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeProjectModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300); // Wait for animation to complete
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <section className="py-16 bg-gradient-to-br from-background-primary via-background-secondary to-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              My <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Projects</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Explore my portfolio of creative projects, from brand identities to digital experiences. 
              Each project represents a unique challenge and innovative solution.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <ProjectsGrid 
        showHeader={false} 
        className="bg-background-primary"
        onProjectClick={openProjectModal}
      />

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={closeProjectModal}
      />

      {/* Call to Action */}
      <section className="py-16 bg-background-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Like What You See?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Let's collaborate on your next project and create something extraordinary together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:contact@designer.com"
                className="inline-flex items-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Start a Project
              </a>
              <a
                href="/#about"
                className="inline-flex items-center px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Learn More About Me
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Projects;