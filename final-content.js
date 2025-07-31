// Final Documentation Content Functions

function getServicesContent() {
    return `
        <h1>Services Management</h1>
        
        <p>Manage which AI services are enabled for your account. Each service provides access to specific models and features.</p>
        
        <h2>Available Services</h2>
        
        <pre><code class="language-bash">GET /v1/services</code></pre>
        
        <h3>Response</h3>
        
        <pre><code class="language-json">{
    "services": [
        {
            "id": "svc_gpt",
            "name": "OpenAI GPT Models",
            "description": "Access to GPT-3.5 and GPT-4 models",
            "category": "chat",
            "models": ["gpt-3.5-turbo", "gpt-4", "gpt-4-turbo"],
            "status": "active",
            "base_cost": 0.002
        },
        {
            "id": "svc_claude",
            "name": "Anthropic Claude",
            "description": "Access to Claude models",
            "category": "chat",
            "models": ["claude-3-opus", "claude-3-sonnet"],
            "status": "inactive",
            "base_cost": 0.003
        },
        {
            "id": "svc_dalle",
            "name": "DALL-E Image Generation",
            "description": "AI image generation",
            "category": "image",
            "models": ["dall-e-3", "dall-e-2"],
            "status": "active",
            "base_cost": 0.040
        }
    ]
}</code></pre>
        
        <h2>Activate Service</h2>
        
        <pre><code class="language-bash">POST /v1/services/{service_id}/activate</code></pre>
        
        <h3>Response</h3>
        
        <pre><code class="language-json">{
    "service_id": "svc_claude",
    "status": "active",
    "activated_at": "2024-01-15T10:00:00Z",
    "models_available": ["claude-3-opus", "claude-3-sonnet"]
}</code></pre>
        
        <h2>Deactivate Service</h2>
        
        <pre><code class="language-bash">POST /v1/services/{service_id}/deactivate</code></pre>
        
        <h2>Service Categories</h2>
        
        <table>
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Services</th>
                    <th>Use Cases</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Chat</strong></td>
                    <td>GPT, Claude, Custom</td>
                    <td>Conversations, completions, analysis</td>
                </tr>
                <tr>
                    <td><strong>Image</strong></td>
                    <td>DALL-E, Stable Diffusion</td>
                    <td>Image generation, editing</td>
                </tr>
                <tr>
                    <td><strong>Audio</strong></td>
                    <td>Whisper, TTS</td>
                    <td>Transcription, speech synthesis</td>
                </tr>
                <tr>
                    <td><strong>Vision</strong></td>
                    <td>GPT-4 Vision</td>
                    <td>Image analysis, OCR</td>
                </tr>
            </tbody>
        </table>
        
        <h2>Service Configuration</h2>
        
        <p>Configure service-specific settings:</p>
        
        <pre><code class="language-bash">PUT /v1/services/{service_id}/config</code></pre>
        
        <pre><code class="language-json">{
    "rate_limit_override": 100,
    "custom_endpoint": "https://your-proxy.com",
    "default_model": "gpt-4",
    "max_tokens_override": 4000
}</code></pre>
        
        <h2>Service Usage</h2>
        
        <p>Get usage statistics for a specific service:</p>
        
        <pre><code class="language-bash">GET /v1/services/{service_id}/usage</code></pre>
        
        <pre><code class="language-json">{
    "service_id": "svc_gpt",
    "period": "last_30_days",
    "usage": {
        "requests": 10000,
        "tokens": 5000000,
        "cost": 50.00,
        "average_latency_ms": 450
    },
    "by_model": {
        "gpt-3.5-turbo": {
            "requests": 8000,
            "tokens": 3000000,
            "cost": 30.00
        },
        "gpt-4": {
            "requests": 2000,
            "tokens": 2000000,
            "cost": 20.00
        }
    }
}</code></pre>
    `;
}

