// Global variables
let currentContent = 'introduction';
let searchIndex = [];

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    // Load initial content
    const hash = window.location.hash.substring(1) || 'introduction';
    loadContent(hash, false);
    
    // Handle browser back/forward
    window.addEventListener('popstate', function(event) {
        const contentId = event.state?.content || 'introduction';
        loadContent(contentId, false);
    });
    
    // Apply saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    // Build search index
    buildSearchIndex();
    
    // Close search on outside click
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-container')) {
            document.getElementById('searchResults').style.display = 'none';
        }
    });
});

// Toggle theme
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

// Update theme icon
function updateThemeIcon(theme) {
    const icon = document.getElementById('themeIcon');
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// Toggle sidebar (mobile)
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

// Load content
async function loadContent(contentId, updateHistory = true) {
    const contentArea = document.getElementById('content');
    
    // Show loading
    contentArea.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Loading documentation...</p>
        </div>
    `;
    
    // Update active nav
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    const activeLink = document.querySelector(`[onclick="loadContent('${contentId}')"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Load content based on ID
    setTimeout(() => {
        const content = getContent(contentId);
        contentArea.innerHTML = content;
        
        // Update URL
        if (updateHistory) {
            history.pushState({ content: contentId }, '', `#${contentId}`);
        }
        
        // Update current content
        currentContent = contentId;
        
        // Syntax highlighting
        if (typeof Prism !== 'undefined') {
            Prism.highlightAll();
        }
        
        // Add copy buttons to code blocks
        addCopyButtons();
        
        // Generate table of contents
        generateTOC();
        
        // Scroll to top
        window.scrollTo(0, 0);
        
        // Close mobile sidebar
        document.getElementById('sidebar').classList.remove('active');
    }, 300);
}

// Add copy buttons to code blocks
function addCopyButtons() {
    const codeBlocks = document.querySelectorAll('pre');
    
    codeBlocks.forEach(block => {
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        block.parentNode.insertBefore(wrapper, block);
        wrapper.appendChild(block);
        
        const button = document.createElement('button');
        button.className = 'code-copy-btn';
        button.innerHTML = '<i class="fas fa-copy"></i> Copy';
        button.onclick = function() {
            const code = block.textContent;
            navigator.clipboard.writeText(code).then(() => {
                button.innerHTML = '<i class="fas fa-check"></i> Copied!';
                setTimeout(() => {
                    button.innerHTML = '<i class="fas fa-copy"></i> Copy';
                }, 2000);
            });
        };
        
        wrapper.appendChild(button);
    });
}

// Generate table of contents
function generateTOC() {
    const tocList = document.getElementById('tocList');
    const headings = document.querySelectorAll('.content h2, .content h3');
    
    tocList.innerHTML = '';
    
    headings.forEach((heading, index) => {
        const id = `heading-${index}`;
        heading.id = id;
        
        const li = document.createElement('li');
        li.className = heading.tagName.toLowerCase() === 'h3' ? 'toc-h3' : '';
        
        const a = document.createElement('a');
        a.href = `#${id}`;
        a.textContent = heading.textContent;
        a.onclick = (e) => {
            e.preventDefault();
            heading.scrollIntoView({ behavior: 'smooth' });
        };
        
        li.appendChild(a);
        tocList.appendChild(li);
    });
}

// Search functionality
function searchDocs(event) {
    const query = event.target.value.toLowerCase();
    const resultsContainer = document.getElementById('searchResults');
    
    if (query.length < 2) {
        resultsContainer.style.display = 'none';
        return;
    }
    
    const results = searchIndex.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.content.toLowerCase().includes(query)
    );
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '<div class="search-result">No results found</div>';
    } else {
        resultsContainer.innerHTML = results.slice(0, 5).map(result => `
            <div class="search-result" onclick="loadContent('${result.id}')">
                <strong>${result.title}</strong>
                <small>${result.description}</small>
            </div>
        `).join('');
    }
    
    resultsContainer.style.display = 'block';
}

// Build search index
function buildSearchIndex() {
    searchIndex = [
        { id: 'introduction', title: 'Introduction', description: 'Getting started with HustleSynth', content: 'hustlesynth ai platform api unified' },
        { id: 'quickstart', title: 'Quick Start', description: 'Get up and running in minutes', content: 'quick start api key first call' },
        { id: 'authentication', title: 'Authentication', description: 'API key and token management', content: 'authentication api key bearer token' },
        { id: 'pricing', title: 'Pricing', description: 'Plans and pricing information', content: 'pricing free starter pro enterprise' },
        { id: 'api-overview', title: 'API Overview', description: 'Complete API reference', content: 'api reference endpoints base url' },
        { id: 'chat-completions', title: 'Chat Completions', description: 'Chat API endpoint', content: 'chat completions messages streaming' },
        { id: 'models', title: 'Available Models', description: 'Supported AI models', content: 'gpt claude dall-e whisper models' },
        { id: 'rate-limits', title: 'Rate Limits', description: 'API rate limiting', content: 'rate limits requests per minute' },
        { id: 'webhooks', title: 'Webhooks', description: 'Event notifications', content: 'webhooks events notifications' },
        { id: 'usage-tracking', title: 'Usage Tracking', description: 'Monitor your usage', content: 'usage tracking statistics costs' }
    ];
}

// Get content based on ID
function getContent(contentId) {
    const contents = {
        'introduction': getIntroductionContent(),
        'quickstart': getQuickstartContent(),
        'authentication': getAuthenticationContent(),
        'pricing': getPricingContent(),
        'api-overview': getAPIOverviewContent(),
        'chat-completions': getChatCompletionsContent(),
        'models': getModelsContent(),
        'streaming': getStreamingContent(),
        'rate-limits': getRateLimitsContent(),
        'api-keys': getAPIKeysContent(),
        'webhooks': getWebhooksContent(),
        'usage-tracking': getUsageTrackingContent(),
        'services': getServicesContent(),
        'javascript-sdk': getJavaScriptSDKContent(),
        'python-sdk': getPythonSDKContent(),
        'rest-api': getRESTAPIContent(),
        'examples': getExamplesContent(),
        'best-practices': getBestPracticesContent(),
        'troubleshooting': getTroubleshootingContent(),
        'changelog': getChangelogContent()
    };
    
    return contents[contentId] || '<h1>Page Not Found</h1><p>The requested documentation page could not be found.</p>';
}

// Content generators
function getIntroductionContent() {
    return `
        <h1>Welcome to HustleSynth Documentation</h1>
        
        <p class="lead">HustleSynth is a unified AI platform that provides seamless access to multiple AI models through a single API. Build powerful AI applications with our easy-to-use interface.</p>
        
        <div class="alert alert-info">
            <strong>🚀 New!</strong> We've added support for Claude 3 Opus and GPT-4 Turbo. Check out the <a href="#models" onclick="loadContent('models')">available models</a> section.
        </div>
        
        <h2>What is HustleSynth?</h2>
        
        <p>HustleSynth is a comprehensive AI platform that unifies access to leading AI models including:</p>
        
        <ul>
            <li><strong>OpenAI Models</strong>: GPT-3.5, GPT-4, DALL-E, Whisper</li>
            <li><strong>Anthropic Models</strong>: Claude 3 Sonnet, Claude 3 Opus</li>
            <li><strong>Custom Models</strong>: Fine-tuned models for specific use cases</li>
        </ul>
        
        <h2>Key Features</h2>
        
        <div class="feature-grid">
            <div class="feature-card">
                <i class="fas fa-bolt fa-2x"></i>
                <h3>Unified API</h3>
                <p>One API key for all models. Switch between providers without changing your code.</p>
            </div>
            <div class="feature-card">
                <i class="fas fa-chart-line fa-2x"></i>
                <h3>Usage Tracking</h3>
                <p>Real-time monitoring of API usage, costs, and performance metrics.</p>
            </div>
            <div class="feature-card">
                <i class="fas fa-shield-alt fa-2x"></i>
                <h3>Enterprise Ready</h3>
                <p>SOC2 compliant with 99.9% uptime SLA and dedicated support.</p>
            </div>
            <div class="feature-card">
                <i class="fas fa-code fa-2x"></i>
                <h3>Developer Friendly</h3>
                <p>SDKs for popular languages, comprehensive docs, and interactive examples.</p>
            </div>
        </div>
        
        <h2>Getting Started</h2>
        
        <ol>
            <li><strong>Sign Up</strong>: Create an account at <a href="https://panel.hustlesynth.space" target="_blank">panel.hustlesynth.space</a></li>
            <li><strong>Get API Key</strong>: Generate your API key from the dashboard</li>
            <li><strong>Install SDK</strong>: Choose your preferred SDK or use the REST API directly</li>
            <li><strong>Make Your First Call</strong>: Follow our <a href="#quickstart" onclick="loadContent('quickstart')">Quick Start Guide</a></li>
        </ol>
        
        <h2>Community & Support</h2>
        
        <ul>
            <li><strong>Discord</strong>: Join our <a href="https://discord.gg/hustlesynth" target="_blank">Discord community</a> for real-time help</li>
            <li><strong>GitHub</strong>: Report issues and contribute on <a href="https://github.com/HustleSynth" target="_blank">GitHub</a></li>
            <li><strong>Email</strong>: Contact support at <a href="mailto:support@hustlesynth.space">support@hustlesynth.space</a></li>
        </ul>
    `;
}

function getQuickstartContent() {
    return `
        <h1>Quick Start Guide</h1>
        
        <p>Get started with HustleSynth in just a few minutes. This guide will walk you through creating your account, getting your API key, and making your first API call.</p>
        
        <h2>Prerequisites</h2>
        
        <ul>
            <li>A HustleSynth account (sign up at <a href="https://panel.hustlesynth.space" target="_blank">panel.hustlesynth.space</a>)</li>
            <li>Basic knowledge of HTTP/REST APIs</li>
            <li>A programming language of your choice (we provide examples in JavaScript and Python)</li>
        </ul>
        
        <h2>Step 1: Get Your API Key</h2>
        
        <ol>
            <li>Log in to your <a href="https://panel.hustlesynth.space" target="_blank">HustleSynth dashboard</a></li>
            <li>Navigate to the "API Keys" section</li>
            <li>Click "Create New Key"</li>
            <li>Give your key a descriptive name (e.g., "Production App")</li>
            <li>Copy your API key and store it securely</li>
        </ol>
        
        <div class="alert alert-warning">
            <strong>Important:</strong> Your API key is shown only once. Store it in a secure location like environment variables or a secrets manager.
        </div>
        
        <h2>Step 2: Install the SDK (Optional)</h2>
        
        <h3>JavaScript/Node.js</h3>
        <pre><code class="language-bash">npm install hustlesynth</code></pre>
        
        <h3>Python</h3>
        <pre><code class="language-bash">pip install hustlesynth</code></pre>
        
        <h2>Step 3: Make Your First API Call</h2>
        
        <h3>JavaScript Example</h3>
        
        <pre><code class="language-javascript">// Using the SDK
import HustleSynth from 'hustlesynth';

const client = new HustleSynth({
    apiKey: 'YOUR_API_KEY'
});

async function main() {
    const response = await client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: 'system',
                content: 'You are a helpful assistant.'
            },
            {
                role: 'user',
                content: 'Hello! What can you help me with?'
            }
        ]
    });
    
    console.log(response.choices[0].message.content);
}

main();</code></pre>
        
        <h3>Python Example</h3>
        
        <pre><code class="language-python">from hustlesynth import HustleSynth

client = HustleSynth(api_key="YOUR_API_KEY")

completion = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hello! What can you help me with?"}
    ]
)

print(completion.choices[0].message.content)</code></pre>
        
        <h3>cURL Example</h3>
        
        <pre><code class="language-bash">curl https://api.hustlesynth.space/v1/chat/completions \\
    -H "Authorization: Bearer YOUR_API_KEY" \\
    -H "Content-Type: application/json" \\
    -d '{
        "model": "gpt-3.5-turbo",
        "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "Hello! What can you help me with?"}
        ]
    }'</code></pre>
        
        <h2>Step 4: Explore Advanced Features</h2>
        
        <p>Now that you've made your first API call, explore these advanced features:</p>
        
        <ul>
            <li><a href="#streaming" onclick="loadContent('streaming')">Streaming responses</a> for real-time output</li>
            <li><a href="#models" onclick="loadContent('models')">Different models</a> for various use cases</li>
            <li><a href="#webhooks" onclick="loadContent('webhooks')">Webhooks</a> for event notifications</li>
            <li><a href="#usage-tracking" onclick="loadContent('usage-tracking')">Usage tracking</a> to monitor costs</li>
        </ul>
        
        <h2>Next Steps</h2>
        
        <div class="next-steps">
            <a href="#api-overview" onclick="loadContent('api-overview')" class="next-step-card">
                <h3>API Reference</h3>
                <p>Explore the complete API documentation</p>
            </a>
            <a href="#examples" onclick="loadContent('examples')" class="next-step-card">
                <h3>Examples</h3>
                <p>See real-world implementation examples</p>
            </a>
            <a href="#best-practices" onclick="loadContent('best-practices')" class="next-step-card">
                <h3>Best Practices</h3>
                <p>Learn optimization and security tips</p>
            </a>
        </div>
    `;
}

function getAuthenticationContent() {
    return `
        <h1>Authentication</h1>
        
        <p>HustleSynth uses API keys to authenticate requests. You can create and manage your API keys from the dashboard.</p>
        
        <h2>API Key Authentication</h2>
        
        <p>Include your API key in the Authorization header of each request:</p>
        
        <pre><code class="language-bash">Authorization: Bearer YOUR_API_KEY</code></pre>
        
        <h3>Example Request</h3>
        
        <pre><code class="language-javascript">fetch('https://api.hustlesynth.space/v1/chat/completions', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [...]
    })
});</code></pre>
        
        <h2>Security Best Practices</h2>
        
        <ul>
            <li><strong>Never expose your API key</strong> in client-side code or public repositories</li>
            <li><strong>Use environment variables</strong> to store your API keys</li>
            <li><strong>Rotate keys regularly</strong> especially if compromised</li>
            <li><strong>Use separate keys</strong> for development and production</li>
            <li><strong>Set usage limits</strong> on your keys to prevent unexpected charges</li>
        </ul>
        
        <h2>Managing API Keys</h2>
        
        <h3>Creating a New Key</h3>
        
        <ol>
            <li>Go to the <a href="https://panel.hustlesynth.space" target="_blank">dashboard</a></li>
            <li>Navigate to "API Keys"</li>
            <li>Click "Create New Key"</li>
            <li>Set a descriptive name</li>
            <li>Configure permissions and limits (optional)</li>
            <li>Copy and securely store your key</li>
        </ol>
        
        <h3>Key Permissions</h3>
        
        <p>You can configure the following permissions for each API key:</p>
        
        <ul>
            <li><strong>Models</strong>: Restrict which AI models can be accessed</li>
            <li><strong>Rate Limits</strong>: Set custom rate limits per key</li>
            <li><strong>IP Whitelist</strong>: Restrict key usage to specific IP addresses</li>
            <li><strong>Expiration</strong>: Set an expiration date for temporary keys</li>
        </ul>
        
        <h2>OAuth 2.0 (Coming Soon)</h2>
        
        <p>We're working on OAuth 2.0 support for more advanced authentication scenarios. This will enable:</p>
        
        <ul>
            <li>User-specific permissions</li>
            <li>Third-party integrations</li>
            <li>Granular access control</li>
            <li>Token refresh flows</li>
        </ul>
    `;
}

