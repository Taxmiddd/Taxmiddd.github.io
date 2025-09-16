# 🎨 GitHub Pages Portfolio Generator

A complete, production-ready, beginner-friendly portfolio website that can be deployed directly to GitHub Pages. Fully customizable via a single config file with no coding required!

## ✨ Features

- 🎯 **Single Config File** - Customize everything through `config.json`
- 🎨 **3 Built-in Themes** - Default, Midnight, and Warm themes with easy switching
- 📱 **Fully Responsive** - Looks great on desktop, tablet, and mobile
- ♿ **Accessibility First** - WCAG compliant with proper ARIA labels and keyboard navigation
- 🚀 **Performance Optimized** - Lazy loading, WebP images, and minimal dependencies
- 🔧 **No Build Step** - Pure HTML, CSS, and vanilla JavaScript
- 📧 **Contact Form Ready** - Pre-configured for Formspree integration
- 🖼️ **Media Gallery** - Lightbox gallery with responsive images
- 📊 **Project Showcase** - Filterable project grid with detailed views
- 🌙 **Theme Switching** - Built-in theme switcher with localStorage persistence

## 🚀 Quick Start

### Option 1: Use This Template (Recommended)

1. Click the "Use this template" button at the top of this repository
2. Name your new repository (e.g., `your-username.github.io`)
3. Clone your new repository to your computer
4. Edit `config.json` with your information
5. Replace placeholder images in `assets/images/`
6. Push your changes to GitHub
7. Enable GitHub Pages in repository settings

### Option 2: Download and Upload

1. Download this repository as a ZIP file
2. Extract the files to your computer
3. Edit `config.json` with your information
4. Create a new GitHub repository
5. Upload all files to your repository
6. Enable GitHub Pages in repository settings

## 📝 Customization Guide

### 1. Edit Your Information

Open `config.json` and update the following sections:

#### Basic Information
```json
{
  "siteMeta": {
    "siteTitle": "Your Name — Portfolio",
    "tagline": "Your professional tagline",
    "author": "Your Full Name",
    "email": "your-email@example.com",
    "social": {
      "github": "https://github.com/yourusername",
      "linkedin": "https://linkedin.com/in/yourprofile"
    }
  }
}
```

#### Hero Section
```json
{
  "hero": {
    "title": "Hi — I'm Your Name",
    "subtitle": "Your professional description",
    "cta": [
      {
        "text": "View Projects",
        "link": "#projects",
        "style": "primary"
      }
    ]
  }
}
```

### 2. Add Your Projects

Update the `projects` array in `config.json`:

```json
{
  "projects": [
    {
      "id": "my-project",
      "title": "My Awesome Project",
      "summary": "Brief description of the project",
      "description": "Detailed project description...",
      "images": ["assets/images/projects/my-project-1.webp"],
      "tags": ["HTML", "CSS", "JavaScript"],
      "repo": "https://github.com/yourusername/project",
      "live": "https://yourproject.com",
      "date": "2024-01-15",
      "featured": true
    }
  ]
}
```

### 3. Customize Colors and Themes

#### Using Built-in Themes
Change the active theme in `config.json`:
```json
{
  "theme": {
    "activeTheme": "midnight"  // Options: "default", "midnight", "warm"
  }
}
```

#### Creating Custom Themes
Add a new theme to the themes object:
```json
{
  "theme": {
    "themes": {
      "myTheme": {
        "primary": "#your-color",
        "secondary": "#your-color",
        "accent": "#your-color",
        "background": "#your-color",
        "surface": "#your-color",
        "text": "#your-color"
      }
    }
  }
}
```

### 4. Update Services and Pricing

Edit the services and pricing sections (leave prices empty as required):

```json
{
  "services": [
    {
      "name": "Web Development",
      "description": "Custom website development",
      "features": ["Responsive Design", "Modern Technologies"],
      "price": "",  // Leave empty
      "notes": "Perfect for small businesses"
    }
  ],
  "pricing": [
    {
      "plan": "Basic",
      "description": "Perfect for small projects",
      "features": ["Feature 1", "Feature 2"],
      "price": "",  // Leave empty
      "popular": false
    }
  ]
}
```

### 5. Set Up Contact Form

