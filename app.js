// Global state
let currentContent = 'introduction';
let searchIndex = [];

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    loadContent('introduction');
    buildSearchIndex();
    
    // Handle browser back/forward
    window.addEventListener('popstate', (e) => {
        if (e.state && e.state.content) {
            loadContent(e.state.content, false);
        }
    });
});

// Initialize theme
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

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
    document.querySelector(`[onclick="loadContent('${contentId}')"]`)?.classList.add('active');
    
    // Load content based on ID
    const content = getContent(contentId);
    contentArea.innerHTML = content;
    
    // Update URL
    if (updateHistory) {
        history.pushState({ content: contentId }, '', `#${contentId}`);
    }
    
    // Update current content
    currentContent = contentId;
    
    // Syntax highlighting
    Prism.highlightAll();
    
    // Add copy buttons to code blocks
    addCopyButtons();
    
    // Generate table of contents
    generateTOC();
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    // Close mobile sidebar
    document.getElementById('sidebar').classList.remove('active');
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
        
        <p class="lead">HustleSynth is a unified AI platform that provides seamless access to multiple AI models through a single API. Build powerful AI applications with models from OpenAI, Anthropic, and more.</p>
        
        <div class="alert alert-info">
            <strong>New to HustleSynth?</strong> Check out our <a href="#quickstart" onclick="loadContent('quickstart')">Quick Start Guide</a> to get up and running in minutes.
        </div>
        
        <h2>Why HustleSynth?</h2>
        
        <div class="features-grid">
            <div class="feature-card">
                <h3><i class="fas fa-bolt"></i> Unified API</h3>
                <p>Access multiple AI providers through a single, consistent API interface.</p>
            </div>
            <div class="feature-card">
                <h3><i class="fas fa-shield-alt"></i> Secure & Reliable</h3>
                <p>Enterprise-grade security with 99.9% uptime SLA.</p>
            </div>
            <div class="feature-card">
                <h3><i class="fas fa-chart-line"></i> Usage Analytics</h3>
                <p>Detailed insights into your API usage and costs.</p>
            </div>
            <div class="feature-card">
                <h3><i class="fas fa-code"></i> Developer Friendly</h3>
                <p>SDKs for popular languages and comprehensive documentation.</p>
            </div>
        </div>
        
        <h2>Supported Models</h2>
        
        <table>
            <thead>
                <tr>
                    <th>Provider</th>
                    <th>Models</th>
                    <th>Use Cases</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>OpenAI</strong></td>
                    <td>GPT-4, GPT-3.5-Turbo, DALL-E 3</td>
                    <td>Chat, completions, image generation</td>
                </tr>
                <tr>
                    <td><strong>Anthropic</strong></td>
                    <td>Claude 3 Opus, Claude 3 Sonnet</td>
                    <td>Advanced reasoning, long context</td>
                </tr>
                <tr>
                    <td><strong>Custom Models</strong></td>
                    <td>Your fine-tuned models</td>
                    <td>Specialized tasks</td>
                </tr>
            </tbody>
        </table>
        
        <h2>Getting Started</h2>
        
        <ol>
            <li><strong>Sign Up</strong>: Create your account at <a href="https://panel.hustlesynth.space" target="_blank">panel.hustlesynth.space</a></li>
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
        
        <h2>Step 2: Install the SDK</h2>
        
        <h3>Node.js/JavaScript</h3>
        
        <pre><code class="language-bash">npm install hustlesynth
# or
yarn add hustlesynth</code></pre>
        
        <h3>Python</h3>
        
        <pre><code class="language-bash">pip install hustlesynth</code></pre>
        
        <h2>Step 3: Make Your First API Call</h2>
        
        <h3>JavaScript Example</h3>
        
        <pre><code class="language-javascript">const HustleSynth = require('hustlesynth');

// Initialize the client
const client = new HustleSynth({
    apiKey: process.env.HUSTLESYNTH_API_KEY
});

// Make a chat completion request
async function main() {
    const completion = await client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: 'Hello! What can you help me with?' }
        ]
    });
    
    console.log(completion.choices[0].message.content);
}

main();</code></pre>
        
        <h3>Python Example</h3>
        
        <pre><code class="language-python">import os
from hustlesynth import HustleSynth

# Initialize the client
client = HustleSynth(api_key=os.environ["HUSTLESYNTH_API_KEY"])

