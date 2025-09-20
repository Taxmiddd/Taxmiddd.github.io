import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = ({ content, onEdit, isEditing = false }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background-primary via-background-secondary to-background-tertiary overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500 rounded-full mix-blend-screen filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-500 rounded-full mix-blend-screen filter blur-xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-40 left-1/2 transform -translate-x-1/2 w-60 h-60 bg-primary-400 rounded-full mix-blend-screen filter blur-xl opacity-5 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          {/* Title */}
          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              {content.title}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            variants={itemVariants}
            className="text-lg sm:text-xl md:text-2xl text-secondary mb-8 font-light"
          >
            {content.subtitle}
          </motion.p>

          {/* Description */}
          <motion.p 
            variants={itemVariants}
            className="text-base sm:text-lg text-muted mb-12 max-w-2xl mx-auto leading-relaxed px-4"
          >
            {content.description}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              to="/projects"
              className="group inline-flex items-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Eye className="w-5 h-5 mr-2" />
              View My Work
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>

            <button className="group inline-flex items-center px-8 py-4 bg-background-secondary hover:bg-background-tertiary text-primary font-semibold rounded-xl shadow-lg hover:shadow-xl border border-border transition-all duration-300 transform hover:scale-105">
              <Download className="w-5 h-5 mr-2" />
              Download CV
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div 
            variants={itemVariants}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden sm:block"
          >
            <div className="flex flex-col items-center">
              <span className="text-sm text-muted mb-2">Scroll to explore</span>
              <div className="w-6 h-10 border-2 border-border rounded-full flex justify-center">
                <div className="w-1 h-3 bg-primary-400 rounded-full mt-2 animate-bounce"></div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Edit overlay for admin */}
      {isEditing && (
        <div className="absolute inset-0 bg-blue-500 bg-opacity-10 border-2 border-dashed border-blue-500 flex items-center justify-center">
          <button
            onClick={onEdit}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            Edit Hero Section
          </button>
        </div>
      )}
    </section>
  );
};

export default Hero;