function getJavaScriptSDKContent() {
    return `
        <h1>JavaScript/Node.js SDK</h1>
        
        <p>The official JavaScript SDK for HustleSynth provides a simple interface to interact with our API from Node.js or browser environments.</p>
        
        <h2>Installation</h2>
        
        <h3>NPM</h3>
        <pre><code class="language-bash">npm install hustlesynth</code></pre>
        
        <h3>Yarn</h3>
        <pre><code class="language-bash">yarn add hustlesynth</code></pre>
        
        <h3>CDN</h3>
        <pre><code class="language-html">&lt;script src="https://cdn.jsdelivr.net/npm/hustlesynth@latest/dist/hustlesynth.min.js"&gt;&lt;/script&gt;</code></pre>
        
        <h2>Quick Start</h2>
        
        <pre><code class="language-javascript">const HustleSynth = require('hustlesynth');

// Initialize client
const client = new HustleSynth({
    apiKey: process.env.HUSTLESYNTH_API_KEY
});

// Create a chat completion
async function main() {
    const completion = await client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: 'Hello!' }
        ]
    });
    
    console.log(completion.choices[0].message.content);
}

main();</code></pre>
        
        <h2>Configuration</h2>
        
        <pre><code class="language-javascript">const client = new HustleSynth({
    apiKey: 'your-api-key',
    
    // Optional configuration
    baseURL: 'https://api.hustlesynth.space/v1',
    timeout: 30000, // 30 seconds
    maxRetries: 3,
    headers: {
        'X-Custom-Header': 'value'
    }
});</code></pre>
        
        <h2>Chat Completions</h2>
        
        <h3>Basic Completion</h3>
        
        <pre><code class="language-javascript">const completion = await client.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
        { role: 'user', content: 'What is the capital of France?' }
    ]
});</code></pre>
        
        <h3>Streaming Completion</h3>
        
        <pre><code class="language-javascript">const stream = await client.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
        { role: 'user', content: 'Write a story about a robot.' }
    ],
    stream: true
});

for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    process.stdout.write(content);
}</code></pre>
        
        <h3>With Parameters</h3>
        
        <pre><code class="language-javascript">const completion = await client.chat.completions.create({
    model: 'gpt-4',
    messages: messages,
    temperature: 0.7,
    max_tokens: 150,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stop: ['\\n\\n', 'END']
});</code></pre>
        
        <h2>Function Calling</h2>
        
        <pre><code class="language-javascript">const completion = await client.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
        { role: 'user', content: 'What\\'s the weather in Boston?' }
    ],
    functions: [
        {
            name: 'get_weather',
            description: 'Get the current weather in a location',
            parameters: {
                type: 'object',
                properties: {
                    location: {
                        type: 'string',
                        description: 'The city and state'
                    },
                    unit: {
                        type: 'string',
                        enum: ['celsius', 'fahrenheit']
                    }
                },
                required: ['location']
            }
        }
    ],
    function_call: 'auto'
});

const functionCall = completion.choices[0].message.function_call;
if (functionCall) {
    const args = JSON.parse(functionCall.arguments);
    console.log(\`Function: \${functionCall.name}\`);
    console.log(\`Arguments: \${JSON.stringify(args)}\`);
}</code></pre>
        
        <h2>Image Generation</h2>
        
        <pre><code class="language-javascript">const response = await client.images.generate({
    model: 'dall-e-3',
    prompt: 'A futuristic city at sunset',
    n: 1,
    size: '1024x1024',
    quality: 'standard',
    style: 'vivid'
});

console.log(response.data[0].url);</code></pre>
        
        <h2>Audio Transcription</h2>
        
        <pre><code class="language-javascript">const fs = require('fs');

const transcription = await client.audio.transcriptions.create({
    file: fs.createReadStream('audio.mp3'),
    model: 'whisper-1',
    language: 'en',
    response_format: 'json'
});

console.log(transcription.text);</code></pre>
        
        <h2>Error Handling</h2>
        
        <pre><code class="language-javascript">try {
    const completion = await client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'Hello!' }]
    });
} catch (error) {
    if (error instanceof HustleSynth.APIError) {
        console.error('API Error:', error.message);
        console.error('Status:', error.status);
        console.error('Code:', error.code);
    } else if (error instanceof HustleSynth.RateLimitError) {
        console.error('Rate limit exceeded');
        console.error('Retry after:', error.retryAfter);
    } else if (error instanceof HustleSynth.AuthenticationError) {
        console.error('Authentication failed:', error.message);
    } else {
        console.error('Unexpected error:', error);
    }
}</code></pre>
        
        <h2>Usage Tracking</h2>
        
        <pre><code class="language-javascript">// Get current usage
const usage = await client.usage.getCurrent();
console.log('Credits remaining:', usage.credits.remaining);

// Get usage by date range
const historical = await client.usage.getDaily({
    start_date: '2024-01-01',
    end_date: '2024-01-31'
});

// Set up usage alerts
const alert = await client.usage.createAlert({
    name: 'Daily limit',
    metric: 'daily_cost',
    threshold: 10.00
});</code></pre>
        
        <h2>TypeScript Support</h2>
        
        <pre><code class="language-typescript">import HustleSynth from 'hustlesynth';
import type { 
    ChatCompletionMessage,
    ChatCompletionResponse 
} from 'hustlesynth/types';

const client = new HustleSynth({
    apiKey: process.env.HUSTLESYNTH_API_KEY!
});

const messages: ChatCompletionMessage[] = [
    { role: 'user', content: 'Hello!' }
];

const completion: ChatCompletionResponse = await client.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages
});</code></pre>
        
        <h2>Browser Usage</h2>
        
        <pre><code class="language-html">&lt;script src="https://cdn.jsdelivr.net/npm/hustlesynth@latest/dist/hustlesynth.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
    const client = new HustleSynth({
        apiKey: 'your-api-key',
        dangerouslyAllowBrowser: true // Required for browser usage
    });
    
    async function chat() {
        const completion = await client.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: 'Hello!' }]
        });
        
        document.getElementById('output').textContent = 
            completion.choices[0].message.content;
    }
&lt;/script&gt;</code></pre>
        
        <div class="alert alert-warning">
            <strong>Security Warning:</strong> Never expose your API key in client-side code. Use a backend proxy for production browser applications.
        </div>
        
        <h2>Advanced Usage</h2>
        
        <h3>Custom HTTP Client</h3>
        
        <pre><code class="language-javascript">const axios = require('axios');

const client = new HustleSynth({
    apiKey: 'your-api-key',
    httpClient: axios.create({
        timeout: 60000,
        proxy: {
            host: 'proxy.example.com',
            port: 8080
        }
    })
});</code></pre>
        
        <h3>Retry Configuration</h3>
        
        <pre><code class="language-javascript">const client = new HustleSynth({
    apiKey: 'your-api-key',
    maxRetries: 5,
    retryDelay: (attempt) => Math.pow(2, attempt) * 1000,
    retryOn: [429, 500, 502, 503, 504]
});</code></pre>
    `;
}

