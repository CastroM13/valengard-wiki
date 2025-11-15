# Wiki

A beautiful, modern static wiki system built with Angular. All articles are stored as markdown files and can be linked together seamlessly.

## Features

- 📝 **Markdown Support**: Write articles in markdown format
- 🔗 **Internal Linking**: Link to other articles using `[Link Text](article-name)`
- 🔍 **Search**: Search articles by name or title
- 🎨 **Modern UI**: Beautiful, responsive design with Inter font
- 🚀 **Static**: All articles are static markdown files
- 📱 **Responsive**: Works perfectly on all devices

## Development

### Prerequisites

- Node.js 20 or higher
- npm

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:4200/`

### Building

To build the project for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/wiki/browser/` directory.

## Adding Articles

1. Create a new markdown file in `public/wiki/` directory (e.g., `my-article.md`)
2. Add the article to `public/wiki/articles.json`:
   ```json
   {
     "name": "my-article",
     "title": "My Article Title",
     "path": "my-article"
   }
   ```
3. Link to it from other articles using `[Link Text](my-article)`

## Deployment to GitHub Pages

This project is configured to automatically deploy to GitHub Pages using GitHub Actions.

### Setup Instructions

1. **Enable GitHub Pages**:
   - Go to your repository settings
   - Navigate to "Pages" section
   - Under "Source", select "GitHub Actions"

2. **Push to main branch**:
   - The workflow will automatically trigger on push to `main` or `master` branch
   - Or manually trigger it from the "Actions" tab

3. **Access your wiki**:
   - If your repository is `username/username.github.io`, it will be available at `https://username.github.io`
   - If your repository is `username/wiki`, it will be available at `https://username.github.io/wiki`

### Manual Deployment

You can also manually trigger the deployment workflow:
- Go to the "Actions" tab in your repository
- Select "Deploy to GitHub Pages" workflow
- Click "Run workflow"

## Project Structure

```
wiki/
├── public/
│   └── wiki/              # Markdown articles go here
│       ├── index.md       # Home page
│       ├── articles.json  # Article index for search
│       └── *.md           # Other articles
├── src/
│   └── app/
│       ├── components/    # Angular components
│       └── services/      # Services (WikiService, SearchService)
└── .github/
    └── workflows/
        └── deploy.yml     # GitHub Actions deployment workflow
```

## License

MIT