function getPricingContent() {
    return `
        <h1>Pricing</h1>
        
        <p>Simple, transparent pricing that scales with your needs. Pay only for what you use.</p>
        
        <h2>Plans</h2>
        
        <div class="pricing-grid">
            <div class="pricing-card">
                <h3>Free</h3>
                <div class="price">$0/month</div>
                <ul>
                    <li>1 API key</li>
                    <li>1,000 requests/month</li>
                    <li>GPT-3.5 Turbo only</li>
                    <li>Community support</li>
                    <li>Basic usage tracking</li>
                </ul>
                <a href="https://panel.hustlesynth.space" class="btn btn-secondary">Get Started</a>
            </div>
            
            <div class="pricing-card featured">
                <div class="badge">Most Popular</div>
                <h3>Starter</h3>
                <div class="price">$29/month</div>
                <ul>
                    <li>3 API keys</li>
                    <li>10,000 requests/month</li>
                    <li>All standard models</li>
                    <li>Email support</li>
                    <li>Advanced analytics</li>
                    <li>Webhooks</li>
                </ul>
                <a href="https://panel.hustlesynth.space" class="btn btn-primary">Start Free Trial</a>
            </div>
            
            <div class="pricing-card">
                <h3>Pro</h3>
                <div class="price">$99/month</div>
                <ul>
                    <li>10 API keys</li>
                    <li>100,000 requests/month</li>
                    <li>All models + priority access</li>
                    <li>Priority support</li>
                    <li>Custom rate limits</li>
                    <li>IP whitelisting</li>
                    <li>99.9% SLA</li>
                </ul>
                <a href="https://panel.hustlesynth.space" class="btn btn-primary">Start Free Trial</a>
            </div>
            
            <div class="pricing-card">
                <h3>Enterprise</h3>
                <div class="price">Custom</div>
                <ul>
                    <li>Unlimited API keys</li>
                    <li>Custom limits</li>
                    <li>All models + custom models</li>
                    <li>Dedicated support</li>
                    <li>Custom integration</li>
                    <li>On-premise deployment</li>
                    <li>99.99% SLA</li>
                </ul>
                <a href="mailto:enterprise@hustlesynth.space" class="btn btn-secondary">Contact Sales</a>
            </div>
        </div>
        
        <h2>Usage-Based Pricing</h2>
        
        <p>Additional usage beyond your plan limits is charged at the following rates:</p>
        
        <table class="pricing-table">
            <thead>
                <tr>
                    <th>Model</th>
                    <th>Price per 1K tokens</th>
                    <th>Input</th>
                    <th>Output</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>GPT-3.5 Turbo</td>
                    <td>-</td>
                    <td>$0.0015</td>
                    <td>$0.002</td>
                </tr>
                <tr>
                    <td>GPT-4</td>
                    <td>-</td>
                    <td>$0.03</td>
                    <td>$0.06</td>
                </tr>
                <tr>
                    <td>GPT-4 Turbo</td>
                    <td>-</td>
                    <td>$0.01</td>
                    <td>$0.03</td>
                </tr>
                <tr>
                    <td>Claude 3 Sonnet</td>
                    <td>-</td>
                    <td>$0.003</td>
                    <td>$0.015</td>
                </tr>
                <tr>
                    <td>Claude 3 Opus</td>
                    <td>-</td>
                    <td>$0.015</td>
                    <td>$0.075</td>
                </tr>
            </tbody>
        </table>
        
        <h2>FAQ</h2>
        
        <h3>How is usage calculated?</h3>
        <p>Usage is calculated based on the number of tokens processed. For text models, both input and output tokens are counted. For image models, each generation counts as one request.</p>
        
        <h3>What happens if I exceed my limits?</h3>
        <p>For paid plans, you'll be charged for additional usage at the rates above. For the free plan, requests will be rate-limited until the next billing cycle.</p>
        
        <h3>Can I change plans anytime?</h3>
        <p>Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and billing is prorated.</p>
        
        <h3>Do you offer discounts?</h3>
        <p>We offer discounts for annual billing (20% off) and volume discounts for enterprise customers. Contact sales for more information.</p>
    `;
}

function getAPIOverviewContent() {
    return `
        <h1>API Overview</h1>
        
        <p>The HustleSynth API provides a unified interface to interact with multiple AI models. Our RESTful API is designed to be simple, consistent, and powerful.</p>
        
        <h2>Base URL</h2>
        
        <pre><code>https://api.hustlesynth.space</code></pre>
        
        <h2>Authentication</h2>
        
        <p>All API requests require authentication using an API key in the Authorization header:</p>
        
        <pre><code class="language-bash">Authorization: Bearer YOUR_API_KEY</code></pre>
        
        <h2>Available Endpoints</h2>
        
        <table class="api-table">
            <thead>
                <tr>
                    <th>Endpoint</th>
                    <th>Method</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>/v1/chat/completions</code></td>
                    <td>POST</td>
                    <td>Create chat completions</td>
                </tr>
                <tr>
                    <td><code>/v1/models</code></td>
                    <td>GET</td>
                    <td>List available models</td>
                </tr>
                <tr>
                    <td><code>/api/user/profile</code></td>
                    <td>GET</td>
                    <td>Get user profile and tier info</td>
                </tr>
                <tr>
                    <td><code>/api/user/usage</code></td>
                    <td>GET</td>
                    <td>Get usage statistics</td>
                </tr>
                <tr>
                    <td><code>/api/keys/all</code></td>
                    <td>GET</td>
                    <td>List all API keys</td>
                </tr>
                <tr>
                    <td><code>/api/keys</code></td>
                    <td>POST</td>
                    <td>Create new API key</td>
                </tr>
                <tr>
                    <td><code>/api/services</code></td>
                    <td>GET</td>
                    <td>List available services</td>
                </tr>
                <tr>
                    <td><code>/api/webhooks</code></td>
                    <td>GET/POST</td>
                    <td>Manage webhooks</td>
                </tr>
                <tr>
                    <td><code>/api/logs</code></td>
                    <td>GET</td>
                    <td>Get request logs</td>
                </tr>
            </tbody>
        </table>
        
        <h2>Request Format</h2>
        
        <p>All POST requests should include a JSON body with the appropriate Content-Type header:</p>
        
        <pre><code class="language-bash">Content-Type: application/json</code></pre>
        
        <h3>Example Request</h3>
        
        <pre><code class="language-bash">curl https://api.hustlesynth.space/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [
      {
        "role": "user",
        "content": "Hello!"
      }
    ]
  }'</code></pre>
        
        <h2>Response Format</h2>
        
        <p>All responses are returned in JSON format. Successful responses will have a 2xx status code.</p>
        
        <h3>Success Response</h3>
        
        <pre><code class="language-json">{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "created": 1677649420,
  "model": "gpt-3.5-turbo",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! How can I assist you today?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 10,
    "total_tokens": 20
  }
}</code></pre>
        
        <h3>Error Response</h3>
        
        <pre><code class="language-json">{
  "error": {
    "message": "Invalid API key provided",
    "type": "authentication_error",
    "code": "invalid_api_key"
  }
}</code></pre>
        
        <h2>Error Codes</h2>
        
        <table class="api-table">
            <thead>
                <tr>
                    <th>Status Code</th>
                    <th>Error Type</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>400</td>
                    <td>bad_request</td>
                    <td>Invalid request format or parameters</td>
                </tr>
                <tr>
                    <td>401</td>
                    <td>authentication_error</td>
                    <td>Invalid or missing API key</td>
                </tr>
                <tr>
                    <td>403</td>
                    <td>permission_error</td>
                    <td>API key doesn't have permission</td>
                </tr>
                <tr>
                    <td>404</td>
                    <td>not_found</td>
                    <td>Requested resource not found</td>
                </tr>
                <tr>
                    <td>429</td>
                    <td>rate_limit_error</td>
                    <td>Rate limit exceeded</td>
                </tr>
                <tr>
                    <td>500</td>
                    <td>server_error</td>
                    <td>Internal server error</td>
                </tr>
            </tbody>
        </table>
        
        <h2>Versioning</h2>
        
        <p>The API is versioned using URL path versioning. The current version is <code>v1</code>. We will maintain backward compatibility within major versions.</p>
        
        <h2>Rate Limiting</h2>
        
        <p>Rate limits are applied per API key. See the <a href="#rate-limits" onclick="loadContent('rate-limits')">Rate Limits</a> section for details.</p>
    `;
}

function getChatCompletionsContent() {
    return `
        <h1>Chat Completions API</h1>
        
        <p>The Chat Completions API provides access to our conversational AI models. It's designed to be compatible with OpenAI's API format while supporting additional models.</p>
        
        <h2>Endpoint</h2>
        
        <pre><code>POST https://api.hustlesynth.space/v1/chat/completions</code></pre>
        
        <h2>Request Body</h2>
        
        <table class="api-table">
            <thead>
                <tr>
                    <th>Parameter</th>
                    <th>Type</th>
                    <th>Required</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>model</code></td>
                    <td>string</td>
                    <td>Yes</td>
                    <td>ID of the model to use (e.g., "gpt-3.5-turbo")</td>
                </tr>
                <tr>
                    <td><code>messages</code></td>
                    <td>array</td>
                    <td>Yes</td>
                    <td>Array of message objects</td>
                </tr>
                <tr>
                    <td><code>temperature</code></td>
                    <td>number</td>
                    <td>No</td>
                    <td>Sampling temperature (0-2, default: 1)</td>
                </tr>
                <tr>
                    <td><code>max_tokens</code></td>
                    <td>integer</td>
                    <td>No</td>
                    <td>Maximum tokens to generate</td>
                </tr>
                <tr>
                    <td><code>stream</code></td>
                    <td>boolean</td>
                    <td>No</td>
                    <td>Stream responses (default: false)</td>
                </tr>
                <tr>
                    <td><code>top_p</code></td>
                    <td>number</td>
                    <td>No</td>
                    <td>Nucleus sampling (0-1, default: 1)</td>
                </tr>
                <tr>
                    <td><code>n</code></td>
                    <td>integer</td>
                    <td>No</td>
                    <td>Number of completions (default: 1)</td>
                </tr>
                <tr>
                    <td><code>stop</code></td>
                    <td>string/array</td>
                    <td>No</td>
                    <td>Stop sequences</td>
                </tr>
            </tbody>
        </table>
        
        <h2>Message Format</h2>
        
        <p>Each message in the messages array must have a role and content:</p>
        
        <pre><code class="language-json">{
  "role": "system" | "user" | "assistant",
  "content": "message content"
}</code></pre>
        
        <h2>Examples</h2>
        
        <h3>Basic Chat Completion</h3>
        
        <pre><code class="language-bash">curl https://api.hustlesynth.space/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [
      {
        "role": "user",
        "content": "What is the capital of France?"
      }
    ]
  }'</code></pre>
        
        <h3>Conversation with Context</h3>
        
        <pre><code class="language-javascript">const response = await fetch('https://api.hustlesynth.space/v1/chat/completions', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        model: 'gpt-4',
        messages: [
            {
                role: 'system',
                content: 'You are a helpful math tutor.'
            },
            {
                role: 'user',
                content: 'What is calculus?'
            },
            {
                role: 'assistant',
                content: 'Calculus is a branch of mathematics...'
            },
            {
                role: 'user',
                content: 'Can you give me an example?'
            }
        ],
        temperature: 0.7,
        max_tokens: 500
    })
});</code></pre>
        
        <h3>Streaming Response</h3>
        
        <pre><code class="language-javascript">const response = await fetch('https://api.hustlesynth.space/v1/chat/completions', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
            {role: 'user', content: 'Write a short story'}
        ],
        stream: true
    })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
    const {done, value} = await reader.read();
    if (done) break;
    
    const chunk = decoder.decode(value);
    const lines = chunk.split('\\n');
    
    for (const line of lines) {
        if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;
            
            const parsed = JSON.parse(data);
            const content = parsed.choices[0]?.delta?.content;
            if (content) {
                console.log(content);
            }
        }
    }
}</code></pre>
        
        <h2>Response Format</h2>
        
        <h3>Non-streaming Response</h3>
        
        <pre><code class="language-json">{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "created": 1677649420,
  "model": "gpt-3.5-turbo",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "The capital of France is Paris."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 10,
    "total_tokens": 20
  }
}</code></pre>
        
        <h3>Streaming Response</h3>
        
        <p>When streaming is enabled, the response is sent as Server-Sent Events (SSE):</p>
        
        <pre><code>data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1677649420,"model":"gpt-3.5-turbo","choices":[{"index":0,"delta":{"role":"assistant","content":"The"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1677649420,"model":"gpt-3.5-turbo","choices":[{"index":0,"delta":{"content":" capital"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1677649420,"model":"gpt-3.5-turbo","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: [DONE]</code></pre>
        
        <h2>Best Practices</h2>
        
        <ul>
            <li><strong>System Messages</strong>: Use system messages to set the behavior and context</li>
            <li><strong>Temperature</strong>: Lower values (0.1-0.5) for factual responses, higher (0.7-1.0) for creative tasks</li>
            <li><strong>Token Limits</strong>: Set appropriate max_tokens to control response length and costs</li>
            <li><strong>Conversation History</strong>: Include relevant history but trim old messages to stay within token limits</li>
            <li><strong>Error Handling</strong>: Implement retry logic for transient errors</li>
        </ul>
    `;
}