function getPythonSDKContent() {
    return `
        <h1>Python SDK</h1>
        
        <p>The official Python SDK for HustleSynth provides a Pythonic interface to interact with our API.</p>
        
        <h2>Installation</h2>
        
        <pre><code class="language-bash">pip install hustlesynth</code></pre>
        
        <h3>Requirements</h3>
        <ul>
            <li>Python 3.7+</li>
            <li>requests</li>
            <li>aiohttp (for async support)</li>
        </ul>
        
        <h2>Quick Start</h2>
        
        <pre><code class="language-python">from hustlesynth import HustleSynth

# Initialize client
client = HustleSynth(api_key="your-api-key")

# Create a chat completion
completion = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hello!"}
    ]
)

print(completion.choices[0].message.content)</code></pre>
        
        <h2>Configuration</h2>
        
        <pre><code class="language-python">from hustlesynth import HustleSynth

client = HustleSynth(
    api_key="your-api-key",
    
    # Optional configuration
    base_url="https://api.hustlesynth.space/v1",
    timeout=30.0,
    max_retries=3,
    headers={
        "X-Custom-Header": "value"
    }
)</code></pre>
        
        <h3>Environment Variables</h3>
        
        <pre><code class="language-python">import os
from hustlesynth import HustleSynth

# Automatically uses HUSTLESYNTH_API_KEY environment variable
client = HustleSynth()</code></pre>
        
        <h2>Chat Completions</h2>
        
        <h3>Basic Usage</h3>
        
        <pre><code class="language-python">completion = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "user", "content": "What is the capital of France?"}
    ]
)

print(completion.choices[0].message.content)</code></pre>
        
        <h3>Streaming Responses</h3>
        
        <pre><code class="language-python">stream = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "user", "content": "Write a story about a robot."}
    ],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")</code></pre>
        
        <h3>With Parameters</h3>
        
        <pre><code class="language-python">completion = client.chat.completions.create(
    model="gpt-4",
    messages=messages,
    temperature=0.7,
    max_tokens=150,
    top_p=1.0,
    frequency_penalty=0.0,
    presence_penalty=0.0,
    stop=["\\n\\n", "END"]
)</code></pre>
        
        <h2>Async Support</h2>
        
        <pre><code class="language-python">import asyncio
from hustlesynth import AsyncHustleSynth

async def main():
    client = AsyncHustleSynth(api_key="your-api-key")
    
    completion = await client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": "Hello!"}
        ]
    )
    
    print(completion.choices[0].message.content)

asyncio.run(main())</code></pre>
        
        <h3>Async Streaming</h3>
        
        <pre><code class="language-python">async def stream_chat():
    client = AsyncHustleSynth(api_key="your-api-key")
    
    stream = await client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": "Write a poem"}],
        stream=True
    )
    
    async for chunk in stream:
        if chunk.choices[0].delta.content:
            print(chunk.choices[0].delta.content, end="")</code></pre>
        
        <h2>Function Calling</h2>
        
        <pre><code class="language-python">functions = [
    {
        "name": "get_weather",
        "description": "Get the current weather in a location",
        "parameters": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "The city and state"
                },
                "unit": {
                    "type": "string",
                    "enum": ["celsius", "fahrenheit"]
                }
            },
            "required": ["location"]
        }
    }
]

completion = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "user", "content": "What's the weather in Boston?"}
    ],
    functions=functions,
    function_call="auto"
)

function_call = completion.choices[0].message.function_call
if function_call:
    import json
    args = json.loads(function_call.arguments)
    print(f"Function: {function_call.name}")
    print(f"Arguments: {args}")</code></pre>
        
        <h2>Image Generation</h2>
        
        <pre><code class="language-python">response = client.images.generate(
    model="dall-e-3",
    prompt="A futuristic city at sunset",
    n=1,
    size="1024x1024",
    quality="standard",
    style="vivid"
)

print(response.data[0].url)</code></pre>
        
        <h2>Audio Processing</h2>
        
        <h3>Transcription</h3>
        
        <pre><code class="language-python">with open("audio.mp3", "rb") as audio_file:
    transcription = client.audio.transcriptions.create(
        file=audio_file,
        model="whisper-1",
        language="en",
        response_format="json"
    )

print(transcription.text)</code></pre>
        
        <h3>Text-to-Speech</h3>
        
        <pre><code class="language-python">response = client.audio.speech.create(
    model="tts-1",
    voice="nova",
    input="Hello, this is a test of text to speech."
)

with open("output.mp3", "wb") as f:
    f.write(response.content)</code></pre>
        
        <h2>Error Handling</h2>
        
        <pre><code class="language-python">from hustlesynth import (
    HustleSynth, 
    APIError, 
    RateLimitError, 
    AuthenticationError
)

try:
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": "Hello!"}]
    )
except RateLimitError as e:
    print(f"Rate limit exceeded. Retry after {e.retry_after} seconds")
except AuthenticationError as e:
    print(f"Authentication failed: {e}")
except APIError as e:
    print(f"API error: {e.message}")
    print(f"Status code: {e.status_code}")
except Exception as e:
    print(f"Unexpected error: {e}")</code></pre>
        
        <h2>Usage Tracking</h2>
        
        <pre><code class="language-python"># Get current usage
usage = client.usage.get_current()
print(f"Credits remaining: {usage.credits.remaining}")

# Get daily usage
daily_usage = client.usage.get_daily(
    start_date="2024-01-01",
    end_date="2024-01-31"
)

for day in daily_usage.data:
    print(f"{day.date}: {day.requests} requests, ${day.cost}")</code></pre>
        
        <h2>Context Managers</h2>
        
        <pre><code class="language-python">from hustlesynth import HustleSynth

# Automatic cleanup with context manager
with HustleSynth(api_key="your-api-key") as client:
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": "Hello!"}]
    )
    print(completion.choices[0].message.content)</code></pre>
        
        <h2>Logging</h2>
        
        <pre><code class="language-python">import logging
from hustlesynth import HustleSynth

# Enable debug logging
logging.basicConfig(level=logging.DEBUG)

client = HustleSynth(
    api_key="your-api-key",
    log_level="DEBUG"
)</code></pre>
        
        <h2>Proxy Configuration</h2>
        
        <pre><code class="language-python">client = HustleSynth(
    api_key="your-api-key",
    proxies={
        "http": "http://proxy.example.com:8080",
        "https": "https://proxy.example.com:8080"
    }
)</code></pre>
        
        <h2>Type Hints</h2>
        
        <pre><code class="language-python">from typing import List
from hustlesynth import HustleSynth
from hustlesynth.types import (
    ChatCompletionMessage,
    ChatCompletionResponse
)

def create_chat_completion(
    client: HustleSynth,
    messages: List[ChatCompletionMessage]
) -> ChatCompletionResponse:
    return client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=messages
    )</code></pre>
    `;
}