1. Go to [Formspree.io](https://formspree.io) and create a free account
2. Create a new form and copy the endpoint URL
3. Update `config.json`:

```json
{
  "contact": {
    "formEndpoint": "https://formspree.io/f/YOUR_FORM_ID",
    "enableForm": true
  }
}
```

## 🖼️ Adding Images

### Required Images

Replace these placeholder images with your own:

1. **Hero Background** (optional): `assets/images/hero-bg.webp`
2. **Project Images**: `assets/images/projects/project-name-1.webp`
3. **Current Project**: `assets/images/projects/current-1.webp`
4. **Media Gallery**: `assets/images/media/gallery-1.webp`
5. **Open Graph**: `assets/images/og-image.webp` (1200x630px)

### Image Optimization Tips

- Use WebP format for better compression
- Optimize images to under 200KB when possible
- Use descriptive filenames: `project-landing-page-1.webp`
- Include alt text in `config.json` for accessibility

### Recommended Tools

- [Squoosh.app](https://squoosh.app/) - Free online image optimizer
- [TinyPNG](https://tinypng.com/) - PNG/JPG compression
- [ImageOptim](https://imageoptim.com/) - Mac image optimizer

## 🌐 GitHub Pages Deployment

### Step 1: Create Repository

1. Go to [GitHub.com](https://github.com) and create a new repository
2. Name it `yourusername.github.io` for a user site, or any name for a project site
3. Make sure it's public (required for free GitHub Pages)

### Step 2: Upload Files

**Option A: GitHub Web Interface**
1. Click "uploading an existing file"
2. Drag and drop all portfolio files
3. Write commit message: "Initial portfolio setup"
4. Click "Commit changes"

**Option B: Git Command Line**
```bash
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
# Copy all portfolio files here
git add .
git commit -m "Initial portfolio setup"
git push origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings" tab
3. Scroll down to "Pages" section
4. Under "Source", select "Deploy from a branch"
5. Choose "main" branch and "/ (root)" folder
6. Click "Save"
7. Your site will be available at `https://yourusername.github.io/repo-name`

### Step 4: Custom Domain (Optional)

1. Buy a domain from any registrar
2. Add a `CNAME` file to your repository with your domain:
   ```
   yourdomain.com
   ```
3. Configure DNS at your registrar:
   - Add CNAME record: `www` → `yourusername.github.io`
   - Add A records for apex domain:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`

## 🔧 Local Development

### Prerequisites
- A modern web browser
- Python 3 (for local server) or any local server tool

### Running Locally

**Option 1: Python Server**
```bash
# Navigate to your portfolio folder
cd your-portfolio-folder

# Start local server
python -m http.server 8000

# Open http://localhost:8000 in your browser
```

**Option 2: Node.js Server**
```bash
# Install a simple server globally
npm install -g http-server

# Start server
http-server

# Open the provided local URL
```

**Option 3: VS Code Live Server**
1. Install "Live Server" extension in VS Code
2. Right-click `index.html`
3. Select "Open with Live Server"

## 📱 Testing Your Site

### Browser Testing
Test in these browsers:
- Chrome/Chromium
- Firefox
- Safari
- Edge

### Responsive Testing
Test these screen sizes:
- Mobile: 375px width
- Tablet: 768px width
- Desktop: 1200px width
- Large: 1440px+ width

### Accessibility Testing
- Use keyboard navigation (Tab, Enter, Escape)
- Test with screen reader (built into macOS/Windows)
- Check color contrast with [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

## 🎨 Advanced Customization

### CSS Variables
Modify `assets/css/style.css` for advanced styling:

```css
:root {
  --space-custom: 2.5rem;
  --border-radius-custom: 20px;
  --font-size-custom: 1.125rem;
}
```

### Adding New Sections
1. Add section to `config.json` `sectionsOrder`
2. Add section content to config
3. Update `showSections` to `true`
4. Modify `assets/js/main.js` to render the new section

### Custom Animations
Add CSS animations in `assets/css/style.css`:

```css
@keyframes customFadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.custom-animation {
  animation: customFadeIn 0.6s ease-out;
}
```

## 🐛 Troubleshooting

### Common Issues

**Site not loading after deployment:**
- Check that `index.html` is in the root directory
- Verify GitHub Pages is enabled in repository settings
- Wait 5-10 minutes for GitHub Pages to build

**Images not showing:**
- Check file paths in `config.json`
- Ensure images are in `assets/images/` folder
- Verify image file names match exactly (case-sensitive)

**Contact form not working:**
- Replace `REPLACE_WITH_FORM_ENDPOINT` with your actual Formspree URL
- Check that form endpoint is correct in `config.json`
- Test form on the live site (not localhost)

**Theme not changing:**
- Clear browser cache and cookies
- Check browser console for JavaScript errors
- Verify `config.json` syntax is valid

**Mobile menu not working:**
- Check that JavaScript is enabled
- Test on actual mobile device, not just browser dev tools
- Verify no JavaScript errors in console

### Getting Help

1. **Check the browser console** for error messages
2. **Validate your JSON** at [JSONLint.com](https://jsonlint.com/)
3. **Test locally first** before deploying to GitHub Pages
4. **Check GitHub Pages status** at [GitHub Status](https://www.githubstatus.com/)

## 📚 File Structure

```
portfolio/
├── index.html              # Main HTML file
├── config.json            # All content and settings
├── assets/
│   ├── css/
│   │   └── style.css      # All styles and responsive design
│   ├── js/
│   │   └── main.js        # All JavaScript functionality
│   ├── images/            # All images
│   │   ├── projects/      # Project screenshots
│   │   ├── media/         # Gallery images
│   │   └── README.md      # Image guidelines
│   └── files/             # Downloadable files (CV, etc.)
├── projects/              # Optional: Markdown project files
├── README.md              # This file
├── LICENSE               # MIT License
├── .gitignore           # Git ignore rules
└── CNAME                # Custom domain (optional)
```

## 🤝 Contributing

This is a template repository, but if you find bugs or have suggestions:

1. Fork this repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Credits

- **Fonts**: Google Fonts (Inter, Playfair Display)
- **Icons**: Unicode emoji (for maximum compatibility)
- **Inspiration**: Modern portfolio design trends
- **Built with**: Vanilla HTML, CSS, and JavaScript

## 🚀 What's Next?

After setting up your portfolio:

1. **Customize thoroughly** - Make it uniquely yours
2. **Add your content** - Projects, bio, images
3. **Test everything** - All links, forms, and features
4. **Share your portfolio** - Add the link to your social profiles
5. **Keep it updated** - Regular updates show you're active

---

**Need help?** Check the troubleshooting section above or create an issue in this repository.

**Love this template?** Give it a ⭐ star and share it with others!

Happy coding! 🎉