function getModelsContent() {
    return `
        <h1>Available Models</h1>
        
        <p>HustleSynth provides access to a wide range of AI models from different providers. All models are accessible through our unified API.</p>
        
        <h2>Text Generation Models</h2>
        
        <h3>OpenAI Models</h3>
        
        <table class="models-table">
            <thead>
                <tr>
                    <th>Model ID</th>
                    <th>Description</th>
                    <th>Context Window</th>
                    <th>Training Data</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>gpt-3.5-turbo</code></td>
                    <td>Most capable GPT-3.5 model, optimized for chat</td>
                    <td>4,096 tokens</td>
                    <td>Up to Sep 2021</td>
                </tr>
                <tr>
                    <td><code>gpt-3.5-turbo-16k</code></td>
                    <td>Same as above but with 16K context</td>
                    <td>16,384 tokens</td>
                    <td>Up to Sep 2021</td>
                </tr>
                <tr>
                    <td><code>gpt-4</code></td>
                    <td>Most capable model, best for complex tasks</td>
                    <td>8,192 tokens</td>
                    <td>Up to Sep 2021</td>
                </tr>
                <tr>
                    <td><code>gpt-4-turbo</code></td>
                    <td>Latest GPT-4 with vision, faster responses</td>
                    <td>128,000 tokens</td>
                    <td>Up to Apr 2023</td>
                </tr>
            </tbody>
        </table>
        
        <h3>Anthropic Models</h3>
        
        <table class="models-table">
            <thead>
                <tr>
                    <th>Model ID</th>
                    <th>Description</th>
                    <th>Context Window</th>
                    <th>Strengths</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>claude-3-sonnet</code></td>
                    <td>Balanced performance and speed</td>
                    <td>200,000 tokens</td>
                    <td>General purpose, coding</td>
                </tr>
                <tr>
                    <td><code>claude-3-opus</code></td>
                    <td>Most capable Claude model</td>
                    <td>200,000 tokens</td>
                    <td>Complex reasoning, analysis</td>
                </tr>
            </tbody>
        </table>
        
        <h2>Image Generation Models</h2>
        
        <table class="models-table">
            <thead>
                <tr>
                    <th>Model ID</th>
                    <th>Description</th>
                    <th>Sizes Supported</th>
                    <th>Features</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>dall-e-2</code></td>
                    <td>Original DALL-E 2 model</td>
                    <td>256x256, 512x512, 1024x1024</td>
                    <td>Edit, variations</td>
                </tr>
                <tr>
                    <td><code>dall-e-3</code></td>
                    <td>Latest DALL-E with better quality</td>
                    <td>1024x1024, 1792x1024, 1024x1792</td>
                    <td>HD quality, styles</td>
                </tr>
            </tbody>
        </table>
        
        <h2>Audio Models</h2>
        
        <table class="models-table">
            <thead>
                <tr>
                    <th>Model ID</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Languages</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>whisper-1</code></td>
                    <td>Speech-to-Text</td>
                    <td>Transcription and translation</td>
                    <td>50+ languages</td>
                </tr>
                <tr>
                    <td><code>tts-1</code></td>
                    <td>Text-to-Speech</td>
                    <td>Natural sounding voices</td>
                    <td>Multiple languages</td>
                </tr>
                <tr>
                    <td><code>tts-1-hd</code></td>
                    <td>Text-to-Speech</td>
                    <td>Higher quality audio</td>
                    <td>Multiple languages</td>
                </tr>
            </tbody>
        </table>
        
        <h2>Model Selection Guide</h2>
        
        <h3>For General Chat/Q&A</h3>
        <ul>
            <li><strong>Budget conscious</strong>: <code>gpt-3.5-turbo</code></li>
            <li><strong>Best quality</strong>: <code>gpt-4-turbo</code> or <code>claude-3-opus</code></li>
            <li><strong>Long context</strong>: <code>claude-3-sonnet</code> (200K tokens)</li>
        </ul>
        
        <h3>For Coding Tasks</h3>
        <ul>
            <li><strong>Quick fixes</strong>: <code>gpt-3.5-turbo</code></li>
            <li><strong>Complex projects</strong>: <code>gpt-4</code> or <code>claude-3-sonnet</code></li>
            <li><strong>Code review</strong>: <code>claude-3-opus</code></li>
        </ul>
        
        <h3>For Creative Writing</h3>
        <ul>
            <li><strong>Short content</strong>: <code>gpt-3.5-turbo</code></li>
            <li><strong>Long-form content</strong>: <code>claude-3-opus</code></li>
            <li><strong>Poetry/Fiction</strong>: <code>gpt-4</code></li>
        </ul>
        
        <h2>Rate Limits by Model</h2>
        
        <p>Rate limits vary by model and plan. See the <a href="#rate-limits" onclick="loadContent('rate-limits')">Rate Limits</a> section for details.</p>
    `;
}

function getStreamingContent() {
    return `
        <h1>Streaming Responses</h1>
        
        <p>Streaming allows you to receive model responses in real-time as they're generated, providing a better user experience for longer responses.</p>
        
        <h2>Enabling Streaming</h2>
        
        <p>To enable streaming, set the <code>stream</code> parameter to <code>true</code> in your request:</p>
        
        <pre><code class="language-json">{
    "model": "gpt-3.5-turbo",
    "messages": [...],
    "stream": true
}</code></pre>
        
        <h2>Response Format</h2>
        
        <p>Streaming responses are sent as Server-Sent Events (SSE). Each chunk contains a partial response:</p>
        
        <pre><code>data: {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1694268190,"model":"gpt-3.5-turbo","choices":[{"index":0,"delta":{"role":"assistant","content":"Hello"},"finish_reason":null}]}

data: {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1694268190,"model":"gpt-3.5-turbo","choices":[{"index":0,"delta":{"content":" there"},"finish_reason":null}]}

data: {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1694268190,"model":"gpt-3.5-turbo","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: [DONE]</code></pre>
        
        <h2>Implementation Examples</h2>
        
        <h3>JavaScript (Browser)</h3>
        
        <pre><code class="language-javascript">async function streamChat(messages) {
    const response = await fetch('https://api.hustlesynth.space/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer YOUR_API_KEY',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: messages,
            stream: true
        })
    });
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    while (true) {
        const {done, value} = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\\n');
        
        for (const line of lines) {
            if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') {
                    console.log('Stream completed');
                    return;
                }
                
                try {
                    const parsed = JSON.parse(data);
                    const content = parsed.choices[0]?.delta?.content;
                    if (content) {
                        // Append content to your UI
                        document.getElementById('output').textContent += content;
                    }
                } catch (e) {
                    console.error('Error parsing stream:', e);
                }
            }
        }
    }
}</code></pre>
        
        <h3>Python</h3>
        
        <pre><code class="language-python">import requests
import json

def stream_chat(messages):
    response = requests.post(
        'https://api.hustlesynth.space/v1/chat/completions',
        headers={
            'Authorization': 'Bearer YOUR_API_KEY',
            'Content-Type': 'application/json'
        },
        json={
            'model': 'gpt-3.5-turbo',
            'messages': messages,
            'stream': True
        },
        stream=True
    )
    
    for line in response.iter_lines():
        if line:
            decoded_line = line.decode('utf-8')
            if decoded_line.startswith('data: '):
                data = decoded_line[6:]
                if data == '[DONE]':
                    print('\\nStream completed')
                    break
                
                try:
                    parsed = json.loads(data)
                    content = parsed['choices'][0]['delta'].get('content', '')
                    if content:
                        print(content, end='', flush=True)
                except json.JSONDecodeError:
                    pass</code></pre>
        
        <h3>Node.js</h3>
        
        <pre><code class="language-javascript">const https = require('https');

function streamChat(messages) {
    const data = JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
        stream: true
    });
    
    const options = {
        hostname: 'api.hustlesynth.space',
        path: '/v1/chat/completions',
        method: 'POST',
        headers: {
            'Authorization': 'Bearer YOUR_API_KEY',
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };
    
    const req = https.request(options, (res) => {
        res.on('data', (chunk) => {
            const lines = chunk.toString().split('\\n');
            
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    if (data === '[DONE]') {
                        console.log('\\nStream completed');
                        return;
                    }
                    
                    try {
                        const parsed = JSON.parse(data);
                        const content = parsed.choices[0]?.delta?.content;
                        if (content) {
                            process.stdout.write(content);
                        }
                    } catch (e) {
                        // Ignore parsing errors
                    }
                }
            }
        });
    });
    
    req.write(data);
    req.end();
}</code></pre>
        
        <h2>Best Practices</h2>
        
        <ul>
            <li><strong>Error Handling</strong>: Implement proper error handling for connection issues</li>
            <li><strong>Buffering</strong>: Buffer partial lines when chunks split across SSE boundaries</li>
            <li><strong>Timeouts</strong>: Set appropriate timeouts for long-running streams</li>
            <li><strong>UI Updates</strong>: Batch UI updates for better performance</li>
            <li><strong>Cancellation</strong>: Provide users a way to cancel ongoing streams</li>
        </ul>
        
        <h2>Common Issues</h2>
        
        <h3>Partial JSON in Chunks</h3>
        <p>Sometimes a JSON object might be split across chunks. Buffer incomplete lines and parse when complete.</p>
        
        <h3>Connection Drops</h3>
        <p>Implement reconnection logic with exponential backoff for resilient streaming.</p>
        
        <h3>Memory Usage</h3>
        <p>For very long streams, consider implementing a sliding window to limit memory usage.</p>
    `;
}

function getRateLimitsContent() {
    return `
        <h1>Rate Limits</h1>
        
        <p>Rate limits help ensure fair usage and maintain service quality for all users. Limits are applied per API key.</p>
        
        <h2>Rate Limit Headers</h2>
        
        <p>Every API response includes headers with rate limit information:</p>
        
        <pre><code>X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1677649420
X-RateLimit-Reset-After: 60</code></pre>
        
        <h2>Limits by Plan</h2>
        
        <table class="rate-limits-table">
            <thead>
                <tr>
                    <th>Plan</th>
                    <th>Requests/Min</th>
                    <th>Requests/Day</th>
                    <th>Tokens/Min</th>
                    <th>Concurrent Requests</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Free</td>
                    <td>3</td>
                    <td>50</td>
                    <td>40,000</td>
                    <td>1</td>
                </tr>
                <tr>
                    <td>Starter</td>
                    <td>60</td>
                    <td>1,000</td>
                    <td>90,000</td>
                    <td>5</td>
                </tr>
                <tr>
                    <td>Pro</td>
                    <td>120</td>
                    <td>10,000</td>
                    <td>150,000</td>
                    <td>10</td>
                </tr>
                <tr>
                    <td>Enterprise</td>
                    <td>Custom</td>
                    <td>Custom</td>
                    <td>Custom</td>
                    <td>Custom</td>
                </tr>
            </tbody>
        </table>
        
        <h2>Model-Specific Limits</h2>
        
        <p>Some models have additional limits:</p>
        
        <table class="rate-limits-table">
            <thead>
                <tr>
                    <th>Model</th>
                    <th>Max Tokens/Request</th>
                    <th>Requests/Min</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>gpt-3.5-turbo</td>
                    <td>4,096</td>
                    <td>As per plan</td>
                </tr>
                <tr>
                    <td>gpt-4</td>
                    <td>8,192</td>
                    <td>50% of plan limit</td>
                </tr>
                <tr>
                    <td>claude-3-opus</td>
                    <td>200,000</td>
                    <td>25% of plan limit</td>
                </tr>
                <tr>
                    <td>dall-e-3</td>
                    <td>N/A</td>
                    <td>5 per minute</td>
                </tr>
            </tbody>
        </table>
        
        <h2>Handling Rate Limits</h2>
        
        <h3>Exponential Backoff</h3>
        
        <pre><code class="language-javascript">async function makeRequestWithRetry(url, options, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(url, options);
            
            if (response.status === 429) {
                const resetAfter = response.headers.get('X-RateLimit-Reset-After');
                const waitTime = (resetAfter ? parseInt(resetAfter) : Math.pow(2, i)) * 1000;
                
                console.log(\`Rate limited. Waiting \${waitTime}ms before retry...\`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
                continue;
            }
            
            return response;
        } catch (error) {
            if (i === maxRetries - 1) throw error;
        }
    }
}</code></pre>
        
        <h3>Request Queuing</h3>
        
        <pre><code class="language-python">import time
import queue
import threading

class RateLimiter:
    def __init__(self, requests_per_minute):
        self.requests_per_minute = requests_per_minute
        self.interval = 60.0 / requests_per_minute
        self.last_request_time = 0
        self.lock = threading.Lock()
    
    def wait_if_needed(self):
        with self.lock:
            current_time = time.time()
            time_since_last = current_time - self.last_request_time
            
            if time_since_last < self.interval:
                sleep_time = self.interval - time_since_last
                time.sleep(sleep_time)
            
            self.last_request_time = time.time()

# Usage
limiter = RateLimiter(60)  # 60 requests per minute

def make_request():
    limiter.wait_if_needed()
    # Make your API request here
    response = requests.post(...)
    return response</code></pre>
        
        <h2>Best Practices</h2>
        
        <ul>
            <li><strong>Monitor Usage</strong>: Track your usage through the dashboard</li>
            <li><strong>Implement Caching</strong>: Cache responses when appropriate</li>
            <li><strong>Batch Requests</strong>: Combine multiple operations when possible</li>
            <li><strong>Use Webhooks</strong>: For async operations instead of polling</li>
            <li><strong>Optimize Prompts</strong>: Reduce token usage with concise prompts</li>
        </ul>
        
        <h2>Rate Limit Errors</h2>
        
        <p>When you exceed rate limits, you'll receive a 429 response:</p>
        
        <pre><code class="language-json">{
    "error": {
        "message": "Rate limit exceeded. Please retry after 60 seconds.",
        "type": "rate_limit_error",
        "code": "rate_limit_exceeded"
    }
}</code></pre>
        
        <h2>Increasing Limits</h2>
        
        <p>To increase your rate limits:</p>
        
        <ol>
            <li>Upgrade your plan in the dashboard</li>
            <li>Contact support for custom enterprise limits</li>
            <li>Use multiple API keys for different services</li>
        </ol>
    `;
}

