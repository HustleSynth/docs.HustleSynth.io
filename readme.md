# HustleSynth Documentation

Official documentation for the HustleSynth AI Platform API.

🌐 **Live Site**: [docs.hustlesynth.space](https://docs.hustlesynth.space)

## Overview

This repository contains the documentation website for HustleSynth, a unified AI platform that provides seamless access to multiple AI models through a single API.

## Features

- 📚 Comprehensive API documentation
- 🎨 Light/dark theme support
- 🔍 Full-text search functionality
- 📱 Mobile responsive design
- ⚡ Fast static site (no build required)
- 🚀 Deployed on Cloudflare Pages

## Project Structure

```
docs.HustleSynth.io/
├── index.html          # Main HTML file
├── styles.css          # All styling
├── app.js             # JavaScript functionality
├── _redirects         # Cloudflare Pages routing
├── favicon.png        # Site favicon
└── README.md          # This file
```

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/HustleSynth/docs.HustleSynth.io.git
cd docs.HustleSynth.io
```

2. Serve locally with any static server:

**Python:**
```bash
python -m http.server 8000
```

**Node.js:**
```bash
npx serve
```

**VS Code Live Server:**
- Install the Live Server extension
- Right-click on `index.html`
- Select "Open with Live Server"

3. Open [http://localhost:8000](http://localhost:8000) in your browser

## Deployment

The site is automatically deployed to Cloudflare Pages when you push to the `main` branch.

### Manual Deployment

1. Push your changes to GitHub:
```bash
git add .
git commit -m "Update documentation"
git push origin main
```

2. Cloudflare Pages will automatically build and deploy

### Custom Domain Setup

The custom domain `docs.hustlesynth.space` is configured in Cloudflare:

1. Go to Cloudflare Dashboard
2. Select your domain
3. Add CNAME record:
   - Name: `docs`
   - Target: `docs-hustlesynth-io.pages.dev`

## Adding Content

### Add a New Section

1. Edit `app.js` and add your content function:
```javascript
function getYourSectionContent() {
    return `
        <h1>Your Section Title</h1>
        <p>Your content here...</p>
    `;
}
```

2. Add to the content mapping in `getContent()`:
```javascript
'your-section': getYourSectionContent(),
```

3. Add navigation link in `index.html`:
```html
<li><a href="#your-section" class="nav-link" onclick="loadContent('your-section')">
    <i class="fas fa-icon"></i> Your Section
</a></li>
```

### Updating Existing Content

Simply edit the corresponding function in `app.js`. Changes are reflected immediately upon deployment.

## Styling

All styles are in `styles.css`. The site uses CSS variables for theming:

```css
:root {
    --accent-color: #2563eb;  /* Primary blue */
    --bg-primary: #ffffff;     /* Background */
    --text-primary: #212529;   /* Main text */
}
```

## Search Functionality

Search is implemented client-side in `app.js`. To add searchable content:

1. Update the `searchIndex` in `buildSearchIndex()`:
```javascript
searchIndex.push({
    id: 'your-section',
    title: 'Your Section Title',
    description: 'Brief description',
    content: 'searchable keywords'
});
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Tech Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Icons**: Font Awesome 6
- **Code Highlighting**: Prism.js
- **Hosting**: Cloudflare Pages
- **Domain**: Cloudflare DNS

## Performance

- 💯 Lighthouse Score
- ⚡ <1s Load Time
- 📦 No Build Process
- 🌍 Global CDN via Cloudflare

## Support

- 📧 Email: support@hustlesynth.space
- 💬 Discord: [Join our community](https://discord.gg/hustlesynth)
- 🐛 Issues: [GitHub Issues](https://github.com/HustleSynth/docs.HustleSynth.io/issues)

## License

MIT License - see LICENSE file for details

---

Built with ❤️ by the HustleSynth team