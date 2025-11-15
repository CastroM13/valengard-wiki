# Deployment Guide - GitHub Pages

This guide will help you deploy your wiki to GitHub Pages using GitHub Actions.

## Prerequisites

- A GitHub repository (public or private)
- GitHub Pages enabled in repository settings

## Step-by-Step Setup

### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings**
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, select **GitHub Actions** (not "Deploy from a branch")
5. Save the settings

### 2. Push Your Code

The workflow will automatically trigger when you push to the `main` or `master` branch:

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 3. Monitor Deployment

1. Go to the **Actions** tab in your repository
2. You should see the "Deploy to GitHub Pages" workflow running
3. Wait for it to complete (usually 2-3 minutes)
4. Once complete, you'll see a green checkmark

### 4. Access Your Wiki

Your wiki will be available at:

- **User/Organization Pages**: If your repository is `username/username.github.io`, it will be at `https://username.github.io`
- **Project Pages**: If your repository is `username/wiki`, it will be at `https://username.github.io/wiki`

## Manual Deployment

You can also manually trigger the deployment:

1. Go to the **Actions** tab
2. Select **Deploy to GitHub Pages** workflow
3. Click **Run workflow**
4. Select the branch (usually `main`)
5. Click **Run workflow**

## Troubleshooting

### Build Fails

- Check the Actions logs for error messages
- Ensure all dependencies are listed in `package.json`
- Verify Node.js version compatibility

### 404 Errors on Refresh

- The workflow automatically creates a `404.html` file
- This handles Angular's client-side routing
- If you still see 404s, check that the base href is correct

### Assets Not Loading

- Verify the `base-href` in the workflow matches your repository structure
- Check that assets in `public/` are being copied correctly
- Ensure paths in your code use relative paths or the correct base href

### Search Not Working

- Verify `articles.json` is accessible at `/wiki/articles.json`
- Check browser console for CORS or loading errors
- Ensure the articles.json file is in the `public/wiki/` directory

## Custom Domain (Optional)

If you want to use a custom domain:

1. Add a `CNAME` file to `public/` directory with your domain:
   ```
   example.com
   ```

2. Configure DNS settings with your domain provider:
   - Add a CNAME record pointing to `username.github.io`

3. In GitHub repository settings → Pages, add your custom domain

## Updating Articles

To update articles:

1. Edit markdown files in `public/wiki/`
2. Update `public/wiki/articles.json` if adding new articles
3. Commit and push changes
4. The workflow will automatically rebuild and redeploy

## Workflow Details

The deployment workflow:

1. **Checks out** your code
2. **Sets up** Node.js 20
3. **Installs** dependencies (`npm ci`)
4. **Determines** the correct base href based on repository name
5. **Builds** the Angular application
6. **Creates** 404.html for client-side routing
7. **Deploys** to GitHub Pages

The entire process takes about 2-3 minutes.

