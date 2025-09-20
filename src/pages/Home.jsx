import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Download, Mail, Phone, MapPin, Award, Users, Clock } from 'lucide-react';
import Hero from '../components/Hero';
import ProjectsGrid from '../components/ProjectsGrid';
import { AuthContext } from '../App';

const Home = ({ siteContent, updateContent }) => {
  const { auth } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);

  const stats = [
    { icon: Award, label: 'Projects Completed', value: '50+' },
    { icon: Users, label: 'Happy Clients', value: '30+' },
    { icon: Clock, label: 'Years Experience', value: '5+' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero 
        content={siteContent.hero} 
        isEditing={isEditing}
        onEdit={() => console.log('Edit hero')}
      />

      {/* Stats Section */}
      <section className="py-16 bg-background-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl mb-4">
                  <stat.icon className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <ProjectsGrid limit={6} />

      {/* About Section */}
      <section id="about" className="py-16 bg-background-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                {siteContent.about.title}
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {siteContent.about.content}
              </p>

              {/* Skills */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Expertise</h3>
                <div className="grid grid-cols-2 gap-4">
                  {siteContent.about.skills.map((skill, index) => (
                    <motion.div
                      key={skill}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm"
                    >
                      <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                      <span className="text-gray-700 font-medium">{skill}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors">
                  <Download className="w-5 h-5 mr-2" />
                  Download CV
                </button>
                <a
                  href="mailto:contact@designer.com"
                  className="inline-flex items-center px-6 py-3 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-lg border border-gray-200 transition-colors"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Get In Touch
                </a>
              </div>
            </motion.div>

            {/* Image/Visual */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative">
                <div className="w-full h-96 bg-gradient-to-br from-primary-100 via-secondary-100 to-primary-200 rounded-2xl flex items-center justify-center">
                  <div className="text-center text-primary-600">
                    <Award className="w-24 h-24 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-semibold">Professional Designer</p>
                    <p className="text-sm opacity-75">Creating Amazing Experiences</p>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary-600 rounded-2xl opacity-10 animate-pulse"></div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-secondary-600 rounded-full opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {siteContent.services.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional design services tailored to your needs
            </p>
          </motion.div>

          {siteContent.services.items && siteContent.services.items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {siteContent.services.items.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="text-primary-600 mb-4">
                    <Award className="w-12 h-12" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  {service.price && (
                    <div className="text-2xl font-bold text-primary-600">
                      {service.price}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center py-16"
            >
              <div className="text-gray-400">
                <Award className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">Services Coming Soon</h3>
                <p>Detailed service information will be available here.</p>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-background-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Let's Work <span className="text-primary-600">Together</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ready to bring your vision to life? Get in touch and let's create something amazing.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-xl mb-3">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                  <p className="text-gray-600 text-sm">contact@designer.com</p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-xl mb-3">
                    <Phone className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                  <p className="text-gray-600 text-sm">+1 (555) 123-4567</p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-xl mb-3">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
                  <p className="text-gray-600 text-sm">New York, NY</p>
                </div>
              </div>

              <div className="text-center">
                <a
                  href="mailto:contact@designer.com"
                  className="inline-flex items-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Start a Project
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Admin Edit Mode Toggle */}
      {auth.isAuthenticated && (auth.user?.role === 'admin' || auth.user?.role === 'owner') && (
        <div className="fixed bottom-4 right-4 z-40">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isEditing
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isEditing ? 'Exit Edit Mode' : 'Edit Mode'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;