# Make a chat completion request
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
        
        <h2>Getting Your API Key</h2>
        
        <ol>
            <li>Log in to your <a href="https://panel.hustlesynth.space" target="_blank">HustleSynth dashboard</a></li>
            <li>Navigate to the "API Keys" section</li>
            <li>Click "Create New Key"</li>
            <li>Give your key a descriptive name</li>
            <li>Copy and securely store your API key</li>
        </ol>
        
        <h2>Using Your API Key</h2>
        
        <p>Include your API key in the <code>Authorization</code> header of every request:</p>
        
        <pre><code class="language-bash">Authorization: Bearer YOUR_API_KEY</code></pre>
        
        <h3>Example Request</h3>
        
        <pre><code class="language-bash">curl https://api.hustlesynth.space/v1/chat/completions \\
    -H "Authorization: Bearer hs_test_abc123..." \\
    -H "Content-Type: application/json" \\
    -d '{"model": "gpt-3.5-turbo", "messages": [{"role": "user", "content": "Hello!"}]}'</code></pre>
        
        <h2>API Key Security</h2>
        
        <div class="alert alert-warning">
            <strong>Keep your API keys secure!</strong>
            <ul>
                <li>Never commit API keys to version control</li>
                <li>Use environment variables or secrets management</li>
                <li>Rotate keys regularly</li>
                <li>Use different keys for different environments</li>
            </ul>
        </div>
        
        <h3>Environment Variables</h3>
        
        <p>Store your API key in environment variables:</p>
        
        <h4>Linux/Mac</h4>
        <pre><code class="language-bash">export HUSTLESYNTH_API_KEY="hs_test_abc123..."</code></pre>
        
        <h4>Windows</h4>
        <pre><code class="language-bash">set HUSTLESYNTH_API_KEY="hs_test_abc123..."</code></pre>
        
        <h4>.env File</h4>
        <pre><code class="language-bash">HUSTLESYNTH_API_KEY=hs_test_abc123...</code></pre>
        
        <h2>API Key Permissions</h2>
        
        <p>API keys can have different permission levels:</p>
        
        <table>
            <thead>
                <tr>
                    <th>Permission</th>
                    <th>Description</th>
                    <th>Use Case</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Read</strong></td>
                    <td>Access to read operations only</td>
                    <td>Analytics, monitoring</td>
                </tr>
                <tr>
                    <td><strong>Write</strong></td>
                    <td>Full access to API endpoints</td>
                    <td>Production applications</td>
                </tr>
                <tr>
                    <td><strong>Admin</strong></td>
                    <td>Full access including key management</td>
                    <td>Administrative tasks</td>
                </tr>
            </tbody>
        </table>
        
        <h2>Rate Limiting</h2>
        
        <p>API keys are subject to rate limits based on your plan. See <a href="#rate-limits" onclick="loadContent('rate-limits')">Rate Limits</a> for details.</p>
        
        <h2>Troubleshooting</h2>
        
        <h3>Common Authentication Errors</h3>
        
        <table>
            <thead>
                <tr>
                    <th>Error Code</th>
                    <th>Message</th>
                    <th>Solution</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>401</code></td>
                    <td>Unauthorized</td>
                    <td>Check that your API key is valid and properly formatted</td>
                </tr>
                <tr>
                    <td><code>403</code></td>
                    <td>Forbidden</td>
                    <td>Your API key doesn't have permission for this operation</td>
                </tr>
                <tr>
                    <td><code>429</code></td>
                    <td>Too Many Requests</td>
                    <td>You've exceeded your rate limit. Wait or upgrade your plan</td>
                </tr>
            </tbody>
        </table>
    `;
}

// [Continue with more content functions...]

// Generate table of contents
function generateTOC() {
    const content = document.getElementById('content');
    const tocList = document.getElementById('tocList');
    const headings = content.querySelectorAll('h2, h3');
    
    if (headings.length === 0) {
        document.getElementById('toc').style.display = 'none';
        return;
    }
    
    document.getElementById('toc').style.display = 'block';
    tocList.innerHTML = '';
    
    headings.forEach((heading, index) => {
        const id = `heading-${index}`;
        heading.id = id;
        
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${id}`;
        a.textContent = heading.textContent;
        a.className = heading.tagName === 'H3' ? 'toc-h3' : '';
        a.onclick = (e) => {
            e.preventDefault();
            heading.scrollIntoView({ behavior: 'smooth' });
        };
        
        li.appendChild(a);
        tocList.appendChild(li);
    });
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
        button.onclick = () => {
            const code = block.querySelector('code').textContent;
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

// Search functionality
function searchDocs(event) {
    const query = event.target.value.toLowerCase();
    const resultsContainer = document.getElementById('searchResults');
    
    if (query.length < 2) {
        resultsContainer.classList.remove('active');
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
                <div class="search-result-title">${highlightMatch(result.title, query)}</div>
                <div class="search-result-content">${highlightMatch(result.excerpt, query)}</div>
            </div>
        `).join('');
    }
    
    resultsContainer.classList.add('active');
}

// Highlight search matches
function highlightMatch(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

// Build search index
function buildSearchIndex() {
    searchIndex = [
        { id: 'introduction', title: 'Introduction', content: 'Welcome to HustleSynth unified AI platform', excerpt: 'HustleSynth is a unified AI platform...' },
        { id: 'quickstart', title: 'Quick Start', content: 'Get started with HustleSynth API', excerpt: 'Get started in just a few minutes...' },
        { id: 'authentication', title: 'Authentication', content: 'API key authentication', excerpt: 'Learn how to authenticate your requests...' },
        { id: 'chat-completions', title: 'Chat Completions', content: 'Chat completion API endpoint', excerpt: 'Create chat completions with AI models...' },
        { id: 'models', title: 'Available Models', content: 'GPT-4 Claude OpenAI Anthropic', excerpt: 'Explore available AI models...' },
        { id: 'streaming', title: 'Streaming', content: 'Real-time streaming responses', excerpt: 'Stream responses in real-time...' },
        { id: 'webhooks', title: 'Webhooks', content: 'Event notifications webhooks', excerpt: 'Set up webhooks for events...' },
        { id: 'api-keys', title: 'API Keys', content: 'Manage API keys', excerpt: 'Create and manage your API keys...' },
        { id: 'rate-limits', title: 'Rate Limits', content: 'API rate limiting', excerpt: 'Understand rate limits and quotas...' },
        { id: 'best-practices', title: 'Best Practices', content: 'Security optimization tips', excerpt: 'Learn best practices for using the API...' }
    ];
}

// Close search results when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
        document.getElementById('searchResults').classList.remove('active');
    }
});

// Continue with more content functions...
function getPricingContent() {
    return `
        <h1>Pricing</h1>
        
        <p>HustleSynth offers flexible pricing plans to suit your needs, from individual developers to enterprise teams.</p>
        
        <h2>Pricing Plans</h2>
        
        <div class="pricing-table">
            <div class="pricing-card">
                <h3>Free</h3>
                <div class="price">$0/month</div>
                <ul>
                    <li>1,000 credits/month</li>
                    <li>Access to basic models</li>
                    <li>Community support</li>
                    <li>Usage analytics</li>
                </ul>
                <a href="https://panel.hustlesynth.space" class="btn btn-primary">Get Started</a>
            </div>
            
            <div class="pricing-card featured">
                <h3>Starter</h3>
                <div class="price">$19/month</div>
                <ul>
                    <li>10,000 credits/month</li>
                    <li>All AI models</li>
                    <li>Priority support</li>
                    <li>Webhooks</li>
                    <li>Advanced analytics</li>
                </ul>
                <a href="https://panel.hustlesynth.space" class="btn btn-primary">Start Free Trial</a>
            </div>
            
            <div class="pricing-card">
                <h3>Pro</h3>
                <div class="price">$99/month</div>
                <ul>
                    <li>100,000 credits/month</li>
                    <li>All features</li>
                    <li>Dedicated support</li>
                    <li>Custom models</li>
                    <li>SLA guarantee</li>
                </ul>
                <a href="https://panel.hustlesynth.space" class="btn btn-primary">Start Free Trial</a>
            </div>
            
            <div class="pricing-card">
                <h3>Enterprise</h3>
                <div class="price">Custom</div>
                <ul>
                    <li>Unlimited credits</li>
                    <li>Custom deployment</li>
                    <li>24/7 support</li>
                    <li>SSO/SAML</li>
                    <li>Custom contract</li>
                </ul>
                <a href="mailto:sales@hustlesynth.space" class="btn btn-primary">Contact Sales</a>
            </div>
        </div>
        
        <h2>Credit Costs by Model</h2>
        
        <table>
            <thead>
                <tr>
                    <th>Model</th>
                    <th>Credits per 1K tokens</th>
                    <th>Typical Use Case</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>GPT-3.5 Turbo</td>
                    <td>1 credit</td>
                    <td>General chat, simple tasks</td>
                </tr>
                <tr>
                    <td>GPT-4</td>
                    <td>15 credits</td>
                    <td>Complex reasoning, coding</td>
                </tr>
                <tr>
                    <td>GPT-4 Turbo</td>
                    <td>5 credits</td>
                    <td>Balanced performance</td>
                </tr>
                <tr>
                    <td>Claude 3 Sonnet</td>
                    <td>2 credits</td>
                    <td>Fast, efficient responses</td>
                </tr>
                <tr>
                    <td>Claude 3 Opus</td>
                    <td>8 credits</td>
                    <td>Advanced analysis</td>
                </tr>
                <tr>
                    <td>DALL-E 3</td>
                    <td>20 credits/image</td>
                    <td>Image generation</td>
                </tr>
            </tbody>
        </table>
        
        <h2>Additional Costs</h2>
        
        <ul>
            <li><strong>Additional Credits</strong>: $10 per 10,000 credits</li>
            <li><strong>Fine-tuned Models</strong>: 2x base model cost</li>
            <li><strong>Priority Processing</strong>: +20% credit cost</li>
            <li><strong>Data Storage</strong>: $0.10/GB/month</li>
        </ul>
        
        <h2>FAQ</h2>
        
        <h3>How do credits work?</h3>
        <p>Credits are our universal currency across all AI models. Different models consume different amounts of credits based on computational requirements.</p>
        
        <h3>Do unused credits roll over?</h3>
        <p>Credits reset monthly and don't roll over. We recommend choosing a plan that matches your typical usage.</p>
        
        <h3>Can I change plans anytime?</h3>
        <p>Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
        
        <h3>Is there a free trial?</h3>
        <p>All paid plans come with a 14-day free trial. No credit card required.</p>
    `;
}