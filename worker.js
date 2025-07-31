// Cloudflare Worker for serving static documentation site
// Handles routing, caching, and security headers

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    let pathname = url.pathname;

    // Redirect root to index.html
    if (pathname === '/') {
      pathname = '/index.html';
    }

    // Add .html extension if no extension present (for clean URLs)
    if (!pathname.includes('.') && pathname !== '/') {
      pathname = pathname + '.html';
    }

    // Handle API documentation redirects
    const redirects = {
      '/docs': '/index.html',
      '/api': '/index.html#api-overview',
      '/quickstart': '/index.html#quickstart',
      '/authentication': '/index.html#authentication',
    };

    if (redirects[pathname]) {
      return Response.redirect(new URL(redirects[pathname], request.url), 301);
    }

    // Construct the asset URL
    const assetUrl = new URL(pathname, request.url);

    try {
      // Fetch the asset from the origin
      const response = await fetch(assetUrl, {
        cf: {
          cacheTtl: 3600, // Cache for 1 hour
          cacheEverything: true,
        },
      });

      // If asset not found, return 404 page
      if (response.status === 404) {
        const notFoundHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 - Page Not Found | HustleSynth Docs</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background-color: #f8f9fa;
        }
        .error-container {
            text-align: center;
            padding: 2rem;
        }
        h1 {
            font-size: 4rem;
            color: #2563eb;
            margin: 0;
        }
        h2 {
            font-size: 1.5rem;
            color: #495057;
            font-weight: normal;
            margin: 1rem 0;
        }
        a {
            color: #2563eb;
            text-decoration: none;
            font-weight: 500;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="error-container">
        <h1>404</h1>
        <h2>Page not found</h2>
        <p>The page you're looking for doesn't exist.</p>
        <p><a href="/">Return to documentation home</a></p>
    </div>
</body>
</html>`;
        return new Response(notFoundHtml, {
          status: 404,
          headers: {
            'Content-Type': 'text/html',
            'Cache-Control': 'no-cache',
          },
        });
      }

      // Clone the response to modify headers
      const modifiedResponse = new Response(response.body, response);

      // Add security headers
      modifiedResponse.headers.set('X-Content-Type-Options', 'nosniff');
      modifiedResponse.headers.set('X-Frame-Options', 'DENY');
      modifiedResponse.headers.set('X-XSS-Protection', '1; mode=block');
      modifiedResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
      
      // Add CSP header
      modifiedResponse.headers.set('Content-Security-Policy', 
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com; " +
        "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; " +
        "font-src 'self' https://cdnjs.cloudflare.com; " +
        "img-src 'self' data: https:; " +
        "connect-src 'self' https://api.hustlesynth.space https://panel.hustlesynth.space;"
      );

      // Set appropriate cache headers based on file type
      const fileExtension = pathname.split('.').pop();
      const cacheControl = {
        'html': 'public, max-age=3600', // 1 hour
        'css': 'public, max-age=86400', // 1 day
        'js': 'public, max-age=86400', // 1 day
        'json': 'public, max-age=3600', // 1 hour
        'png': 'public, max-age=604800', // 1 week
        'jpg': 'public, max-age=604800', // 1 week
        'jpeg': 'public, max-age=604800', // 1 week
        'ico': 'public, max-age=604800', // 1 week
        'svg': 'public, max-age=604800', // 1 week
      };

      modifiedResponse.headers.set('Cache-Control', 
        cacheControl[fileExtension] || 'public, max-age=3600'
      );

      return modifiedResponse;

    } catch (error) {
      // Return error page
      return new Response(`Error: ${error.message}`, {
        status: 500,
        headers: {
          'Content-Type': 'text/plain',
          'Cache-Control': 'no-cache',
        },
      });
    }
  },
};