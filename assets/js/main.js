/**
 * =====================================================
 * PORTFOLIO MAIN JAVASCRIPT
 * =====================================================
 * 
 * CUSTOMIZATION GUIDE:
 * 1. All content is loaded from config.json - edit that file to change content
 * 2. Theme colors are controlled via CSS variables updated by the theme switcher
 * 3. To add new sections, update the sectionsOrder in config.json
 * 4. Form endpoint should be replaced with your Formspree or similar service URL
 * 
 * FEATURES:
 * - Dynamic content loading from config.json
 * - Theme switching with localStorage persistence
 * - Responsive navigation with mobile hamburger menu
 * - Smooth scrolling and active section highlighting
 * - Project filtering and lightbox gallery
 * - Contact form with validation
 * - Lazy loading for images
 * - Accessibility features (keyboard navigation, ARIA labels)
 * - Progressive enhancement (works without JS)
 * 
 * =====================================================
 */

// Global state
let config = {};
let currentLightboxIndex = 0;
let lightboxImages = [];

// DOM elements
const elements = {
    loadingIndicator: null,
    themeToggle: null,
    navToggle: null,
    navMenu: null,
    backToTop: null,
    contactForm: null,
    lightbox: null,
    // Will be populated on DOM load
};

/**
 * =====================================================
 * INITIALIZATION
 * =====================================================
 */

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

async function init() {
    try {
        // Cache DOM elements
        cacheElements();
        
        // Load configuration
        await loadConfig();
        
        // Apply saved theme
        initializeTheme();
        
        // Render all sections
        renderSite();
        
        // Initialize interactive features
        initializeNavigation();
        initializeThemeToggle();
        initializeScrollFeatures();
        initializeLightbox();
        initializeContactForm();
        initializeLazyLoading();
        
        // Hide loading indicator
        hideLoadingIndicator();
        
        // Initialize scroll animations
        initializeScrollAnimations();
        
        console.log('Portfolio initialized successfully');
        
    } catch (error) {
        console.error('Failed to initialize portfolio:', error);
        showError('Failed to load portfolio. Please refresh the page.');
    }
}

function cacheElements() {
    elements.loadingIndicator = document.getElementById('loading-indicator');
    elements.themeToggle = document.getElementById('theme-toggle');
    elements.navToggle = document.getElementById('nav-toggle');
    elements.navMenu = document.getElementById('nav-menu');
    elements.backToTop = document.getElementById('back-to-top');
    elements.contactForm = document.getElementById('contact-form');
    elements.lightbox = document.getElementById('lightbox');
}

/**
 * =====================================================
 * CONFIG LOADING
 * =====================================================
 */

async function loadConfig() {
    try {
        const response = await fetch('./config.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        config = await response.json();
        
        // Update document metadata
        updateMetadata();
        
    } catch (error) {
        console.error('Error loading config:', error);
        throw error;
    }
}

function updateMetadata() {
    // Update title and meta tags
    document.title = config.siteMeta.siteTitle;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.content = config.siteMeta.description;
    }
    
    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogImage = document.querySelector('meta[property="og:image"]');
    
    if (ogTitle) ogTitle.content = config.siteMeta.siteTitle;
    if (ogDescription) ogDescription.content = config.siteMeta.description;
    if (ogImage && config.settings.openGraphImage) {
        ogImage.content = window.location.origin + '/' + config.settings.openGraphImage;
    }
    
    // Update favicon if specified
    if (config.settings.favicon) {
        const favicon = document.querySelector('link[rel="icon"]');
        if (favicon) {
            favicon.href = config.settings.favicon;
        }
    }
}

/**
 * =====================================================
 * THEME SYSTEM
 * =====================================================
 */

function initializeTheme() {
    // Load saved theme or use default
    const savedTheme = localStorage.getItem('portfolio-theme') || config.theme.activeTheme || 'default';
    applyTheme(savedTheme);
    updateThemeToggleIcon(savedTheme);
}

function initializeThemeToggle() {
    if (!elements.themeToggle) return;
    
    elements.themeToggle.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    const currentTheme = localStorage.getItem('portfolio-theme') || config.theme.activeTheme || 'default';
    const themeNames = Object.keys(config.theme.themes);
    const currentIndex = themeNames.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themeNames.length;
    const nextTheme = themeNames[nextIndex];
    
    applyTheme(nextTheme);
    localStorage.setItem('portfolio-theme', nextTheme);
    updateThemeToggleIcon(nextTheme);
}