// Continue with more content functions...
function getAPIKeysContent() {
    return `
        <h1>API Keys Management</h1>
        
        <p>API keys are used to authenticate your requests to the HustleSynth API. You can create and manage multiple keys for different applications and environments.</p>
        
        <h2>Creating API Keys</h2>
        
        <ol>
            <li>Log in to your <a href="https://panel.hustlesynth.space" target="_blank">dashboard</a></li>
            <li>Navigate to "API Keys"</li>
            <li>Click "Create New Key"</li>
            <li>Provide a descriptive name (e.g., "Production App", "Development")</li>
            <li>Configure permissions and limits (optional)</li>
            <li>Copy and securely store your key</li>
        </ol>
        
        <div class="alert alert-warning">
            <strong>Important:</strong> API keys are shown only once. If you lose a key, you'll need to create a new one.
        </div>
        
        <h2>Key Limits by Plan</h2>
        
        <table class="api-table">
            <thead>
                <tr>
                    <th>Plan</th>
                    <th>Max API Keys</th>
                    <th>Key Features</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Free</td>
                    <td>1</td>
                    <td>Basic access</td>
                </tr>
                <tr>
                    <td>Starter</td>
                    <td>3</td>
                    <td>Named keys, basic limits</td>
                </tr>
                <tr>
                    <td>Pro</td>
                    <td>10</td>
                    <td>Custom limits, IP restrictions</td>
                </tr>
                <tr>
                    <td>Enterprise</td>
                    <td>Unlimited</td>
                    <td>Full customization</td>
                </tr>
            </tbody>
        </table>
        
        <h2>Key Configuration Options</h2>
        
        <h3>Rate Limits</h3>
        <p>Set custom rate limits per key to control usage:</p>
        <ul>
            <li>Requests per minute</li>
            <li>Requests per day</li>
            <li>Maximum tokens per request</li>
        </ul>
        
        <h3>Model Access</h3>
        <p>Restrict which models can be accessed with each key:</p>
        <ul>
            <li>Allow specific models only</li>
            <li>Block expensive models</li>
            <li>Set model-specific limits</li>
        </ul>
        
        <h3>IP Whitelisting</h3>
        <p>Restrict key usage to specific IP addresses for enhanced security.</p>
        
        <h2>Using API Keys</h2>
        
        <p>Include your API key in the Authorization header:</p>
        
        <pre><code class="language-bash">curl https://api.hustlesynth.space/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"model": "gpt-3.5-turbo", "messages": [...]}'</code></pre>
        
        <h2>Security Best Practices</h2>
        
        <h3>Storage</h3>
        <ul>
            <li>Never commit API keys to version control</li>
            <li>Use environment variables or secure key management services</li>
            <li>Rotate keys regularly</li>
        </ul>
        
        <h3>Environment Separation</h3>
        <pre><code class="language-javascript">// Good: Using environment variables
const apiKey = process.env.HUSTLESYNTH_API_KEY;

// Bad: Hardcoding keys
const apiKey = "sk-abc123..."; // Never do this!</code></pre>
        
        <h3>Client-Side Security</h3>
        <p>Never use API keys directly in client-side code. Instead:</p>
        <ul>
            <li>Create a backend proxy</li>
            <li>Use server-side rendering</li>
            <li>Implement user authentication</li>
        </ul>
        
        <h2>Monitoring Key Usage</h2>
        
        <p>Track your API key usage in the dashboard:</p>
        <ul>
            <li>Requests per key</li>
            <li>Token usage</li>
            <li>Error rates</li>
            <li>Geographic distribution</li>
        </ul>
        
        <h2>Revoking Keys</h2>
        
        <p>To revoke a compromised key:</p>
        <ol>
            <li>Go to the API Keys section</li>
            <li>Find the key to revoke</li>
            <li>Click "Delete" or "Deactivate"</li>
            <li>The key will stop working immediately</li>
        </ol>
        
        <h2>API Key Endpoints</h2>
        
        <p>Programmatically manage your keys:</p>
        
        <h3>List All Keys</h3>
        <pre><code class="language-bash">GET https://api.hustlesynth.space/api/keys/all
Authorization: Bearer YOUR_AUTH_TOKEN</code></pre>
        
        <h3>Create New Key</h3>
        <pre><code class="language-bash">POST https://api.hustlesynth.space/api/keys
Authorization: Bearer YOUR_AUTH_TOKEN
Content-Type: application/json

{
    "name": "Production Key",
    "limits": {
        "requests_per_minute": 60,
        "models": ["gpt-3.5-turbo", "gpt-4"]
    }
}</code></pre>
        
        <h3>Delete Key</h3>
        <pre><code class="language-bash">DELETE https://api.hustlesynth.space/api/keys/:keyId
Authorization: Bearer YOUR_AUTH_TOKEN</code></pre>
    `;
}

function getWebhooksContent() {
    return `
        <h1>Webhooks</h1>
        
        <p>Webhooks allow you to receive real-time notifications about events in your HustleSynth account. Set up HTTP endpoints to receive event data as it happens.</p>
        
        <h2>Available Events</h2>
        
        <table class="api-table">
            <thead>
                <tr>
                    <th>Event</th>
                    <th>Description</th>
                    <th>Payload</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>request.success</code></td>
                    <td>API request completed successfully</td>
                    <td>Request details, tokens used</td>
                </tr>
                <tr>
                    <td><code>request.error</code></td>
                    <td>API request failed</td>
                    <td>Error details, request info</td>
                </tr>
                <tr>
                    <td><code>usage.limit_warning</code></td>
                    <td>80% of usage limit reached</td>
                    <td>Current usage, limits</td>
                </tr>
                <tr>
                    <td><code>usage.limit_exceeded</code></td>
                    <td>Usage limit exceeded</td>
                    <td>Limit details, overage</td>
                </tr>
                <tr>
                    <td><code>key.created</code></td>
                    <td>New API key created</td>
                    <td>Key metadata (not the key itself)</td>
                </tr>
                <tr>
                    <td><code>key.deleted</code></td>
                    <td>API key deleted</td>
                    <td>Key ID, deletion time</td>
                </tr>
            </tbody>
        </table>
        
        <h2>Setting Up Webhooks</h2>
        
        <h3>Via Dashboard</h3>
        <ol>
            <li>Navigate to "Webhooks" in your dashboard</li>
            <li>Click "Create Webhook"</li>
            <li>Enter your endpoint URL</li>
            <li>Select events to subscribe to</li>
            <li>Save and copy the webhook secret</li>
        </ol>
        
        <h3>Via API</h3>
        <pre><code class="language-bash">POST https://api.hustlesynth.space/api/webhooks
Authorization: Bearer YOUR_AUTH_TOKEN
Content-Type: application/json

{
    "url": "https://your-app.com/webhook",
    "events": ["request.success", "usage.limit_warning"],
    "description": "Production webhook"
}</code></pre>
        
        <h2>Webhook Payload Format</h2>
        
        <pre><code class="language-json">{
    "id": "evt_1234567890",
    "type": "request.success",
    "created": 1677649420,
    "data": {
        "request_id": "req_abc123",
        "model": "gpt-3.5-turbo",
        "tokens": {
            "prompt": 150,
            "completion": 200,
            "total": 350
        },
        "cost": 0.0007,
        "duration_ms": 1234
    }
}</code></pre>
        
        <h2>Verifying Webhook Signatures</h2>
        
        <p>All webhooks are signed using HMAC-SHA256. Verify the signature to ensure the webhook is from HustleSynth:</p>
        
        <h3>Node.js Example</h3>
        <pre><code class="language-javascript">const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');
    
    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
    );
}

// Express.js webhook handler
app.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
    const signature = req.headers['x-webhook-signature'];
    const secret = process.env.WEBHOOK_SECRET;
    
    if (!verifyWebhookSignature(req.body, signature, secret)) {
        return res.status(401).send('Invalid signature');
    }
    
    const event = JSON.parse(req.body);
    
    // Handle the event
    switch (event.type) {
        case 'request.success':
            console.log('Request completed:', event.data);
            break;
        case 'usage.limit_warning':
            console.warn('Usage limit warning:', event.data);
            break;
        // Handle other events...
    }
    
    res.status(200).send('OK');
});</code></pre>
        
        <h3>Python Example</h3>
        <pre><code class="language-python">import hmac
import hashlib
from flask import Flask, request, abort

app = Flask(__name__)

def verify_webhook_signature(payload, signature, secret):
    expected = hmac.new(
        secret.encode(),
        payload,
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(signature, expected)

@app.route('/webhook', methods=['POST'])
def handle_webhook():
    signature = request.headers.get('X-Webhook-Signature')
    secret = os.environ.get('WEBHOOK_SECRET')
    
    if not verify_webhook_signature(request.data, signature, secret):
        abort(401)
    
    event = request.json
    
    # Handle the event
    if event['type'] == 'request.success':
        print(f"Request completed: {event['data']}")
    elif event['type'] == 'usage.limit_warning':
        print(f"Usage warning: {event['data']}")
    
    return 'OK', 200</code></pre>
        
        <h2>Webhook Retry Policy</h2>
        
        <p>Failed webhook deliveries are retried with exponential backoff:</p>
        <ul>
            <li>1st retry: 5 seconds</li>
            <li>2nd retry: 30 seconds</li>
            <li>3rd retry: 2 minutes</li>
            <li>4th retry: 10 minutes</li>
            <li>5th retry: 1 hour</li>
        </ul>
        
        <p>After 5 failed attempts, the webhook is marked as failed and notifications stop.</p>
        
        <h2>Testing Webhooks</h2>
        
        <p>Use the dashboard to send test events to your webhook endpoint:</p>
        <ol>
            <li>Go to your webhook settings</li>
            <li>Click "Send Test Event"</li>
            <li>Select an event type</li>
            <li>Verify your endpoint receives it</li>
        </ol>
        
        <h2>Best Practices</h2>
        
        <ul>
            <li><strong>Idempotency</strong>: Handle duplicate events gracefully</li>
            <li><strong>Async Processing</strong>: Return 200 quickly, process async</li>
            <li><strong>Error Handling</strong>: Log failures for debugging</li>
            <li><strong>Security</strong>: Always verify signatures</li>
            <li><strong>Monitoring</strong>: Track webhook success rates</li>
        </ul>
    `;
}

// Add more content functions for remaining sections...
function getUsageTrackingContent() {
    return `
        <h1>Usage Tracking</h1>
        
        <p>Monitor your API usage, costs, and performance metrics in real-time through the dashboard or API.</p>
        
        <h2>Usage Metrics</h2>
        
        <h3>Available Metrics</h3>
        <ul>
            <li><strong>Requests</strong>: Total API calls made</li>
            <li><strong>Tokens</strong>: Input and output tokens processed</li>
            <li><strong>Costs</strong>: Calculated based on model and usage</li>
            <li><strong>Latency</strong>: Response time percentiles</li>
            <li><strong>Errors</strong>: Failed requests and error types</li>
        </ul>
        
        <h2>Dashboard Analytics</h2>
        
        <p>Access comprehensive analytics in your <a href="https://panel.hustlesynth.space" target="_blank">dashboard</a>:</p>
        
        <ul>
            <li>Real-time usage graphs</li>
            <li>Daily, weekly, and monthly breakdowns</li>
            <li>Per-model usage statistics</li>
            <li>Cost projections</li>
            <li>API key performance</li>
        </ul>
        
        <h2>API Endpoints</h2>
        
        <h3>Get Current Usage</h3>
        <pre><code class="language-bash">GET https://api.hustlesynth.space/api/user/usage
Authorization: Bearer YOUR_AUTH_TOKEN</code></pre>
        
        <p>Response:</p>
        <pre><code class="language-json">{
    "period": "2024-01",
    "usage": {
        "requests": 5420,
        "tokens": {
            "input": 1234567,
            "output": 987654,
            "total": 2222221
        },
        "cost": 45.67,
        "by_model": {
            "gpt-3.5-turbo": {
                "requests": 4000,
                "tokens": 1500000,
                "cost": 15.00
            },
            "gpt-4": {
                "requests": 1420,
                "tokens": 722221,
                "cost": 30.67
            }
        }
    },
    "limits": {
        "requests": 10000,
        "tokens": 10000000,
        "cost": 100.00
    }
}</code></pre>
        
        <h3>Get Historical Usage</h3>
        <pre><code class="language-bash">GET https://api.hustlesynth.space/api/user/usage/history?days=30
Authorization: Bearer YOUR_AUTH_TOKEN</code></pre>
        
        <h2>Usage Alerts</h2>
        
        <p>Set up alerts to monitor your usage:</p>
        
        <ol>
            <li>Go to Settings → Alerts</li>
            <li>Create new alert rule</li>
            <li>Set threshold (e.g., 80% of limit)</li>
            <li>Choose notification method</li>
        </ol>
        
        <h2>Cost Optimization</h2>
        
        <h3>Tips to Reduce Costs</h3>
        <ul>
            <li><strong>Use appropriate models</strong>: GPT-3.5 for simple tasks</li>
            <li><strong>Optimize prompts</strong>: Shorter prompts = fewer tokens</li>
            <li><strong>Set max_tokens</strong>: Limit response length</li>
            <li><strong>Cache responses</strong>: Avoid duplicate requests</li>
            <li><strong>Batch operations</strong>: Combine related tasks</li>
        </ul>
        
        <h3>Token Counting</h3>
        <pre><code class="language-javascript">// Estimate tokens before making a request
function estimateTokens(text) {
    // Rough estimate: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
}

const prompt = "Translate this to French: Hello world";
const estimatedTokens = estimateTokens(prompt);
console.log(\`Estimated tokens: \${estimatedTokens}\`);</code></pre>
        
        <h2>Export Usage Data</h2>
        
        <p>Export your usage data for analysis:</p>
        
        <ol>
            <li>Go to Usage → Export</li>
            <li>Select date range</li>
            <li>Choose format (CSV, JSON)</li>
            <li>Download file</li>
        </ol>
        
        <h2>Usage Limits</h2>
        
        <p>When approaching limits:</p>
        <ul>
            <li>You'll receive email notifications at 80% and 95%</li>
            <li>Webhook events are triggered (if configured)</li>
            <li>Dashboard shows warnings</li>
            <li>API responses include usage headers</li>
        </ul>
        
        <h2>Billing Cycles</h2>
        
        <p>Usage resets based on your billing cycle:</p>
        <ul>
            <li><strong>Monthly plans</strong>: 1st of each month</li>
            <li><strong>Annual plans</strong>: Anniversary date</li>
            <li><strong>Pay-as-you-go</strong>: No reset, continuous billing</li>
        </ul>
    `;
}

