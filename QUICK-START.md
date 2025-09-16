# ⚡ Quick Start Guide

Get your portfolio online in 10 minutes! Follow these simple steps.

## 🎯 What You'll Need
- A GitHub account (free at [github.com](https://github.com))
- Your content (bio, project descriptions, images)
- 10 minutes of your time

## 📋 Step-by-Step Instructions

### Step 1: Get This Template (2 minutes)
1. **Click the "Use this template" button** at the top of this repository
2. **Name your repository**: `yourusername.github.io` (replace with your actual GitHub username)
3. **Make sure it's Public** (required for free GitHub Pages)
4. **Click "Create repository"**

### Step 2: Edit Your Information (5 minutes)
1. **Click on `config.json`** in your new repository
2. **Click the pencil icon** (✏️) to edit
3. **Update these key sections**:
   
   ```json
   "siteMeta": {
     "siteTitle": "Your Name — Portfolio",
     "author": "Your Full Name",
     "email": "your-email@example.com"
   }
   ```
   
   ```json
   "hero": {
     "title": "Hi — I'm Your Name",
     "subtitle": "Your professional description here"
   }
   ```
   
   ```json
   "about": {
     "bio": "Write your bio here. Keep it friendly and professional."
   }
   ```

4. **Scroll down and click "Commit changes"**
5. **Add a commit message** like "Updated personal information"
6. **Click "Commit changes" again**

### Step 3: Enable GitHub Pages (2 minutes)
1. **Go to Settings** (tab at the top of your repository)
2. **Scroll down to "Pages"** (in the left sidebar)
3. **Under "Source"**, select **"Deploy from a branch"**
4. **Choose "main" branch** and **"/ (root)" folder**
5. **Click "Save"**
6. **Wait 2-3 minutes** for your site to build

### Step 4: View Your Portfolio (1 minute)
1. **Refresh the Pages settings page**
2. **Look for the green checkmark** and your site URL
3. **Click the URL** to see your live portfolio!
4. **Your site is now live** at `https://yourusername.github.io`

## 🎉 You're Done!

Your portfolio is now live on the internet! Share the URL with friends, add it to your LinkedIn profile, and start showcasing your work.

## 🔧 Next Steps (Optional)

### Add Your Projects
1. Edit `config.json` again
2. Find the `"projects"` section
3. Replace the example projects with your own:
   ```json
   {
     "title": "My Awesome Project",
     "summary": "Brief description",
     "description": "Longer description...",
     "tags": ["HTML", "CSS", "JavaScript"],
     "repo": "https://github.com/yourusername/project",
     "live": "https://yourproject.com"
   }
   ```

### Add Your Images
1. **Click "Add file" → "Upload files"** in your repository
2. **Drag and drop your images** into `assets/images/`
3. **Update the image paths** in `config.json`
4. **Commit the changes**

### Set Up Contact Form
1. **Go to [formspree.io](https://formspree.io)** and create a free account
2. **Create a new form** and copy the endpoint URL
3. **Edit `config.json`** and replace `REPLACE_WITH_FORM_ENDPOINT` with your URL
4. **Commit the changes**

### Change Colors/Theme
In `config.json`, change the `activeTheme`:
```json
"theme": {
  "activeTheme": "midnight"  // Options: "default", "midnight", "warm"
}
```

## 🆘 Need Help?

### Common Issues
- **Site not loading?** Wait 10 minutes and try again
- **Images not showing?** Check that file paths match exactly
- **Contact form not working?** Make sure you set up Formspree

### Get Support
- Read the full [README.md](README.md) for detailed instructions
- Check the [DEPLOYMENT-CHECKLIST.md](DEPLOYMENT-CHECKLIST.md) for troubleshooting
- Create an issue in this repository if you're stuck

## 💡 Pro Tips

1. **Use your GitHub username** in the repository name for a clean URL
2. **Add new projects regularly** to keep your portfolio fresh
3. **Test your site on mobile** to make sure it looks good
4. **Share your portfolio URL** on social media and in your email signature
5. **Keep your config.json backed up** before making major changes

---

**Congratulations!** 🎉 You now have a professional portfolio website that you can customize and maintain yourself, no coding required!