function applyTheme(themeName) {
    const theme = config.theme.themes[themeName];
    if (!theme) {
        console.warn(`Theme "${themeName}" not found`);
        return;
    }
    
    const root = document.documentElement;
    
    // Apply color variables
    Object.entries(theme).forEach(([key, value]) => {
        if (key !== 'name') {
            root.style.setProperty(`--${key}`, value);
        }
    });
    
    // Apply font variables
    if (config.theme.fontHeading) {
        root.style.setProperty('--font-heading', `'${config.theme.fontHeading}', serif`);
    }
    if (config.theme.fontBody) {
        root.style.setProperty('--font-body', `'${config.theme.fontBody}', sans-serif`);
    }
    
    // Apply other theme properties
    if (config.theme.borderRadius) {
        root.style.setProperty('--border-radius', config.theme.borderRadius);
    }
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        metaThemeColor.content = theme.primary || theme.background;
    }
}

function updateThemeToggleIcon(themeName) {
    const themeIcon = document.querySelector('.theme-icon');
    if (!themeIcon) return;
    
    const icons = {
        'default': '🌙',
        'midnight': '☀️',
        'warm': '🌙'
    };
    
    themeIcon.textContent = icons[themeName] || '🎨';
}

/**
 * =====================================================
 * SITE RENDERING
 * =====================================================
 */

function renderSite() {
    // Render navigation
    renderNavigation();
    
    // Render sections in order
    config.layoutSettings.sectionsOrder.forEach(sectionName => {
        if (config.layoutSettings.showSections[sectionName]) {
            renderSection(sectionName);
        }
    });
    
    // Update current year in footer
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
}

function renderNavigation() {
    // Update nav brand
    const navLogo = document.querySelector('.nav-logo');
    if (navLogo) {
        navLogo.textContent = config.siteMeta.author;
    }
    
    // Update nav links based on visible sections
    const navList = document.querySelector('.nav-list');
    if (navList) {
        navList.innerHTML = '';
        
        config.layoutSettings.sectionsOrder.forEach(sectionName => {
            if (config.layoutSettings.showSections[sectionName] && sectionName !== 'footer') {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = `#${sectionName}`;
                a.className = 'nav-link';
                a.textContent = capitalizeFirst(sectionName.replace(/([A-Z])/g, ' $1'));
                li.appendChild(a);
                navList.appendChild(li);
            }
        });
    }
}

function renderSection(sectionName) {
    switch (sectionName) {
        case 'hero':
            renderHeroSection();
            break;
        case 'about':
            renderAboutSection();
            break;
        case 'projects':
            renderProjectsSection();
            break;
        case 'currentProject':
            renderCurrentProjectSection();
            break;
        case 'media':
            renderMediaSection();
            break;
        case 'services':
            renderServicesSection();
            break;
        case 'pricing':
            renderPricingSection();
            break;
        case 'contact':
            renderContactSection();
            break;
        case 'footer':
            renderFooterSection();
            break;
    }
}

function renderHeroSection() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroBackground = document.querySelector('.hero-background');
    const heroCTA = document.querySelector('.hero-cta');
    
    if (heroTitle) heroTitle.textContent = config.hero.title;
    if (heroSubtitle) heroSubtitle.textContent = config.hero.subtitle;
    
    // Set background
    if (heroBackground) {
        if (config.hero.backgroundType === 'image' && config.hero.backgroundImage) {
            heroBackground.style.backgroundImage = `url(${config.hero.backgroundImage})`;
            heroBackground.style.backgroundSize = 'cover';
            heroBackground.style.backgroundPosition = 'center';
        } else if (config.hero.backgroundGradient) {
            heroBackground.style.background = config.hero.backgroundGradient;
        }
    }
    
    // Render CTA buttons
    if (heroCTA && config.hero.cta) {
        heroCTA.innerHTML = '';
        config.hero.cta.forEach(button => {
            const a = document.createElement('a');
            a.href = button.link;
            a.className = `btn btn-${button.style || 'primary'}`;
            a.textContent = button.text;
            heroCTA.appendChild(a);
        });
    }
}