function getServicesContent() {
    return `
        <h1>Available Services</h1>
        
        <p>HustleSynth provides access to multiple AI services. Activate the services you need from your dashboard.</p>
        
        <h2>Service Categories</h2>
        
        <h3>Text Generation</h3>
        <table class="services-table">
            <thead>
                <tr>
                    <th>Service</th>
                    <th>Models</th>
                    <th>Best For</th>
                    <th>Tier Required</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>OpenAI GPT-3.5</td>
                    <td>gpt-3.5-turbo, gpt-3.5-turbo-16k</td>
                    <td>General chat, simple tasks</td>
                    <td>Free</td>
                </tr>
                <tr>
                    <td>OpenAI GPT-4</td>
                    <td>gpt-4, gpt-4-turbo</td>
                    <td>Complex reasoning, coding</td>
                    <td>Starter+</td>
                </tr>
                <tr>
                    <td>Anthropic Claude</td>
                    <td>claude-3-sonnet, claude-3-opus</td>
                    <td>Long context, analysis</td>
                    <td>Starter+</td>
                </tr>
            </tbody>
        </table>
        
        <h3>Image Generation</h3>
        <table class="services-table">
            <thead>
                <tr>
                    <th>Service</th>
                    <th>Models</th>
                    <th>Features</th>
                    <th>Tier Required</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>DALL-E</td>
                    <td>dall-e-2, dall-e-3</td>
                    <td>Text-to-image, variations</td>
                    <td>Starter+</td>
                </tr>
                <tr>
                    <td>Stable Diffusion</td>
                    <td>sdxl, sd-turbo</td>
                    <td>Fast generation, styles</td>
                    <td>Pro+</td>
                </tr>
            </tbody>
        </table>
        
        <h3>Audio Services</h3>
        <table class="services-table">
            <thead>
                <tr>
                    <th>Service</th>
                    <th>Type</th>
                    <th>Features</th>
                    <th>Tier Required</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Whisper</td>
                    <td>Speech-to-Text</td>
                    <td>Transcription, translation</td>
                    <td>Starter+</td>
                </tr>
                <tr>
                    <td>TTS</td>
                    <td>Text-to-Speech</td>
                    <td>Multiple voices, languages</td>
                    <td>Starter+</td>
                </tr>
            </tbody>
        </table>
        
        <h2>Activating Services</h2>
        
        <h3>Via Dashboard</h3>
        <ol>
            <li>Go to Services in your dashboard</li>
            <li>Browse available services</li>
            <li>Click "Activate" on desired services</li>
            <li>Confirm activation</li>
        </ol>
        
        <h3>Via API</h3>
        <pre><code class="language-bash">POST https://api.hustlesynth.space/api/services/:serviceId/activate
Authorization: Bearer YOUR_AUTH_TOKEN</code></pre>
        
        <h2>Service Status</h2>
        
        <p>Check which services are active:</p>
        
        <pre><code class="language-bash">GET https://api.hustlesynth.space/api/services
Authorization: Bearer YOUR_AUTH_TOKEN</code></pre>
        
        <p>Response:</p>
        <pre><code class="language-json">{
    "services": [
        {
            "id": "gpt-35-turbo",
            "name": "GPT-3.5 Turbo",
            "category": "text",
            "active": true,
            "models": ["gpt-3.5-turbo", "gpt-3.5-turbo-16k"],
            "pricing": {
                "input": 0.0015,
                "output": 0.002,
                "unit": "per_1k_tokens"
            }
        },
        {
            "id": "gpt-4",
            "name": "GPT-4",
            "category": "text",
            "active": false,
            "requires_tier": "starter",
            "models": ["gpt-4", "gpt-4-turbo"]
        }
    ]
}</code></pre>
        
        <h2>Service Limits</h2>
        
        <p>Each service may have specific limits:</p>
        <ul>
            <li>Requests per minute</li>
            <li>Maximum tokens/size</li>
            <li>Concurrent requests</li>
            <li>Monthly quotas</li>
        </ul>
        
        <h2>Coming Soon</h2>
        
        <ul>
            <li><strong>Embeddings API</strong>: Vector embeddings for search</li>
            <li><strong>Fine-tuning</strong>: Custom model training</li>
            <li><strong>Function Calling</strong>: Advanced AI agents</li>
            <li><strong>Vision API</strong>: Image understanding</li>
        </ul>
    `;
}

// Continue with SDK and other content functions...
function getJavaScriptSDKContent() {
    return `
        <h1>JavaScript SDK</h1>
        
        <p>The official HustleSynth JavaScript SDK provides a simple interface for interacting with our API in both Node.js and browser environments.</p>
        
        <h2>Installation</h2>
        
        <h3>NPM</h3>
        <pre><code class="language-bash">npm install hustlesynth</code></pre>
        
        <h3>Yarn</h3>
        <pre><code class="language-bash">yarn add hustlesynth</code></pre>
        
        <h3>CDN</h3>
        <pre><code class="language-html">&lt;script src="https://cdn.jsdelivr.net/npm/hustlesynth@latest/dist/hustlesynth.min.js"&gt;&lt;/script&gt;</code></pre>
        
        <h2>Quick Start</h2>
        
        <pre><code class="language-javascript">import HustleSynth from 'hustlesynth';

const client = new HustleSynth({
    apiKey: process.env.HUSTLESYNTH_API_KEY
});

// Simple chat completion
const completion = await client.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
        {role: 'user', content: 'Hello!'}
    ]
});

console.log(completion.choices[0].message.content);</code></pre>
        
        <h2>Configuration</h2>
        
        <pre><code class="language-javascript">const client = new HustleSynth({
    apiKey: 'YOUR_API_KEY',
    baseURL: 'https://api.hustlesynth.space', // Optional
    timeout: 30000, // 30 seconds
    maxRetries: 3,
    defaultHeaders: {
        'X-Custom-Header': 'value'
    }
});</code></pre>
        
        <h2>Chat Completions</h2>
        
        <h3>Basic Usage</h3>
        <pre><code class="language-javascript">const completion = await client.chat.completions.create({
    model: 'gpt-4',
    messages: [
        {role: 'system', content: 'You are a helpful assistant.'},
        {role: 'user', content: 'Explain quantum computing.'}
    ],
    temperature: 0.7,
    max_tokens: 1000
});</code></pre>
        
        <h3>Streaming</h3>
        <pre><code class="language-javascript">const stream = await client.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{role: 'user', content: 'Tell me a story'}],
    stream: true
});

for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
        process.stdout.write(content);
    }
}</code></pre>
        
        <h3>With Functions</h3>
        <pre><code class="language-javascript">const completion = await client.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{role: 'user', content: 'What\'s the weather in NYC?'}],
    functions: [
        {
            name: 'get_weather',
            description: 'Get the current weather',
            parameters: {
                type: 'object',
                properties: {
                    location: {
                        type: 'string',
                        description: 'City name'
                    }
                },
                required: ['location']
            }
        }
    ]
});</code></pre>
        
        <h2>Error Handling</h2>
        
        <pre><code class="language-javascript">try {
    const completion = await client.chat.completions.create({
        model: 'gpt-4',
        messages: [{role: 'user', content: 'Hello'}]
    });
} catch (error) {
    if (error instanceof HustleSynth.APIError) {
        console.error('API Error:', error.status, error.message);
    } else if (error instanceof HustleSynth.RateLimitError) {
        console.error('Rate limited:', error.retryAfter);
    } else if (error instanceof HustleSynth.AuthenticationError) {
        console.error('Auth failed:', error.message);
    } else {
        console.error('Unknown error:', error);
    }
}</code></pre>
        
        <h2>TypeScript Support</h2>
        
        <p>The SDK includes TypeScript definitions:</p>
        
        <pre><code class="language-typescript">import HustleSynth, { 
    ChatCompletionMessage,
    ChatCompletionResponse 
} from 'hustlesynth';

const client = new HustleSynth({
    apiKey: process.env.HUSTLESYNTH_API_KEY!
});

const messages: ChatCompletionMessage[] = [
    {role: 'user', content: 'Hello!'}
];

const completion: ChatCompletionResponse = await client.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages
});</code></pre>
        
        <h2>Advanced Features</h2>
        
        <h3>Retry Configuration</h3>
        <pre><code class="language-javascript">const client = new HustleSynth({
    apiKey: 'YOUR_API_KEY',
    retry: {
        maxRetries: 5,
        initialDelay: 1000,
        maxDelay: 30000,
        backoffFactor: 2
    }
});</code></pre>
        
        <h3>Custom HTTP Client</h3>
        <pre><code class="language-javascript">import axios from 'axios';

const client = new HustleSynth({
    apiKey: 'YOUR_API_KEY',
    httpClient: axios
});</code></pre>
        
        <h3>Request Interceptors</h3>
        <pre><code class="language-javascript">client.interceptors.request.use((config) => {
    console.log('Request:', config);
    return config;
});

client.interceptors.response.use((response) => {
    console.log('Response:', response);
    return response;
});</code></pre>
        
        <h2>Usage Examples</h2>
        
        <h3>Conversation Management</h3>
        <pre><code class="language-javascript">class Conversation {
    constructor(client, model = 'gpt-3.5-turbo') {
        this.client = client;
        this.model = model;
        this.messages = [];
    }
    
    async send(content) {
        this.messages.push({role: 'user', content});
        
        const completion = await this.client.chat.completions.create({
            model: this.model,
            messages: this.messages
        });
        
        const reply = completion.choices[0].message;
        this.messages.push(reply);
        
        return reply.content;
    }
    
    clear() {
        this.messages = [];
    }
}

// Usage
const conversation = new Conversation(client);
const response1 = await conversation.send('What is AI?');
const response2 = await conversation.send('Can you elaborate?');</code></pre>
        
        <h3>Parallel Requests</h3>
        <pre><code class="language-javascript">const prompts = [
    'Translate to French: Hello',
    'Translate to Spanish: Hello',
    'Translate to German: Hello'
];

const translations = await Promise.all(
    prompts.map(prompt => 
        client.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{role: 'user', content: prompt}],
            max_tokens: 50
        })
    )
);

translations.forEach((completion, i) => {
    console.log(\`\${prompts[i]} -> \${completion.choices[0].message.content}\`);
});</code></pre>
        
        <h2>Browser Usage</h2>
        
        <div class="alert alert-warning">
            <strong>Security Note:</strong> Never expose your API key in client-side code. Use a backend proxy for production applications.
        </div>
        
        <pre><code class="language-html">&lt;!-- For development/testing only --&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/hustlesynth@latest"&gt;&lt;/script&gt;
&lt;script&gt;
    const client = new HustleSynth({
        apiKey: 'YOUR_API_KEY' // Use backend proxy in production!
    });
    
    async function chat(message) {
        const completion = await client.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{role: 'user', content: message}]
        });
        
        return completion.choices[0].message.content;
    }
&lt;/script&gt;</code></pre>
        
        <h2>API Reference</h2>
        
        <p>Full SDK documentation is available at <a href="https://github.com/HustleSynth/hustlesynth-js" target="_blank">GitHub</a>.</p>
    `;
}

