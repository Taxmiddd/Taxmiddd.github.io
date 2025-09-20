import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogIn } from 'lucide-react';
import { AuthContext } from '../App';

const Header = ({ siteContent }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { auth, logout } = useContext(AuthContext);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Projects', href: '/projects' },
    { name: 'About', href: '/#about' },
    { name: 'Services', href: '/#services' },
  ];

  const isActive = (href) => {
    if (href === '/') return location.pathname === '/';
    if (href.startsWith('/#')) return location.pathname === '/' && location.hash === href.substring(1);
    return location.pathname.startsWith(href);
  };

  const handleNavClick = (href) => {
    setIsMenuOpen(false);
    
    // Handle anchor links on home page
    if (href.startsWith('/#') && location.pathname === '/') {
      const element = document.getElementById(href.substring(2));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="bg-background-primary shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className="flex items-center space-x-2 group"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">GD</span>
              </div>
              <span className="font-bold text-xl text-gray-900 group-hover:text-primary-600 transition-colors">
                Portfolio
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => handleNavClick(item.href)}
                className={`px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                  isActive(item.href)
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Menu & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* Auth Button */}
            {auth.isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  to="/admin"
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/admin"
                className="hidden md:flex items-center space-x-2 px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 border border-primary-600 hover:border-primary-700 rounded-md transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden animate-fade-in">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-100">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className={`block px-3 py-2 text-base font-medium transition-colors rounded-md ${
                    isActive(item.href)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Auth */}
              <div className="pt-2 border-t border-gray-100">
                {auth.isAuthenticated ? (
                  <>
                    <Link
                      to="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-2 px-3 py-2 text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-colors rounded-md"
                    >
                      <User className="w-4 h-4" />
                      <span>Admin Panel</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors rounded-md"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 text-base font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 transition-colors rounded-md"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;