function renderAboutSection() {
    const aboutBio = document.querySelector('.about-bio');
    const skillsGrid = document.getElementById('skills-grid');
    
    // Render bio
    if (aboutBio && config.about.bio) {
        aboutBio.innerHTML = config.about.bio.split('\\n\\n').map(p => `<p>${p}</p>`).join('');
    }
    
    // Render skills
    if (skillsGrid && config.about.skills) {
        skillsGrid.innerHTML = '';
        config.about.skills.forEach(skill => {
            const skillItem = document.createElement('div');
            skillItem.className = 'skill-item';
            skillItem.innerHTML = `
                <div class="skill-header">
                    <span class="skill-name">${skill.name}</span>
                    <span class="skill-level">${skill.level}%</span>
                </div>
                <div class="skill-bar">
                    <div class="skill-progress" style="width: ${skill.level}%"></div>
                </div>
            `;
            skillsGrid.appendChild(skillItem);
        });
    }
    
    // Update CV download link
    const cvLink = document.querySelector('a[download]');
    if (cvLink && config.about.cvFile) {
        cvLink.href = config.about.cvFile;
        if (!config.about.downloadCV) {
            cvLink.style.display = 'none';
        }
    }
}

function renderProjectsSection() {
    const projectsGrid = document.getElementById('projects-grid');
    const projectsFilter = document.getElementById('projects-filter');
    
    if (!projectsGrid || !config.projects) return;
    
    // Render project filters
    if (projectsFilter) {
        const allTags = [...new Set(config.projects.flatMap(p => p.tags || []))];
        projectsFilter.innerHTML = `
            <button class="filter-btn active" data-filter="all">All</button>
            ${allTags.map(tag => `<button class="filter-btn" data-filter="${tag}">${tag}</button>`).join('')}
        `;
        
        // Add filter functionality
        projectsFilter.addEventListener('click', handleProjectFilter);
    }
    
    // Render projects
    projectsGrid.innerHTML = '';
    config.projects.forEach(project => {
        const projectCard = createProjectCard(project);
        projectsGrid.appendChild(projectCard);
    });
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.dataset.tags = (project.tags || []).join(',');
    
    const imageUrl = project.images && project.images[0] ? project.images[0] : 'assets/images/placeholder-project.webp';
    
    card.innerHTML = `
        <img src="${imageUrl}" alt="${project.title}" class="project-image" loading="lazy">
        <div class="project-content">
            <h3 class="project-title">${project.title}</h3>
            <p class="project-summary">${project.summary}</p>
            <div class="project-tags">
                ${(project.tags || []).map(tag => `<span class="project-tag">${tag}</span>`).join('')}
            </div>
            <div class="project-links">
                ${project.repo ? `<a href="${project.repo}" class="project-link" target="_blank" rel="noopener">
                    <span>Code</span>
                </a>` : ''}
                ${project.live ? `<a href="${project.live}" class="project-link" target="_blank" rel="noopener">
                    <span>Live Demo</span>
                </a>` : ''}
            </div>
        </div>
    `;
    
    return card;
}

function handleProjectFilter(e) {
    if (!e.target.classList.contains('filter-btn')) return;
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    const filter = e.target.dataset.filter;
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        const cardTags = card.dataset.tags.split(',');
        const shouldShow = filter === 'all' || cardTags.includes(filter);
        
        if (shouldShow) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.5s ease-out';
        } else {
            card.style.display = 'none';
        }
    });
}

function renderCurrentProjectSection() {
    const currentProjectContent = document.getElementById('current-project-content');
    if (!currentProjectContent || !config.currentProject) return;
    
    const project = config.currentProject;
    const imageUrl = project.images && project.images[0] ? project.images[0] : 'assets/images/placeholder-current.webp';
    
    currentProjectContent.innerHTML = `
        <div class="current-project-info">
            <h3 class="current-project-title">${project.title}</h3>
            <div class="current-project-status">
                <div class="status-indicator"></div>
                <span>${project.status}</span>
            </div>
            <p class="current-project-summary">${project.summary}</p>
            <div class="current-project-description">
                ${project.description.split('\\n\\n').map(p => `<p>${p}</p>`).join('')}
            </div>
            ${project.completion ? `
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${project.completion}%"></div>
                </div>
                <p class="text-muted">Progress: ${project.completion}%</p>
            ` : ''}
            <div class="project-links">
                ${project.repo ? `<a href="${project.repo}" class="btn btn-outline" target="_blank" rel="noopener">View Code</a>` : ''}
                ${project.demo ? `<a href="${project.demo}" class="btn btn-primary" target="_blank" rel="noopener">Live Demo</a>` : ''}
            </div>
        </div>
        <div class="current-project-media">
            <img src="${imageUrl}" alt="${project.title}" class="project-image" loading="lazy">
        </div>
    `;
}