function getPythonSDKContent() {
    return `
        <h1>Python SDK</h1>
        
        <p>The official HustleSynth Python SDK provides a pythonic interface for interacting with our API.</p>
        
        <h2>Installation</h2>
        
        <pre><code class="language-bash">pip install hustlesynth</code></pre>
        
        <h2>Quick Start</h2>
        
        <pre><code class="language-python">from hustlesynth import HustleSynth

client = HustleSynth(api_key="YOUR_API_KEY")

# Simple chat completion
completion = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "user", "content": "Hello!"}
    ]
)

print(completion.choices[0].message.content)</code></pre>
        
        <h2>Configuration</h2>
        
        <pre><code class="language-python">from hustlesynth import HustleSynth

client = HustleSynth(
    api_key="YOUR_API_KEY",
    base_url="https://api.hustlesynth.space",  # Optional
    timeout=30.0,
    max_retries=3,
    default_headers={
        "X-Custom-Header": "value"
    }
)</code></pre>
        
        <h2>Environment Variables</h2>
        
        <p>The SDK automatically reads from environment variables:</p>
        
        <pre><code class="language-python">import os
os.environ["HUSTLESYNTH_API_KEY"] = "YOUR_API_KEY"

from hustlesynth import HustleSynth
client = HustleSynth()  # Uses env var automatically</code></pre>
        
        <h2>Chat Completions</h2>
        
        <h3>Basic Usage</h3>
        <pre><code class="language-python">completion = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Explain quantum computing."}
    ],
    temperature=0.7,
    max_tokens=1000
)

print(completion.choices[0].message.content)</code></pre>
        
        <h3>Streaming</h3>
        <pre><code class="language-python">stream = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[{"role": "user", "content": "Tell me a story"}],
    stream=True
)

for chunk in stream:
    content = chunk.choices[0].delta.content
    if content:
        print(content, end="", flush=True)</code></pre>
        
        <h3>Async Support</h3>
        <pre><code class="language-python">import asyncio
from hustlesynth import AsyncHustleSynth

async def main():
    client = AsyncHustleSynth(api_key="YOUR_API_KEY")
    
    completion = await client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": "Hello!"}]
    )
    
    print(completion.choices[0].message.content)

asyncio.run(main())</code></pre>
        
        <h2>Error Handling</h2>
        
        <pre><code class="language-python">from hustlesynth import HustleSynth
from hustlesynth.errors import (
    APIError,
    RateLimitError,
    AuthenticationError
)

client = HustleSynth(api_key="YOUR_API_KEY")

try:
    completion = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": "Hello"}]
    )
except RateLimitError as e:
    print(f"Rate limited. Retry after {e.retry_after} seconds")
except AuthenticationError as e:
    print(f"Authentication failed: {e}")
except APIError as e:
    print(f"API error: {e.status_code} - {e.message}")
except Exception as e:
    print(f"Unexpected error: {e}")</code></pre>
        
        <h2>Advanced Usage</h2>
        
        <h3>Context Manager</h3>
        <pre><code class="language-python">from hustlesynth import HustleSynth

with HustleSynth(api_key="YOUR_API_KEY") as client:
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": "Hello!"}]
    )
    print(completion.choices[0].message.content)</code></pre>
        
        <h3>Custom Session</h3>
        <pre><code class="language-python">import httpx
from hustlesynth import HustleSynth

# Use custom httpx client
http_client = httpx.Client(
    timeout=60.0,
    headers={"User-Agent": "MyApp/1.0"}
)

client = HustleSynth(
    api_key="YOUR_API_KEY",
    http_client=http_client
)</code></pre>
        
        <h3>Logging</h3>
        <pre><code class="language-python">import logging
from hustlesynth import HustleSynth

# Enable debug logging
logging.basicConfig(level=logging.DEBUG)

client = HustleSynth(api_key="YOUR_API_KEY")</code></pre>
        
        <h2>Usage Examples</h2>
        
        <h3>Conversation Class</h3>
        <pre><code class="language-python">class Conversation:
    def __init__(self, client, model="gpt-3.5-turbo"):
        self.client = client
        self.model = model
        self.messages = []
    
    def send(self, content):
        self.messages.append({"role": "user", "content": content})
        
        completion = self.client.chat.completions.create(
            model=self.model,
            messages=self.messages
        )
        
        reply = completion.choices[0].message
        self.messages.append(reply.dict())
        
        return reply.content
    
    def clear(self):
        self.messages = []

# Usage
conversation = Conversation(client)
response1 = conversation.send("What is AI?")
response2 = conversation.send("Can you elaborate?")</code></pre>
        
        <h3>Batch Processing</h3>
        <pre><code class="language-python">import concurrent.futures
from hustlesynth import HustleSynth

client = HustleSynth(api_key="YOUR_API_KEY")

prompts = [
    "Translate to French: Hello",
    "Translate to Spanish: Hello",
    "Translate to German: Hello"
]

def translate(prompt):
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=50
    )
    return completion.choices[0].message.content

# Parallel execution
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
    results = list(executor.map(translate, prompts))
    
for prompt, result in zip(prompts, results):
    print(f"{prompt} -> {result}")</code></pre>
        
        <h3>Retry with Backoff</h3>
        <pre><code class="language-python">import time
from hustlesynth import HustleSynth
from hustlesynth.errors import RateLimitError

def chat_with_retry(client, messages, max_retries=3):
    for attempt in range(max_retries):
        try:
            return client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages
            )
        except RateLimitError as e:
            if attempt == max_retries - 1:
                raise
            wait_time = e.retry_after or (2 ** attempt)
            print(f"Rate limited. Waiting {wait_time}s...")
            time.sleep(wait_time)
    
    raise Exception("Max retries exceeded")</code></pre>
        
        <h2>Type Hints</h2>
        
        <pre><code class="language-python">from typing import List, Dict, Any
from hustlesynth import HustleSynth
from hustlesynth.types import ChatCompletionMessage, ChatCompletionResponse

def create_chat_completion(
    client: HustleSynth,
    messages: List[ChatCompletionMessage],
    model: str = "gpt-3.5-turbo"
) -> ChatCompletionResponse:
    return client.chat.completions.create(
        model=model,
        messages=messages
    )</code></pre>
        
        <h2>API Reference</h2>
        
        <p>Full SDK documentation is available at <a href="https://github.com/HustleSynth/hustlesynth-python" target="_blank">GitHub</a>.</p>
    `;
}

function getRESTAPIContent() {
    return `
        <h1>REST API</h1>
        
        <p>The HustleSynth REST API can be used directly with any HTTP client. This guide covers making direct API calls without using our SDKs.</p>
        
        <h2>Base URL</h2>
        
        <pre><code>https://api.hustlesynth.space</code></pre>
        
        <h2>Authentication</h2>
        
        <p>Include your API key in the Authorization header:</p>
        
        <pre><code>Authorization: Bearer YOUR_API_KEY</code></pre>
        
        <h2>Content Type</h2>
        
        <p>All requests must include:</p>
        
        <pre><code>Content-Type: application/json</code></pre>
        
        <h2>cURL Examples</h2>
        
        <h3>Basic Chat Completion</h3>
        <pre><code class="language-bash">curl https://api.hustlesynth.space/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [
      {
        "role": "user",
        "content": "Hello, how are you?"
      }
    ]
  }'</code></pre>
        
        <h3>With Parameters</h3>
        <pre><code class="language-bash">curl https://api.hustlesynth.space/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4",
    "messages": [
      {
        "role": "system",
        "content": "You are a helpful coding assistant."
      },
      {
        "role": "user",
        "content": "Write a Python function to calculate fibonacci"
      }
    ],
    "temperature": 0.7,
    "max_tokens": 500,
    "top_p": 0.9
  }'</code></pre>
        
        <h3>Streaming Response</h3>
        <pre><code class="language-bash">curl https://api.hustlesynth.space/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -H "Accept: text/event-stream" \\
  -N \\
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "Tell me a joke"}],
    "stream": true
  }'</code></pre>
        
        <h2>HTTP Client Examples</h2>
        
        <h3>Python (requests)</h3>
        <pre><code class="language-python">import requests
import json

url = "https://api.hustlesynth.space/v1/chat/completions"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}

data = {
    "model": "gpt-3.5-turbo",
    "messages": [
        {"role": "user", "content": "What is the meaning of life?"}
    ]
}

response = requests.post(url, headers=headers, json=data)
result = response.json()

print(result["choices"][0]["message"]["content"])</code></pre>
        
        <h3>JavaScript (fetch)</h3>
        <pre><code class="language-javascript">const response = await fetch('https://api.hustlesynth.space/v1/chat/completions', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
            {role: 'user', content: 'What is the meaning of life?'}
        ]
    })
});

const data = await response.json();
console.log(data.choices[0].message.content);</code></pre>
        
        <h3>PHP</h3>
        <pre><code class="language-php">$api_key = 'YOUR_API_KEY';
$url = 'https://api.hustlesynth.space/v1/chat/completions';

$data = [
    'model' => 'gpt-3.5-turbo',
    'messages' => [
        ['role' => 'user', 'content' => 'What is the meaning of life?']
    ]
];

$options = [
    'http' => [
        'header' => [
            "Authorization: Bearer $api_key",
            "Content-Type: application/json"
        ],
        'method' => 'POST',
        'content' => json_encode($data)
    ]
];

$context = stream_context_create($options);
$result = file_get_contents($url, false, $context);
$response = json_decode($result, true);

echo $response['choices'][0]['message']['content'];</code></pre>
        
        <h3>Ruby</h3>
        <pre><code class="language-ruby">require 'net/http'
require 'json'
require 'uri'

uri = URI('https://api.hustlesynth.space/v1/chat/completions')
http = Net::HTTP.new(uri.host, uri.port)
http.use_ssl = true

request = Net::HTTP::Post.new(uri)
request['Authorization'] = 'Bearer YOUR_API_KEY'
request['Content-Type'] = 'application/json'

request.body = {
  model: 'gpt-3.5-turbo',
  messages: [
    {role: 'user', content: 'What is the meaning of life?'}
  ]
}.to_json

response = http.request(request)
result = JSON.parse(response.body)

puts result['choices'][0]['message']['content']</code></pre>
        
        <h2>Handling Responses</h2>
        
        <h3>Success Response (200)</h3>
        <pre><code class="language-json">{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "created": 1677858242,
  "model": "gpt-3.5-turbo",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "The meaning of life is subjective and varies from person to person..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 13,
    "completion_tokens": 85,
    "total_tokens": 98
  }
}</code></pre>
        
        <h3>Error Response (4xx/5xx)</h3>
        <pre><code class="language-json">{
  "error": {
    "message": "Invalid API key provided",
    "type": "authentication_error",
    "code": "invalid_api_key"
  }
}</code></pre>
        
        <h2>Common Headers</h2>
        
        <table class="api-table">
            <thead>
                <tr>
                    <th>Header</th>
                    <th>Description</th>
                    <th>Example</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>X-Request-ID</td>
                    <td>Unique request identifier</td>
                    <td>req_abc123xyz</td>
                </tr>
                <tr>
                    <td>X-RateLimit-Limit</td>
                    <td>Rate limit maximum</td>
                    <td>60</td>
                </tr>
                <tr>
                    <td>X-RateLimit-Remaining</td>
                    <td>Remaining requests</td>
                    <td>59</td>
                </tr>
                <tr>
                    <td>X-RateLimit-Reset</td>
                    <td>Reset timestamp</td>
                    <td>1677858242</td>
                </tr>
            </tbody>
        </table>
        
        <h2>Best Practices</h2>
        
        <ul>
            <li><strong>Use HTTPS</strong>: Always use HTTPS for security</li>
            <li><strong>Handle Errors</strong>: Check status codes and handle errors gracefully</li>
            <li><strong>Respect Rate Limits</strong>: Monitor rate limit headers</li>
            <li><strong>Set Timeouts</strong>: Configure appropriate request timeouts</li>
            <li><strong>Log Requests</strong>: Keep logs for debugging (exclude API keys)</li>
        </ul>
    `;
}

function getExamplesContent() {
    return `
        <h1>Examples</h1>
        
        <p>Real-world examples of using the HustleSynth API for various use cases.</p>
        
        <h2>Chatbot Implementation</h2>
        
        <h3>Simple Chatbot</h3>
        <pre><code class="language-javascript">class Chatbot {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.conversation = [];
    }
    
    async chat(userMessage) {
        // Add user message to conversation
        this.conversation.push({
            role: 'user',
            content: userMessage
        });
        
        // Make API call
        const response = await fetch('https://api.hustlesynth.space/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': \`Bearer \${this.apiKey}\`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: this.conversation,
                temperature: 0.7
            })
        });
        
        const data = await response.json();
        const assistantMessage = data.choices[0].message;
        
        // Add assistant response to conversation
        this.conversation.push(assistantMessage);
        
        return assistantMessage.content;
    }
    
    reset() {
        this.conversation = [];
    }
}

// Usage
const bot = new Chatbot('YOUR_API_KEY');
const response = await bot.chat('What is the weather like?');
console.log(response);</code></pre>
        
        <h2>Content Generation</h2>
        
        <h3>Blog Post Generator</h3>
        <pre><code class="language-python">async def generate_blog_post(topic, style="professional"):
    system_prompt = f"""You are a {style} blog writer. 
    Create engaging, well-structured blog posts with:
    - Compelling introduction
    - Clear sections with headers
    - Practical examples
    - Strong conclusion
    """
    
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Write a blog post about: {topic}"}
        ],
        temperature=0.8,
        max_tokens=2000
    )
    
    return response.choices[0].message.content

# Generate blog post
post = await generate_blog_post(
    "The Future of Remote Work",
    style="conversational"
)
print(post)</code></pre>
        
        <h3>Product Description Writer</h3>
        <pre><code class="language-javascript">async function generateProductDescription(product) {
    const prompt = \`Write a compelling product description for:
    
    Product: \${product.name}
    Category: \${product.category}
    Key Features: \${product.features.join(', ')}
    Target Audience: \${product.audience}
    
    Make it engaging, highlight benefits, and include a call to action.\`;
    
    const response = await client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: 'system',
                content: 'You are an expert e-commerce copywriter.'
            },
            {
                role: 'user',
                content: prompt
            }
        ],
        temperature: 0.7,
        max_tokens: 300
    });
    
    return response.choices[0].message.content;
}

// Example usage
const description = await generateProductDescription({
    name: 'Smart Fitness Tracker Pro',
    category: 'Wearable Technology',
    features: ['Heart rate monitoring', 'Sleep tracking', '30-day battery'],
    audience: 'Health-conscious professionals'
});</code></pre>
        
        <h2>Code Assistant</h2>
        
        <h3>Code Review Bot</h3>
        <pre><code class="language-python">def review_code(code, language="python"):
    prompt = f"""Review this {language} code for:
    1. Potential bugs
    2. Performance issues
    3. Security vulnerabilities
    4. Code style improvements
    5. Best practices
    
    Code:
    ```{language}
    {code}
    ```
    
    Provide specific suggestions with examples."""
    
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {
                "role": "system", 
                "content": "You are an expert code reviewer with deep knowledge of software engineering best practices."
            },
            {"role": "user", "content": prompt}
        ],
        temperature=0.3,
        max_tokens=1000
    )
    
    return response.choices[0].message.content

# Example
code_to_review = """
def calculate_average(numbers):
    sum = 0
    for i in range(len(numbers)):
        sum = sum + numbers[i]
    average = sum / len(numbers)
    return average
"""

review = review_code(code_to_review)
print(review)</code></pre>
        
        <h3>Unit Test Generator</h3>
        <pre><code class="language-javascript">async function generateUnitTests(functionCode, language = 'javascript') {
    const response = await client.chat.completions.create({
        model: 'gpt-4',
        messages: [
            {
                role: 'system',
                content: \`You are an expert at writing comprehensive unit tests in \${language}.\`
            },
            {
                role: 'user',
                content: \`Generate unit tests for this function:
                
\\\`\\\`\\\`\${language}
\${functionCode}
\\\`\\\`\\\`

Include edge cases, error handling, and both positive and negative test cases.\`
            }
        ],
        temperature: 0.3
    });
    
    return response.choices[0].message.content;
}</code></pre>
        
        <h2>Data Analysis</h2>
        
        <h3>Data Insights Generator</h3>
        <pre><code class="language-python">def analyze_data(data_description, metrics):
    prompt = f"""Analyze this data and provide insights:
    
    Data: {data_description}
    Metrics: {', '.join(metrics)}
    
    Provide:
    1. Key findings
    2. Trends and patterns
    3. Actionable recommendations
    4. Potential concerns
    """
    
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {
                "role": "system",
                "content": "You are a data analyst expert at finding meaningful insights."
            },
            {"role": "user", "content": prompt}
        ],
        temperature=0.5
    )
    
    return response.choices[0].message.content

# Example
insights = analyze_data(
    "Monthly sales data for e-commerce platform Q1-Q4 2023",
    ["Total revenue: $2.4M", "Average order value: $67", "Conversion rate: 2.3%"]
)</code></pre>
        
        <h2>Translation Service</h2>
        
        <h3>Multi-language Translator</h3>
        <pre><code class="language-javascript">class Translator {
    constructor(client) {
        this.client = client;
        this.cache = new Map();
    }
    
    async translate(text, targetLanguage, sourceLanguage = 'auto') {
        // Check cache
        const cacheKey = \`\${text}-\${sourceLanguage}-\${targetLanguage}\`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        
        const prompt = sourceLanguage === 'auto' 
            ? \`Translate to \${targetLanguage}: "\${text}"\`
            : \`Translate from \${sourceLanguage} to \${targetLanguage}: "\${text}"\`;
        
        const response = await this.client.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'You are a professional translator. Provide only the translation without any explanation.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.3,
            max_tokens: 1000
        });
        
        const translation = response.choices[0].message.content.trim();
        
        // Cache result
        this.cache.set(cacheKey, translation);
        
        return translation;
    }
    
    async batchTranslate(texts, targetLanguage) {
        const translations = await Promise.all(
            texts.map(text => this.translate(text, targetLanguage))
        );
        return translations;
    }
}

// Usage
const translator = new Translator(client);
const translated = await translator.translate('Hello world', 'Spanish');
console.log(translated); // "Hola mundo"</code></pre>
        
        <h2>Customer Support</h2>
        
        <h3>Support Ticket Analyzer</h3>
        <pre><code class="language-python">async def analyze_support_ticket(ticket):
    response = await client.chat.completions.create(
        model="gpt-4",
        messages=[
            {
                "role": "system",
                "content": """You are a customer support analyst. Analyze support tickets and provide:
                1. Sentiment (positive/neutral/negative)
                2. Urgency level (low/medium/high/critical)
                3. Category (technical/billing/general/feature request)
                4. Suggested response template
                5. Escalation recommendation"""
            },
            {
                "role": "user",
                "content": f"Analyze this support ticket:\\n\\n{ticket}"
            }
        ],
        temperature=0.3
    )
    
    return response.choices[0].message.content

# Example
ticket = """
Subject: Payment not going through!!!
I've been trying to upgrade my account for 2 days now but my credit card 
keeps getting rejected. I've checked with my bank and there's no issue on 
their end. This is really frustrating as I need the pro features for a 
presentation tomorrow. Please help ASAP!
"""

analysis = await analyze_support_ticket(ticket)</code></pre>
        
        <h2>Educational Tools</h2>
        
        <h3>Quiz Generator</h3>
        <pre><code class="language-javascript">async function generateQuiz(topic, difficulty, numQuestions) {
    const response = await client.chat.completions.create({
        model: 'gpt-4',
        messages: [
            {
                role: 'system',
                content: 'You are an expert educator who creates engaging quizzes.'
            },
            {
                role: 'user',
                content: \`Create a \${difficulty} difficulty quiz about "\${topic}" with \${numQuestions} multiple choice questions. 

Format each question as:
Q1: [Question]
A) [Option]
B) [Option]
C) [Option]
D) [Option]
Correct: [Letter]
Explanation: [Why this answer is correct]\`
            }
        ],
        temperature: 0.7,
        max_tokens: 2000
    });
    
    return response.choices[0].message.content;
}

// Generate a quiz
const quiz = await generateQuiz('JavaScript Promises', 'intermediate', 5);
console.log(quiz);</code></pre>
        
        <h2>Creative Writing</h2>
        
        <h3>Story Continuation</h3>
        <pre><code class="language-python">def continue_story(story_so_far, style="mystery", length="medium"):
    length_tokens = {
        "short": 200,
        "medium": 500,
        "long": 1000
    }
    
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {
                "role": "system",
                "content": f"You are a creative writer specializing in {style} stories. Continue stories maintaining consistent tone, characters, and plot."
            },
            {
                "role": "user",
                "content": f"Continue this story:\\n\\n{story_so_far}"
            }
        ],
        temperature=0.8,
        max_tokens=length_tokens.get(length, 500)
    )
    
    return response.choices[0].message.content</code></pre>
        
        <h2>Best Practices Examples</h2>
        
        <ul>
            <li><strong>Error Handling</strong>: Always wrap API calls in try-catch blocks</li>
            <li><strong>Rate Limiting</strong>: Implement backoff strategies for high-volume applications</li>
            <li><strong>Caching</strong>: Cache responses for repeated queries</li>
            <li><strong>Streaming</strong>: Use streaming for long responses to improve UX</li>
            <li><strong>Token Optimization</strong>: Monitor and optimize token usage</li>
        </ul>
    `;
}