function getRESTAPIContent() {
    return `
        <h1>REST API Reference</h1>
        
        <p>The HustleSynth REST API provides direct HTTP access to all platform features. This reference covers authentication, endpoints, and request/response formats.</p>
        
        <h2>Base URL</h2>
        
        <pre><code class="language-bash">https://api.hustlesynth.space/v1</code></pre>
        
        <h2>Authentication</h2>
        
        <p>Include your API key in the Authorization header:</p>
        
        <pre><code class="language-bash">Authorization: Bearer YOUR_API_KEY</code></pre>
        
        <h2>Request Headers</h2>
        
        <table>
            <thead>
                <tr>
                    <th>Header</th>
                    <th>Required</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>Authorization</code></td>
                    <td>Yes</td>
                    <td>Bearer token with your API key</td>
                </tr>
                <tr>
                    <td><code>Content-Type</code></td>
                    <td>Yes</td>
                    <td>application/json</td>
                </tr>
                <tr>
                    <td><code>X-Request-ID</code></td>
                    <td>No</td>
                    <td>Unique request identifier for tracking</td>
                </tr>
            </tbody>
        </table>
        
        <h2>Core Endpoints</h2>
        
        <h3>Chat Completions</h3>
        
        <div class="endpoint-block">
            <div class="endpoint-header">
                <span class="method post">POST</span>
                <span class="path">/v1/chat/completions</span>
            </div>
            
            <h4>Request Body</h4>
            <pre><code class="language-json">{
    "model": "gpt-3.5-turbo",
    "messages": [
        {
            "role": "system",
            "content": "You are a helpful assistant."
        },
        {
            "role": "user",
            "content": "Hello!"
        }
    ],
    "temperature": 0.7,
    "max_tokens": 150,
    "stream": false
}</code></pre>
            
            <h4>Response</h4>
            <pre><code class="language-json">{
    "id": "chatcmpl-abc123",
    "object": "chat.completion",
    "created": 1677858242,
    "model": "gpt-3.5-turbo",
    "usage": {
        "prompt_tokens": 13,
        "completion_tokens": 7,
        "total_tokens": 20
    },
    "choices": [
        {
            "message": {
                "role": "assistant",
                "content": "Hello! How can I help you today?"
            },
            "finish_reason": "stop",
            "index": 0
        }
    ]
}</code></pre>
        </div>
        
        <h3>List Models</h3>
        
        <div class="endpoint-block">
            <div class="endpoint-header">
                <span class="method get">GET</span>
                <span class="path">/v1/models</span>
            </div>
            
            <h4>Response</h4>
            <pre><code class="language-json">{
    "object": "list",
    "data": [
        {
            "id": "gpt-3.5-turbo",
            "object": "model",
            "created": 1677649963,
            "owned_by": "openai"
        },
        {
            "id": "gpt-4",
            "object": "model",
            "created": 1687882411,
            "owned_by": "openai"
        }
    ]
}</code></pre>
        </div>
        
        <h3>Get Model</h3>
        
        <div class="endpoint-block">
            <div class="endpoint-header">
                <span class="method get">GET</span>
                <span class="path">/v1/models/{model_id}</span>
            </div>
            
            <h4>Response</h4>
            <pre><code class="language-json">{
    "id": "gpt-4",
    "object": "model",
    "created": 1687882411,
    "owned_by": "openai",
    "capabilities": {
        "max_tokens": 8192,
        "supports_functions": true,
        "supports_vision": false
    }
}</code></pre>
        </div>
        
        <h2>Image Endpoints</h2>
        
        <h3>Generate Image</h3>
        
        <div class="endpoint-block">
            <div class="endpoint-header">
                <span class="method post">POST</span>
                <span class="path">/v1/images/generations</span>
            </div>
            
            <h4>Request Body</h4>
            <pre><code class="language-json">{
    "model": "dall-e-3",
    "prompt": "A white siamese cat",
    "n": 1,
    "size": "1024x1024",
    "quality": "standard",
    "style": "vivid"
}</code></pre>
            
            <h4>Response</h4>
            <pre><code class="language-json">{
    "created": 1677858242,
    "data": [
        {
            "url": "https://...",
            "revised_prompt": "A white Siamese cat with blue eyes..."
        }
    ]
}</code></pre>
        </div>
        
        <h2>Audio Endpoints</h2>
        
        <h3>Create Transcription</h3>
        
        <div class="endpoint-block">
            <div class="endpoint-header">
                <span class="method post">POST</span>
                <span class="path">/v1/audio/transcriptions</span>
            </div>
            
            <h4>Request (multipart/form-data)</h4>
            <pre><code class="language-bash">curl https://api.hustlesynth.space/v1/audio/transcriptions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F file="@audio.mp3" \\
  -F model="whisper-1" \\
  -F language="en"</code></pre>
            
            <h4>Response</h4>
            <pre><code class="language-json">{
    "text": "Hello, this is the transcribed text from the audio file."
}</code></pre>
        </div>
        
        <h2>Usage Endpoints</h2>
        
        <h3>Get Current Usage</h3>
        
        <div class="endpoint-block">
            <div class="endpoint-header">
                <span class="method get">GET</span>
                <span class="path">/v1/usage/current</span>
            </div>
            
            <h4>Response</h4>
            <pre><code class="language-json">{
    "period": {
        "start": "2024-01-01T00:00:00Z",
        "end": "2024-01-31T23:59:59Z"
    },
    "usage": {
        "requests": 12345,
        "tokens": 1234567,
        "cost": 123.45,
        "credits": {
            "used": 12345,
            "remaining": 87655
        }
    }
}</code></pre>
        </div>
        
        <h2>Pagination</h2>
        
        <p>List endpoints support pagination:</p>
        
        <pre><code class="language-bash">GET /v1/logs?page=2&limit=50</code></pre>
        
        <h3>Pagination Parameters</h3>
        
        <table>
            <thead>
                <tr>
                    <th>Parameter</th>
                    <th>Default</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>page</code></td>
                    <td>1</td>
                    <td>Page number</td>
                </tr>
                <tr>
                    <td><code>limit</code></td>
                    <td>20</td>
                    <td>Items per page (max 100)</td>
                </tr>
                <tr>
                    <td><code>order</code></td>
                    <td>desc</td>
                    <td>Sort order (asc/desc)</td>
                </tr>
            </tbody>
        </table>
        
        <h3>Pagination Response</h3>
        
        <pre><code class="language-json">{
    "data": [...],
    "pagination": {
        "page": 2,
        "limit": 50,
        "total": 245,
        "pages": 5,
        "has_more": true
    }
}</code></pre>
        
        <h2>Error Handling</h2>
        
        <p>Errors follow a consistent format:</p>
        
        <pre><code class="language-json">{
    "error": {
        "message": "Invalid API key provided",
        "type": "authentication_error",
        "code": "invalid_api_key",
        "doc_url": "https://docs.hustlesynth.space/errors/invalid_api_key"
    }
}</code></pre>
        
        <h3>Error Types</h3>
        
        <table>
            <thead>
                <tr>
                    <th>Type</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>authentication_error</code></td>
                    <td>Invalid or missing API key</td>
                </tr>
                <tr>
                    <td><code>invalid_request_error</code></td>
                    <td>Invalid parameters</td>
                </tr>
                <tr>
                    <td><code>rate_limit_error</code></td>
                    <td>Too many requests</td>
                </tr>
                <tr>
                    <td><code>server_error</code></td>
                    <td>Internal server error</td>
                </tr>
            </tbody>
        </table>
        
        <h2>Idempotency</h2>
        
        <p>Make requests idempotent using the <code>Idempotency-Key</code> header:</p>
        
        <pre><code class="language-bash">curl https://api.hustlesynth.space/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Idempotency-Key: unique-request-id" \\
  -d '{"model": "gpt-3.5-turbo", "messages": [...]}'</code></pre>
        
        <h2>Rate Limiting</h2>
        
        <p>Check rate limit headers in responses:</p>
        
        <pre><code class="language-bash">X-RateLimit-Limit: 60
X-RateLimit-Remaining: 58
X-RateLimit-Reset: 1677858300</code></pre>
    `;
}

// Export all final content functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getServicesContent,
        getJavaScriptSDKContent,
        getPythonSDKContent,
        getRESTAPIContent
    };
}