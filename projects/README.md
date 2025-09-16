# Projects Directory

This directory is optional and allows you to create detailed project pages using Markdown files.

## How to Use

1. Create a `.md` file for each project (e.g., `my-awesome-project.md`)
2. Use front matter to define project metadata
3. Write your project description in Markdown
4. Link to these files from your main projects in `config.json`

## Example Project File

Create a file like `elegant-landing-page.md`:

```markdown
---
id: elegant-landing
title: Elegant Landing Page
summary: A minimal, conversion-focused landing page template
tags: [Web Design, HTML, CSS, JavaScript]
date: 2024-08-15
featured: true
repo: https://github.com/username/elegant-landing
live: https://username.github.io/elegant-landing
images:
  - assets/images/projects/landing-1.webp
  - assets/images/projects/landing-2.webp
---

# Elegant Landing Page

A beautifully designed, minimal landing page template optimized for conversions and user experience.

## Overview

This project showcases modern web design principles with a focus on clean typography, effective use of whitespace, and strategic call-to-action placement.

## Features

- Responsive design that works on all devices
- Smooth scrolling and subtle animations
- Optimized for search engines
- Fast loading times
- Accessibility-first approach

## Technology Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Flexbox and Grid
- **Vanilla JavaScript** - Lightweight interactions
- **Web Fonts** - Google Fonts integration

## Design Process

The design process began with user research and competitor analysis...

## Challenges and Solutions

One of the main challenges was creating a design that would work well across different industries...

## Results

The landing page template has been used by over 50 businesses and achieved an average conversion rate improvement of 23%.

## What I Learned

This project taught me the importance of user-centered design and the power of simplicity in web design.
```

## Benefits of Using Markdown Files

- **Better organization** - Keep detailed project information separate
- **Version control** - Track changes to project descriptions
- **Rich formatting** - Use Markdown for better text formatting
- **Easy editing** - Edit in any text editor or directly on GitHub
- **Future flexibility** - Can be converted to a blog or detailed portfolio later

## Integration with Main Site

The JavaScript in `main.js` can be extended to read these Markdown files and display them in a project detail modal or separate page.

Replace this README with your actual project files when ready!