function getBestPracticesContent() {
    return `
        <h1>Best Practices</h1>
        
        <p>Follow these best practices to build robust, efficient, and secure applications with the HustleSynth API.</p>
        
        <h2>Security</h2>
        
        <h3>API Key Management</h3>
        <ul>
            <li><strong>Never expose keys in client-side code</strong></li>
            <li><strong>Use environment variables</strong> for storing keys</li>
            <li><strong>Rotate keys regularly</strong>, especially after employee departures</li>
            <li><strong>Use different keys</strong> for development, staging, and production</li>
            <li><strong>Implement key restrictions</strong> (IP whitelist, rate limits)</li>
        </ul>
        
        <pre><code class="language-javascript">// Good: Using environment variables
const apiKey = process.env.HUSTLESYNTH_API_KEY;

// Bad: Hardcoding keys
const apiKey = "sk-1234567890abcdef"; // Never do this!</code></pre>
        
        <h3>Backend Proxy Pattern</h3>
        <p>For client applications, always use a backend proxy:</p>
        
        <pre><code class="language-javascript">// Backend API route
app.post('/api/chat', authenticate, async (req, res) => {
    const response = await fetch('https://api.hustlesynth.space/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': \`Bearer \${process.env.HUSTLESYNTH_API_KEY}\`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: req.body.messages
        })
    });
    
    const data = await response.json();
    res.json(data);
});

// Frontend
async function chat(message) {
    const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Authorization': \`Bearer \${userToken}\`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages: [{ role: 'user', content: message }] })
    });
    
    return response.json();
}</code></pre>
        
        <h2>Performance Optimization</h2>
        
        <h3>Response Caching</h3>
        <pre><code class="language-python">import hashlib
import json
from functools import lru_cache
import redis

# Redis cache for production
cache = redis.Redis(host='localhost', port=6379, db=0)

def cache_key(model, messages, **kwargs):
    # Create unique cache key
    content = json.dumps({
        'model': model,
        'messages': messages,
        **kwargs
    }, sort_keys=True)
    return hashlib.md5(content.encode()).hexdigest()

async def cached_completion(model, messages, **kwargs):
    key = cache_key(model, messages, **kwargs)
    
    # Check cache
    cached = cache.get(key)
    if cached:
        return json.loads(cached)
    
    # Make API call
    response = await client.chat.completions.create(
        model=model,
        messages=messages,
        **kwargs
    )
    
    # Cache response (1 hour TTL)
    cache.setex(key, 3600, json.dumps(response.dict()))
    
    return response</code></pre>
        
        <h3>Batch Processing</h3>
        <pre><code class="language-javascript">class BatchProcessor {
    constructor(client, batchSize = 10, delayMs = 1000) {
        this.client = client;
        this.batchSize = batchSize;
        this.delayMs = delayMs;
    }
    
    async processBatch(items, processFunc) {
        const results = [];
        
        for (let i = 0; i < items.length; i += this.batchSize) {
            const batch = items.slice(i, i + this.batchSize);
            
            // Process batch in parallel
            const batchResults = await Promise.all(
                batch.map(item => processFunc(item))
            );
            
            results.push(...batchResults);
            
            // Rate limiting delay
            if (i + this.batchSize < items.length) {
                await new Promise(resolve => setTimeout(resolve, this.delayMs));
            }
        }
        
        return results;
    }
}</code></pre>
        
        <h3>Token Optimization</h3>
        <pre><code class="language-python">def optimize_prompt(prompt, max_length=1000):
    """Optimize prompt to reduce token usage"""
    
    # Remove excess whitespace
    prompt = ' '.join(prompt.split())
    
    # Truncate if too long
    if len(prompt) > max_length:
        prompt = prompt[:max_length] + "..."
    
    return prompt

def estimate_tokens(text):
    """Rough token estimation (1 token ≈ 4 characters)"""
    return len(text) // 4

def optimize_conversation_history(messages, max_tokens=2000):
    """Keep conversation history within token limits"""
    total_tokens = 0
    optimized = []
    
    # Keep system message and iterate from newest
    if messages and messages[0]['role'] == 'system':
        optimized.append(messages[0])
        messages = messages[1:]
    
    # Add messages from newest to oldest
    for message in reversed(messages):
        tokens = estimate_tokens(message['content'])
        if total_tokens + tokens > max_tokens:
            break
        optimized.insert(0, message)
        total_tokens += tokens
    
    return optimized</code></pre>
        
        <h2>Error Handling</h2>
        
        <h3>Comprehensive Error Handling</h3>
        <pre><code class="language-javascript">class APIClient {
    constructor(apiKey, options = {}) {
        this.apiKey = apiKey;
        this.maxRetries = options.maxRetries || 3;
        this.timeout = options.timeout || 30000;
    }
    
    async makeRequest(endpoint, data, retries = 0) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);
            
            const response = await fetch(\`https://api.hustlesynth.space\${endpoint}\`, {
                method: 'POST',
                headers: {
                    'Authorization': \`Bearer \${this.apiKey}\`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                const error = await response.json();
                throw new APIError(response.status, error);
            }
            
            return await response.json();
            
        } catch (error) {
            // Handle different error types
            if (error.name === 'AbortError') {
                throw new TimeoutError('Request timed out');
            }
            
            if (error instanceof APIError) {
                // Rate limit - retry with backoff
                if (error.status === 429 && retries < this.maxRetries) {
                    const delay = Math.pow(2, retries) * 1000;
                    await new Promise(resolve => setTimeout(resolve, delay));
                    return this.makeRequest(endpoint, data, retries + 1);
                }
                
                // Other API errors
                throw error;
            }
            
            // Network errors - retry
            if (retries < this.maxRetries) {
                const delay = Math.pow(2, retries) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
                return this.makeRequest(endpoint, data, retries + 1);
            }
            
            throw new NetworkError('Network request failed');
        }
    }
}

class APIError extends Error {
    constructor(status, error) {
        super(error.error?.message || 'API Error');
        this.status = status;
        this.type = error.error?.type;
        this.code = error.error?.code;
    }
}

class TimeoutError extends Error {}
class NetworkError extends Error {}</code></pre>
        
        <h2>Monitoring & Logging</h2>
        
        <h3>Request Logging</h3>
        <pre><code class="language-python">import logging
import time
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('hustlesynth')

class MonitoredClient:
    def __init__(self, client):
        self.client = client
        self.metrics = {
            'total_requests': 0,
            'total_tokens': 0,
            'total_cost': 0,
            'errors': 0
        }
    
    async def chat_completion(self, **kwargs):
        start_time = time.time()
        request_id = f"req_{int(time.time() * 1000)}"
        
        logger.info(f"Request {request_id} started - Model: {kwargs.get('model')}")
        
        try:
            response = await self.client.chat.completions.create(**kwargs)
            
            # Log success
            duration = time.time() - start_time
            tokens = response.usage.total_tokens
            
            logger.info(f"Request {request_id} completed - Duration: {duration:.2f}s, Tokens: {tokens}")
            
            # Update metrics
            self.metrics['total_requests'] += 1
            self.metrics['total_tokens'] += tokens
            
            return response
            
        except Exception as e:
            # Log error
            duration = time.time() - start_time
            logger.error(f"Request {request_id} failed - Duration: {duration:.2f}s, Error: {str(e)}")
            
            self.metrics['errors'] += 1
            raise
    
    def get_metrics(self):
        return self.metrics</code></pre>
        
        <h2>Cost Management</h2>
        
        <h3>Budget Controls</h3>
        <pre><code class="language-javascript">class BudgetManager {
    constructor(monthlyBudget) {
        this.monthlyBudget = monthlyBudget;
        this.currentSpend = 0;
        this.resetDate = new Date();
        this.resetDate.setMonth(this.resetDate.getMonth() + 1, 1);
    }
    
    calculateCost(model, tokens) {
        // Pricing per 1K tokens (example rates)
        const pricing = {
            'gpt-3.5-turbo': { input: 0.0015, output: 0.002 },
            'gpt-4': { input: 0.03, output: 0.06 },
            'claude-3-sonnet': { input: 0.003, output: 0.015 }
        };
        
        const modelPricing = pricing[model] || pricing['gpt-3.5-turbo'];
        // Simplified: assuming 50/50 input/output ratio
        const avgPrice = (modelPricing.input + modelPricing.output) / 2;
        
        return (tokens / 1000) * avgPrice;
    }
    
    async checkBudget(model, estimatedTokens) {
        // Reset if new month
        if (new Date() >= this.resetDate) {
            this.currentSpend = 0;
            this.resetDate.setMonth(this.resetDate.getMonth() + 1);
        }
        
        const estimatedCost = this.calculateCost(model, estimatedTokens);
        
        if (this.currentSpend + estimatedCost > this.monthlyBudget) {
            throw new Error(\`Budget exceeded. Current: $\${this.currentSpend.toFixed(2)}, Budget: $\${this.monthlyBudget}\`);
        }
        
        return true;
    }
    
    recordUsage(model, actualTokens) {
        const cost = this.calculateCost(model, actualTokens);
        this.currentSpend += cost;
        
        return {
            cost,
            totalSpend: this.currentSpend,
            remainingBudget: this.monthlyBudget - this.currentSpend,
            percentUsed: (this.currentSpend / this.monthlyBudget) * 100
        };
    }
}</code></pre>
        
        <h2>Testing Strategies</h2>
        
        <h3>Mock Responses for Testing</h3>
        <pre><code class="language-python">class MockHustleSynth:
    """Mock client for testing without API calls"""
    
    def __init__(self, responses=None):
        self.responses = responses or {}
        self.call_history = []
    
    async def create_chat_completion(self, **kwargs):
        # Record call
        self.call_history.append(kwargs)
        
        # Return mock response
        model = kwargs.get('model', 'gpt-3.5-turbo')
        messages = kwargs.get('messages', [])
        
        if model in self.responses:
            return self.responses[model]
        
        # Default mock response
        return {
            'id': 'mock-123',
            'choices': [{
                'message': {
                    'role': 'assistant',
                    'content': 'Mock response for testing'
                },
                'finish_reason': 'stop'
            }],
            'usage': {
                'prompt_tokens': 10,
                'completion_tokens': 10,
                'total_tokens': 20
            }
        }

# Usage in tests
def test_chatbot():
    mock_client = MockHustleSynth({
        'gpt-3.5-turbo': {
            'choices': [{
                'message': {
                    'content': 'Hello! I am a mock assistant.'
                }
            }]
        }
    })
    
    chatbot = Chatbot(mock_client)
    response = await chatbot.chat("Hello")
    
    assert response == "Hello! I am a mock assistant."
    assert len(mock_client.call_history) == 1</code></pre>
        
        <h2>Production Checklist</h2>
        
        <ul>
            <li>✅ API keys stored securely in environment variables</li>
            <li>✅ Error handling implemented with retries</li>
            <li>✅ Rate limiting respected with backoff</li>
            <li>✅ Monitoring and logging in place</li>
            <li>✅ Budget controls implemented</li>
            <li>✅ Response caching where appropriate</li>
            <li>✅ Token usage optimized</li>
            <li>✅ Timeout handling configured</li>
            <li>✅ Health checks for API availability</li>
            <li>✅ Graceful degradation for API failures</li>
        </ul>
    `;
}