function renderMediaSection() {
    const mediaGrid = document.getElementById('media-grid');
    if (!mediaGrid || !config.media || !config.media.gallery) return;
    
    mediaGrid.innerHTML = '';
    config.media.gallery.forEach((item, index) => {
        const mediaItem = document.createElement('div');
        mediaItem.className = 'media-item';
        mediaItem.dataset.lightboxIndex = index;
        
        const imageUrl = item.src || 'assets/images/placeholder-media.webp';
        
        mediaItem.innerHTML = `
            <img src="${imageUrl}" alt="${item.alt}" class="media-image" loading="lazy">
            <div class="media-overlay">
                <div class="media-caption">${item.caption || ''}</div>
            </div>
        `;
        
        mediaItem.addEventListener('click', () => openLightbox(index));
        mediaGrid.appendChild(mediaItem);
    });
    
    // Store images for lightbox
    lightboxImages = config.media.gallery;
}

function renderServicesSection() {
    const servicesGrid = document.getElementById('services-grid');
    if (!servicesGrid || !config.services) return;
    
    servicesGrid.innerHTML = '';
    config.services.forEach(service => {
        const serviceCard = document.createElement('div');
        serviceCard.className = 'service-card';
        
        serviceCard.innerHTML = `
            <div class="service-icon">🎨</div>
            <h3 class="service-title">${service.name}</h3>
            <p class="service-description">${service.description}</p>
            ${service.features ? `
                <ul class="service-features">
                    ${service.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            ` : ''}
            ${service.price ? `<div class="service-price">${service.price}</div>` : ''}
            ${service.notes ? `<p class="text-muted">${service.notes}</p>` : ''}
        `;
        
        servicesGrid.appendChild(serviceCard);
    });
}

function renderPricingSection() {
    const pricingGrid = document.getElementById('pricing-grid');
    if (!pricingGrid || !config.pricing) return;
    
    pricingGrid.innerHTML = '';
    config.pricing.forEach(plan => {
        const pricingCard = document.createElement('div');
        pricingCard.className = `pricing-card ${plan.popular ? 'popular' : ''}`;
        
        pricingCard.innerHTML = `
            <h3 class="pricing-plan">${plan.plan}</h3>
            <p class="pricing-description">${plan.description}</p>
            <div class="pricing-price">${plan.price || 'Contact for pricing'}</div>
            ${plan.features ? `
                <ul class="pricing-features">
                    ${plan.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            ` : ''}
            ${plan.duration ? `<p class="text-muted">Timeline: ${plan.duration}</p>` : ''}
            <a href="#contact" class="btn btn-primary">Get Started</a>
        `;
        
        pricingGrid.appendChild(pricingCard);
    });
}

function renderContactSection() {
    // Update contact information
    const contactEmail = document.querySelector('.contact-link');
    const availabilityStatus = document.querySelector('.availability-status');
    const responseTime = document.querySelector('.contact-content p');
    
    if (contactEmail && config.contact.email) {
        contactEmail.href = `mailto:${config.contact.email}`;
        contactEmail.textContent = config.contact.email;
    }
    
    if (availabilityStatus && config.contact.availability) {
        availabilityStatus.textContent = config.contact.availability;
    }
    
    // Update form endpoint
    if (elements.contactForm && config.contact.formEndpoint) {
        elements.contactForm.action = config.contact.formEndpoint;
    }
    
    // Hide form if disabled
    if (!config.contact.enableForm) {
        const formWrapper = document.querySelector('.contact-form-wrapper');
        if (formWrapper) formWrapper.style.display = 'none';
    }
}

function renderFooterSection() {
    // Update footer info
    const footerTitle = document.querySelector('.footer-title');
    const footerTagline = document.querySelector('.footer-tagline');
    const socialLinks = document.getElementById('social-links');
    
    if (footerTitle) footerTitle.textContent = config.siteMeta.author;
    if (footerTagline) footerTagline.textContent = config.siteMeta.tagline;
    
    // Render social links
    if (socialLinks && config.siteMeta.social) {
        socialLinks.innerHTML = '';
        Object.entries(config.siteMeta.social).forEach(([platform, url]) => {
            if (url) {
                const socialLink = document.createElement('a');
                socialLink.href = url;
                socialLink.className = 'social-link';
                socialLink.target = '_blank';
                socialLink.rel = 'noopener';
                socialLink.setAttribute('aria-label', `Follow on ${capitalizeFirst(platform)}`);
                socialLink.innerHTML = getSocialIcon(platform);
                socialLinks.appendChild(socialLink);
            }
        });
    }
}

/**
 * =====================================================
 * NAVIGATION
 * =====================================================
 */

function initializeNavigation() {
    // Mobile menu toggle
    if (elements.navToggle && elements.navMenu) {
        elements.navToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Smooth scrolling for nav links
    document.addEventListener('click', handleSmoothScroll);
    
    // Active section highlighting
    window.addEventListener('scroll', updateActiveNavLink);
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', closeMobileMenuOnOutsideClick);
}

function toggleMobileMenu() {
    if (!elements.navMenu || !elements.navToggle) return;
    
    const isActive = elements.navMenu.classList.contains('active');
    
    if (isActive) {
        elements.navMenu.classList.remove('active');
        elements.navToggle.classList.remove('active');
        elements.navToggle.setAttribute('aria-expanded', 'false');
    } else {
        elements.navMenu.classList.add('active');
        elements.navToggle.classList.add('active');
        elements.navToggle.setAttribute('aria-expanded', 'true');
    }
}

function closeMobileMenuOnOutsideClick(e) {
    if (!elements.navMenu || !elements.navToggle) return;
    
    const isMenuActive = elements.navMenu.classList.contains('active');
    const clickedInsideNav = elements.navMenu.contains(e.target) || elements.navToggle.contains(e.target);
    
    if (isMenuActive && !clickedInsideNav) {
        toggleMobileMenu();
    }
}

function handleSmoothScroll(e) {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Close mobile menu if open
        if (elements.navMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    }
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('.section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const headerHeight = document.querySelector('.header').offsetHeight;
    const scrollPosition = window.scrollY + headerHeight + 100;
    
    let activeSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            activeSection = section.id;
        }
    });
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${activeSection}`) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * =====================================================
 * SCROLL FEATURES
 * =====================================================
 */

function initializeScrollFeatures() {
    // Back to top button
    if (elements.backToTop) {
        elements.backToTop.addEventListener('click', scrollToTop);
        window.addEventListener('scroll', toggleBackToTopVisibility);
    }
    
    // Header background on scroll
    window.addEventListener('scroll', updateHeaderBackground);
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function toggleBackToTopVisibility() {
    if (!elements.backToTop) return;
    
    if (window.scrollY > 500) {
        elements.backToTop.classList.add('visible');
    } else {
        elements.backToTop.classList.remove('visible');
    }
}

function updateHeaderBackground() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    }
}

/**
 * =====================================================
 * SCROLL ANIMATIONS
 * =====================================================
 */

function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animate skill bars
                if (entry.target.classList.contains('skill-item')) {
                    const progressBar = entry.target.querySelector('.skill-progress');
                    if (progressBar) {
                        const width = progressBar.style.width;
                        progressBar.style.width = '0%';
                        setTimeout(() => {
                            progressBar.style.width = width;
                        }, 200);
                    }
                }
                
                // Animate progress bars
                if (entry.target.classList.contains('progress-fill')) {
                    const width = entry.target.style.width;
                    entry.target.style.width = '0%';
                    setTimeout(() => {
                        entry.target.style.width = width;
                    }, 500);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animations
    const animatedElements = document.querySelectorAll('.skill-item, .project-card, .service-card, .pricing-card, .progress-fill');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

/**
 * =====================================================
 * LIGHTBOX
 * =====================================================
 */

function initializeLightbox() {
    if (!elements.lightbox) return;
    
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxOverlay = document.getElementById('lightbox-overlay');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    if (lightboxNext) lightboxNext.addEventListener('click', () => navigateLightbox(1));
    
    // Keyboard navigation
    document.addEventListener('keydown', handleLightboxKeyboard);
}

function openLightbox(index) {
    if (!elements.lightbox || !lightboxImages.length) return;
    
    currentLightboxIndex = index;
    updateLightboxContent();
    
    elements.lightbox.classList.add('active');
    elements.lightbox.setAttribute('aria-hidden', 'false');
    
    // Focus management
    const lightboxClose = document.getElementById('lightbox-close');
    if (lightboxClose) lightboxClose.focus();
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    if (!elements.lightbox) return;
    
    elements.lightbox.classList.remove('active');
    elements.lightbox.setAttribute('aria-hidden', 'true');
    
    // Restore body scroll
    document.body.style.overflow = '';
}

function navigateLightbox(direction) {
    if (!lightboxImages.length) return;
    
    currentLightboxIndex += direction;
    
    if (currentLightboxIndex < 0) {
        currentLightboxIndex = lightboxImages.length - 1;
    } else if (currentLightboxIndex >= lightboxImages.length) {
        currentLightboxIndex = 0;
    }
    
    updateLightboxContent();
}

function updateLightboxContent() {
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    
    if (!lightboxImage || !lightboxImages[currentLightboxIndex]) return;
    
    const currentImage = lightboxImages[currentLightboxIndex];
    
    lightboxImage.src = currentImage.src;
    lightboxImage.alt = currentImage.alt;
    
    if (lightboxCaption) {
        lightboxCaption.textContent = currentImage.caption || currentImage.alt || '';
        lightboxCaption.style.display = lightboxCaption.textContent ? 'block' : 'none';
    }
}

function handleLightboxKeyboard(e) {
    if (!elements.lightbox.classList.contains('active')) return;
    
    switch (e.key) {
        case 'Escape':
            closeLightbox();
            break;
        case 'ArrowLeft':
            navigateLightbox(-1);
            break;
        case 'ArrowRight':
            navigateLightbox(1);
            break;
    }
}

/**
 * =====================================================
 * CONTACT FORM
 * =====================================================
 */

function initializeContactForm() {
    if (!elements.contactForm) return;
    
    elements.contactForm.addEventListener('submit', handleContactFormSubmit);
    
    // Real-time validation
    const inputs = elements.contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

async function handleContactFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(elements.contactForm);
    const submitButton = elements.contactForm.querySelector('.form-submit');
    const buttonText = submitButton.querySelector('.btn-text');
    const buttonLoading = submitButton.querySelector('.btn-loading');
    
    // Validate form
    if (!validateForm()) {
        return;
    }
    
    // Show loading state
    submitButton.disabled = true;
    buttonText.style.display = 'none';
    buttonLoading.style.display = 'inline';
    
    try {
        const response = await fetch(elements.contactForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            showSuccess('Message sent successfully! I\'ll get back to you soon.');
            elements.contactForm.reset();
        } else {
            throw new Error('Network response was not ok');
        }
        
    } catch (error) {
        console.error('Form submission error:', error);
        showError('Failed to send message. Please try again or contact me directly.');
    } finally {
        // Reset button state
        submitButton.disabled = false;
        buttonText.style.display = 'inline';
        buttonLoading.style.display = 'none';
    }
}

function validateForm() {
    const requiredFields = elements.contactForm.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.name;
    const errorElement = document.getElementById(`${fieldName}-error`);
    
    let errorMessage = '';
    
    if (field.hasAttribute('required') && !value) {
        errorMessage = `${capitalizeFirst(fieldName)} is required`;
    } else if (field.type === 'email' && value && !isValidEmail(value)) {
        errorMessage = 'Please enter a valid email address';
    }
    
    if (errorElement) {
        errorElement.textContent = errorMessage;
    }
    
    field.classList.toggle('error', !!errorMessage);
    
    return !errorMessage;
}

function clearFieldError(e) {
    const field = e.target;
    const errorElement = document.getElementById(`${field.name}-error`);
    
    if (errorElement) {
        errorElement.textContent = '';
    }
    field.classList.remove('error');
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * =====================================================
 * LAZY LOADING
 * =====================================================
 */

function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Handle srcset if available
                    if (img.dataset.srcset) {
                        img.srcset = img.dataset.srcset;
                    }
                    
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    
                    img.classList.remove('lazy');
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

/**
 * =====================================================
 * UTILITY FUNCTIONS
 * =====================================================
 */

function hideLoadingIndicator() {
    if (elements.loadingIndicator) {
        elements.loadingIndicator.style.opacity = '0';
        setTimeout(() => {
            elements.loadingIndicator.style.display = 'none';
        }, 300);
    }
}

function showError(message) {
    // Simple error display - you can enhance this
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--error);
        color: white;
        padding: 1rem;
        border-radius: var(--border-radius);
        z-index: var(--z-tooltip);
        max-width: 300px;
    `;
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

function showSuccess(message) {
    // Simple success display - you can enhance this
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--success);
        color: white;
        padding: 1rem;
        border-radius: var(--border-radius);
        z-index: var(--z-tooltip);
        max-width: 300px;
    `;
    successDiv.textContent = message;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function getSocialIcon(platform) {
    const icons = {
        github: '🐙',
        linkedin: '💼',
        twitter: '🐦',
        instagram: '📷',
        dribbble: '🏀',
        behance: '🎨',
        youtube: '📺',
        facebook: '📘'
    };
    
    return icons[platform] || '🔗';
}

// Expose some functions globally for debugging
window.portfolioAPI = {
    config,
    applyTheme,
    renderSite,
    openLightbox
};