function getTroubleshootingContent() {
    return `
        <h1>Troubleshooting</h1>
        
        <p>Common issues and their solutions when working with the HustleSynth API.</p>
        
        <h2>Authentication Errors</h2>
        
        <h3>Invalid API Key</h3>
        <div class="troubleshooting-item">
            <strong>Error:</strong>
            <pre><code class="language-json">{
    "error": {
        "message": "Invalid API key provided",
        "type": "authentication_error",
        "code": "invalid_api_key"
    }
}</code></pre>
            
            <strong>Solutions:</strong>
            <ul>
                <li>Verify your API key is correct and complete</li>
                <li>Check for extra spaces or hidden characters</li>
                <li>Ensure you're using the correct environment's key</li>
                <li>Regenerate the key if necessary</li>
            </ul>
        </div>
        
        <h3>Missing Authorization Header</h3>
        <div class="troubleshooting-item">
            <strong>Error:</strong> 401 Unauthorized
            
            <strong>Solution:</strong>
            <pre><code class="language-javascript">// Correct format
headers: {
    'Authorization': 'Bearer YOUR_API_KEY',  // Note the space after "Bearer"
    'Content-Type': 'application/json'
}</code></pre>
        </div>
        
        <h2>Rate Limiting</h2>
        
        <h3>Rate Limit Exceeded</h3>
        <div class="troubleshooting-item">
            <strong>Error:</strong>
            <pre><code class="language-json">{
    "error": {
        "message": "Rate limit exceeded. Please retry after 60 seconds.",
        "type": "rate_limit_error",
        "code": "rate_limit_exceeded"
    }
}</code></pre>
            
            <strong>Solutions:</strong>
            <ul>
                <li>Implement exponential backoff</li>
                <li>Check rate limit headers</li>
                <li>Reduce request frequency</li>
                <li>Upgrade your plan for higher limits</li>
            </ul>
            
            <strong>Example Implementation:</strong>
            <pre><code class="language-python">import time

def make_request_with_retry(func, max_retries=3):
    for attempt in range(max_retries):
        try:
            return func()
        except RateLimitError as e:
            if attempt == max_retries - 1:
                raise
            
            # Get retry delay from header or use exponential backoff
            retry_after = e.retry_after or (2 ** attempt)
            print(f"Rate limited. Retrying in {retry_after} seconds...")
            time.sleep(retry_after)</code></pre>
        </div>
        
        <h2>Model Errors</h2>
        
        <h3>Model Not Found</h3>
        <div class="troubleshooting-item">
            <strong>Error:</strong> "The model 'gpt-5' does not exist"
            
            <strong>Solutions:</strong>
            <ul>
                <li>Check available models in documentation</li>
                <li>Verify model ID spelling</li>
                <li>Ensure your plan includes the model</li>
                <li>Check if the model needs activation</li>
            </ul>
        </div>
        
        <h3>Context Length Exceeded</h3>
        <div class="troubleshooting-item">
            <strong>Error:</strong> "This model's maximum context length is 4096 tokens"
            
            <strong>Solutions:</strong>
            <ul>
                <li>Reduce prompt length</li>
                <li>Truncate conversation history</li>
                <li>Use a model with larger context window</li>
                <li>Implement sliding window for conversations</li>
            </ul>
            
            <pre><code class="language-javascript">function truncateMessages(messages, maxTokens = 3000) {
    let totalTokens = 0;
    const truncated = [];
    
    // Keep messages from newest to oldest
    for (let i = messages.length - 1; i >= 0; i--) {
        const tokens = estimateTokens(messages[i].content);
        if (totalTokens + tokens > maxTokens) break;
        
        truncated.unshift(messages[i]);
        totalTokens += tokens;
    }
    
    return truncated;
}</code></pre>
        </div>
        
        <h2>Response Issues</h2>
        
        <h3>Incomplete Responses</h3>
        <div class="troubleshooting-item">
            <strong>Issue:</strong> Response cuts off mid-sentence
            
            <strong>Solutions:</strong>
            <ul>
                <li>Increase max_tokens parameter</li>
                <li>Check finish_reason in response</li>
                <li>Handle continuation if needed</li>
            </ul>
            
            <pre><code class="language-python">response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=messages,
    max_tokens=1000  # Increase this value
)

# Check why the response ended
finish_reason = response.choices[0].finish_reason
if finish_reason == "length":
    print("Response was truncated due to max_tokens limit")</code></pre>
        </div>
        
        <h3>Streaming Connection Drops</h3>
        <div class="troubleshooting-item">
            <strong>Issue:</strong> SSE connection closes unexpectedly
            
            <strong>Solutions:</strong>
            <ul>
                <li>Implement reconnection logic</li>
                <li>Handle partial responses</li>
                <li>Set appropriate timeouts</li>
            </ul>
        </div>
        
        <h2>Performance Issues</h2>
        
        <h3>Slow Response Times</h3>
        <div class="troubleshooting-item">
            <strong>Common Causes:</strong>
            <ul>
                <li>Large model (GPT-4) takes longer</li>
                <li>High max_tokens value</li>
                <li>Complex prompts</li>
                <li>Network latency</li>
            </ul>
            
            <strong>Solutions:</strong>
            <ul>
                <li>Use streaming for better UX</li>
                <li>Choose appropriate model for task</li>
                <li>Optimize prompt length</li>
                <li>Implement caching</li>
            </ul>
        </div>
        
        <h3>High Token Usage</h3>
        <div class="troubleshooting-item">
            <strong>Optimization Strategies:</strong>
            <pre><code class="language-python"># 1. Compress prompts
def compress_prompt(text):
    # Remove unnecessary whitespace
    text = ' '.join(text.split())
    # Remove redundant information
    # Use abbreviations where appropriate
    return text

# 2. Use system messages efficiently
messages = [
    {"role": "system", "content": "Be concise."},  # Short system message
    {"role": "user", "content": compressed_prompt}
]

# 3. Clear conversation history periodically
if len(conversation) > 10:
    conversation = conversation[-5:]  # Keep last 5 exchanges</code></pre>
        </div>
        
        <h2>Integration Issues</h2>
        
        <h3>CORS Errors (Browser)</h3>
        <div class="troubleshooting-item">
            <strong>Error:</strong> "Access to fetch at 'api.hustlesynth.space' from origin 'localhost' has been blocked by CORS policy"
            
            <strong>Solution:</strong> Never call the API directly from browser. Use a backend proxy:
            <pre><code class="language-javascript">// Bad: Direct browser call
fetch('https://api.hustlesynth.space/v1/chat/completions', {...})

// Good: Backend proxy
fetch('/api/chat', {...})  // Your backend handles the API call</code></pre>
        </div>
        
        <h3>Timeout Errors</h3>
        <div class="troubleshooting-item">
            <strong>Solutions:</strong>
            <ul>
                <li>Increase client timeout settings</li>
                <li>Use streaming for long responses</li>
                <li>Implement retry logic</li>
            </ul>
            
            <pre><code class="language-javascript">// Set appropriate timeout
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 seconds

try {
    const response = await fetch(url, {
        ...options,
        signal: controller.signal
    });
    clearTimeout(timeoutId);
} catch (error) {
    if (error.name === 'AbortError') {
        console.log('Request timed out');
    }
}</code></pre>
        </div>
        
        <h2>Debugging Tips</h2>
        
        <h3>Enable Verbose Logging</h3>
        <pre><code class="language-python">import logging

# Enable debug logging
logging.basicConfig(level=logging.DEBUG)

# Log all requests
def log_request(request):
    logger.debug(f"API Request: {json.dumps(request, indent=2)}")
    
def log_response(response):
    logger.debug(f"API Response: {json.dumps(response, indent=2)}")</code></pre>
        
        <h3>Test with cURL</h3>
        <pre><code class="language-bash"># Test basic connectivity
curl -v https://api.hustlesynth.space/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"model":"gpt-3.5-turbo","messages":[{"role":"user","content":"test"}]}'</code></pre>
        
        <h3>Check API Status</h3>
        <p>Visit <a href="https://status.hustlesynth.space" target="_blank">status.hustlesynth.space</a> for real-time API status.</p>
        
        <h2>Getting Help</h2>
        
        <ul>
            <li><strong>Discord</strong>: <a href="https://discord.gg/hustlesynth" target="_blank">Join our community</a> for real-time help</li>
            <li><strong>Email</strong>: <a href="mailto:support@hustlesynth.space">support@hustlesynth.space</a></li>
            <li><strong>GitHub</strong>: <a href="https://github.com/HustleSynth/issues" target="_blank">Report issues</a></li>
        </ul>
    `;
}

function getChangelogContent() {
    return `
        <h1>Changelog</h1>
        
        <p>Stay up to date with the latest changes and improvements to the HustleSynth API.</p>
        
        <h2>November 2024</h2>
        
        <h3>v2.5.0 - November 15, 2024</h3>
        <div class="changelog-entry">
            <h4>🚀 New Features</h4>
            <ul>
                <li>Added support for Claude 3 Opus model</li>
                <li>Introduced batch processing endpoint for bulk operations</li>
                <li>New webhook events for usage alerts</li>
                <li>SDK support for TypeScript 5.0</li>
            </ul>
            
            <h4>💡 Improvements</h4>
            <ul>
                <li>Reduced latency by 30% for streaming responses</li>
                <li>Enhanced error messages with actionable suggestions</li>
                <li>Improved token counting accuracy</li>
                <li>Better handling of Unicode characters</li>
            </ul>
            
            <h4>🐛 Bug Fixes</h4>
            <ul>
                <li>Fixed streaming disconnection issues</li>
                <li>Resolved token counting discrepancies for special characters</li>
                <li>Fixed rate limit header parsing in Python SDK</li>
            </ul>
        </div>
        
        <h3>v2.4.0 - November 1, 2024</h3>
        <div class="changelog-entry">
            <h4>🚀 New Features</h4>
            <ul>
                <li>GPT-4 Turbo now available for all plans</li>
                <li>Image generation with DALL-E 3</li>
                <li>New /api/models endpoint to list available models</li>
            </ul>
            
            <h4>💡 Improvements</h4>
            <ul>
                <li>Increased rate limits for Pro plan users</li>
                <li>Added request ID to all responses</li>
                <li>Optimized database queries for faster dashboard loading</li>
            </ul>
        </div>
        
        <h2>October 2024</h2>
        
        <h3>v2.3.0 - October 15, 2024</h3>
        <div class="changelog-entry">
            <h4>🚀 New Features</h4>
            <ul>
                <li>Whisper API for speech-to-text</li>
                <li>TTS (Text-to-Speech) endpoints</li>
                <li>Function calling support for compatible models</li>
                <li>New dashboard analytics with usage trends</li>
            </ul>
            
            <h4>🔧 Breaking Changes</h4>
            <ul>
                <li>Deprecated /v1/engines endpoint (use /v1/models)</li>
                <li>Changed webhook payload format (see migration guide)</li>
            </ul>
        </div>
        
        <h2>September 2024</h2>
        
        <h3>v2.2.0 - September 20, 2024</h3>
        <div class="changelog-entry">
            <h4>🚀 New Features</h4>
            <ul>
                <li>Multiple API keys per account</li>
                <li>IP whitelisting for enhanced security</li>
                <li>Export usage data as CSV/JSON</li>
            </ul>
            
            <h4>💡 Improvements</h4>
            <ul>
                <li>2x faster response times for GPT-3.5</li>
                <li>Reduced SDK bundle size by 40%</li>
                <li>Better error recovery in streaming mode</li>
            </ul>
        </div>
        
        <h2>Deprecation Notices</h2>
        
        <div class="alert alert-warning">
            <h4>Upcoming Deprecations</h4>
            <ul>
                <li><strong>January 1, 2025</strong>: v1 API endpoints will be deprecated</li>
                <li><strong>February 1, 2025</strong>: Legacy authentication method will be removed</li>
            </ul>
        </div>
        
        <h2>Migration Guides</h2>
        
        <h3>Webhook Format Migration (v2.2 → v2.3)</h3>
        <pre><code class="language-javascript">// Old format
{
    "event": "request.completed",
    "data": {...}
}

// New format
{
    "id": "evt_123",
    "type": "request.success",
    "created": 1234567890,
    "data": {...}
}</code></pre>
        
        <h2>Version Support</h2>
        
        <table class="version-table">
            <thead>
                <tr>
                    <th>Version</th>
                    <th>Status</th>
                    <th>Support Until</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>v2.5.x</td>
                    <td><span class="badge badge-success">Current</span></td>
                    <td>Active</td>
                </tr>
                <tr>
                    <td>v2.4.x</td>
                    <td><span class="badge badge-warning">Maintenance</span></td>
                    <td>May 2025</td>
                </tr>
                <tr>
                    <td>v2.3.x</td>
                    <td><span class="badge badge-warning">Maintenance</span></td>
                    <td>March 2025</td>
                </tr>
                <tr>
                    <td>v2.2.x</td>
                    <td><span class="badge badge-danger">Deprecated</span></td>
                    <td>January 2025</td>
                </tr>
            </tbody>
        </table>
        
        <h2>Subscribe to Updates</h2>
        
        <p>Stay informed about API changes:</p>
        <ul>
            <li>Follow <a href="https://github.com/HustleSynth/releases" target="_blank">GitHub Releases</a></li>
            <li>Join our <a href="https://discord.gg/hustlesynth" target="_blank">Discord</a> #announcements channel</li>
            <li>Subscribe to our developer newsletter</li>
        </ul>
    `;
}