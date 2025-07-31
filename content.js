// API Documentation Content Functions

function getAPIOverviewContent() {
    return `
        <h1>API Overview</h1>
        
        <p>The HustleSynth API provides a unified interface to interact with multiple AI models. Our RESTful API is designed to be simple, consistent, and powerful.</p>
        
        <h2>Base URL</h2>
        
        <pre><code class="language-bash">https://api.hustlesynth.space/v1</code></pre>
        
        <h2>Authentication</h2>
        
        <p>All API requests must include your API key in the Authorization header:</p>
        
        <pre><code class="language-bash">Authorization: Bearer YOUR_API_KEY</code></pre>
        
        <h2>Request Format</h2>
        
        <p>All requests should be made with JSON payloads:</p>
        
        <pre><code class="language-bash">Content-Type: application/json</code></pre>
        
        <h2>Response Format</h2>
        
        <p>All responses are returned in JSON format with the following structure:</p>
        
        <h3>Success Response</h3>
        <pre><code class="language-json">{
    "id": "chatcmpl-abc123",
    "object": "chat.completion",
    "created": 1677858242,
    "model": "gpt-3.5-turbo",
    "usage": {
        "prompt_tokens": 13,
        "completion_tokens": 17,
        "total_tokens": 30
    },
    "choices": [{
        "message": {
            "role": "assistant",
            "content": "Hello! How can I assist you today?"
        },
        "finish_reason": "stop",
        "index": 0
    }]
}</code></pre>
        
        <h3>Error Response</h3>
        <pre><code class="language-json">{
    "error": {
        "message": "Invalid API key provided",
        "type": "invalid_request_error",
        "code": "invalid_api_key"
    }
}</code></pre>
        
        <h2>Common Headers</h2>
        
        <table>
            <thead>
                <tr>
                    <th>Header</th>
                    <th>Description</th>
                    <th>Example</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>X-Request-ID</code></td>
                    <td>Unique request identifier</td>
                    <td><code>req_abc123</code></td>
                </tr>
                <tr>
                    <td><code>X-RateLimit-Limit</code></td>
                    <td>Request limit per minute</td>
                    <td><code>60</code></td>
                </tr>
                <tr>
                    <td><code>X-RateLimit-Remaining</code></td>
                    <td>Remaining requests</td>
                    <td><code>59</code></td>
                </tr>
                <tr>
                    <td><code>X-RateLimit-Reset</code></td>
                    <td>Reset timestamp</td>
                    <td><code>1677858300</code></td>
                </tr>
            </tbody>
        </table>
        
        <h2>Endpoints</h2>
        
        <h3>Chat Completions</h3>
        <pre><code class="language-bash">POST /v1/chat/completions</code></pre>
        
        <h3>Models</h3>
        <pre><code class="language-bash">GET /v1/models
GET /v1/models/{model_id}</code></pre>
        
        <h3>Usage</h3>
        <pre><code class="language-bash">GET /v1/usage
GET /v1/usage/daily</code></pre>
        
        <h3>API Keys</h3>
        <pre><code class="language-bash">GET /v1/keys
POST /v1/keys
DELETE /v1/keys/{key_id}</code></pre>
        
        <h2>Status Codes</h2>
        
        <table>
            <thead>
                <tr>
                    <th>Code</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>200</code></td>
                    <td>Success</td>
                </tr>
                <tr>
                    <td><code>201</code></td>
                    <td>Created</td>
                </tr>
                <tr>
                    <td><code>400</code></td>
                    <td>Bad Request</td>
                </tr>
                <tr>
                    <td><code>401</code></td>
                    <td>Unauthorized</td>
                </tr>
                <tr>
                    <td><code>403</code></td>
                    <td>Forbidden</td>
                </tr>
                <tr>
                    <td><code>404</code></td>
                    <td>Not Found</td>
                </tr>
                <tr>
                    <td><code>429</code></td>
                    <td>Too Many Requests</td>
                </tr>
                <tr>
                    <td><code>500</code></td>
                    <td>Internal Server Error</td>
                </tr>
            </tbody>
        </table>
    `;
}

function getChatCompletionsContent() {
    return `
        <h1>Chat Completions</h1>
        
        <p>Create chat completions using various AI models. This endpoint supports both regular and streaming responses.</p>
        
        <h2>Endpoint</h2>
        
        <pre><code class="language-bash">POST /v1/chat/completions</code></pre>
        
        <h2>Request Body</h2>
        
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
        
        <h3>Parameters</h3>
        
        <table>
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
                    <td>ID of the model to use</td>
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
                    <td>Sampling temperature (0-2). Default: 1</td>
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
                    <td>Stream the response. Default: false</td>
                </tr>
                <tr>
                    <td><code>top_p</code></td>
                    <td>number</td>
                    <td>No</td>
                    <td>Nucleus sampling (0-1). Default: 1</td>
                </tr>
                <tr>
                    <td><code>n</code></td>
                    <td>integer</td>
                    <td>No</td>
                    <td>Number of completions. Default: 1</td>
                </tr>
                <tr>
                    <td><code>stop</code></td>
                    <td>string/array</td>
                    <td>No</td>
                    <td>Stop sequences</td>
                </tr>
                <tr>
                    <td><code>presence_penalty</code></td>
                    <td>number</td>
                    <td>No</td>
                    <td>Presence penalty (-2 to 2). Default: 0</td>
                </tr>
                <tr>
                    <td><code>frequency_penalty</code></td>
                    <td>number</td>
                    <td>No</td>
                    <td>Frequency penalty (-2 to 2). Default: 0</td>
                </tr>
            </tbody>
        </table>
        
        <h2>Message Object</h2>
        
        <pre><code class="language-json">{
    "role": "user",
    "content": "What is the capital of France?"
}</code></pre>
        
        <h3>Message Roles</h3>
        
        <ul>
            <li><code>system</code> - Sets the behavior of the assistant</li>
            <li><code>user</code> - The user's input</li>
            <li><code>assistant</code> - The assistant's response</li>
        </ul>
        
        <h2>Response</h2>
        
        <h3>Non-Streaming Response</h3>
        
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
                "content": "The capital of France is Paris."
            },
            "finish_reason": "stop",
            "index": 0
        }
    ]
}</code></pre>
        
        <h3>Streaming Response</h3>
        
        <p>When <code>stream: true</code>, the response is sent as Server-Sent Events:</p>
        
        <pre><code class="language-text">data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1677858242,"model":"gpt-3.5-turbo","choices":[{"delta":{"content":"The"},"index":0}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1677858242,"model":"gpt-3.5-turbo","choices":[{"delta":{"content":" capital"},"index":0}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1677858242,"model":"gpt-3.5-turbo","choices":[{"delta":{"content":" of"},"index":0}]}

data: [DONE]</code></pre>
        
        <h2>Examples</h2>
        
        <h3>Basic Chat Completion</h3>
        
        <pre><code class="language-bash">curl https://api.hustlesynth.space/v1/chat/completions \\
    -H "Authorization: Bearer YOUR_API_KEY" \\
    -H "Content-Type: application/json" \\
    -d '{
        "model": "gpt-3.5-turbo",
        "messages": [
            {"role": "user", "content": "What is 2+2?"}
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
                content: 'You are a math tutor. Explain concepts simply.'
            },
            {
                role: 'user',
                content: 'What is calculus?'
            },
            {
                role: 'assistant',
                content: 'Calculus is a branch of mathematics that studies continuous change...'
            },
            {
                role: 'user',
                content: 'Can you give me an example?'
            }
        ],
        temperature: 0.7,
        max_tokens: 200
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
    `;
}

function getModelsContent() {
    return `
        <h1>Available Models</h1>
        
        <p>HustleSynth provides access to a wide range of AI models from different providers. Choose the right model for your use case based on performance, cost, and capabilities.</p>
        
        <h2>Model Categories</h2>
        
        <h3>Chat Models</h3>
        
        <table>
            <thead>
                <tr>
                    <th>Model</th>
                    <th>Provider</th>
                    <th>Context</th>
                    <th>Credits/1K</th>
                    <th>Best For</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>gpt-3.5-turbo</code></td>
                    <td>OpenAI</td>
                    <td>4,096</td>
                    <td>1</td>
                    <td>General purpose, fast responses</td>
                </tr>
                <tr>
                    <td><code>gpt-3.5-turbo-16k</code></td>
                    <td>OpenAI</td>
                    <td>16,384</td>
                    <td>2</td>
                    <td>Longer conversations</td>
                </tr>
                <tr>
                    <td><code>gpt-4</code></td>
                    <td>OpenAI</td>
                    <td>8,192</td>
                    <td>15</td>
                    <td>Complex reasoning, analysis</td>
                </tr>
                <tr>
                    <td><code>gpt-4-turbo</code></td>
                    <td>OpenAI</td>
                    <td>128,000</td>
                    <td>5</td>
                    <td>Long context, vision capable</td>
                </tr>
                <tr>
                    <td><code>claude-3-opus</code></td>
                    <td>Anthropic</td>
                    <td>200,000</td>
                    <td>8</td>
                    <td>Advanced analysis, coding</td>
                </tr>
                <tr>
                    <td><code>claude-3-sonnet</code></td>
                    <td>Anthropic</td>
                    <td>200,000</td>
                    <td>2</td>
                    <td>Balanced performance</td>
                </tr>
                <tr>
                    <td><code>claude-2.1</code></td>
                    <td>Anthropic</td>
                    <td>100,000</td>
                    <td>4</td>
                    <td>Previous generation</td>
                </tr>
            </tbody>
        </table>
        
        <h3>Image Models</h3>
        
        <table>
            <thead>
                <tr>
                    <th>Model</th>
                    <th>Provider</th>
                    <th>Resolution</th>
                    <th>Credits/Image</th>
                    <th>Features</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>dall-e-3</code></td>
                    <td>OpenAI</td>
                    <td>1024x1024</td>
                    <td>20</td>
                    <td>High quality, text rendering</td>
                </tr>
                <tr>
                    <td><code>dall-e-2</code></td>
                    <td>OpenAI</td>
                    <td>1024x1024</td>
                    <td>10</td>
                    <td>Good quality, faster</td>
                </tr>
            </tbody>
        </table>
        
        <h3>Audio Models</h3>
        
        <table>
            <thead>
                <tr>
                    <th>Model</th>
                    <th>Provider</th>
                    <th>Type</th>
                    <th>Credits/Min</th>
                    <th>Languages</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>whisper-1</code></td>
                    <td>OpenAI</td>
                    <td>Speech-to-Text</td>
                    <td>3</td>
                    <td>50+ languages</td>
                </tr>
                <tr>
                    <td><code>tts-1</code></td>
                    <td>OpenAI</td>
                    <td>Text-to-Speech</td>
                    <td>8</td>
                    <td>Multiple voices</td>
                </tr>
                <tr>
                    <td><code>tts-1-hd</code></td>
                    <td>OpenAI</td>
                    <td>Text-to-Speech HD</td>
                    <td>15</td>
                    <td>Higher quality</td>
                </tr>
            </tbody>
        </table>
        
        <h2>Model Selection Guide</h2>
        
        <h3>For Speed</h3>
        <ul>
            <li><strong>gpt-3.5-turbo</strong> - Fastest response times</li>
            <li><strong>claude-3-sonnet</strong> - Fast with good quality</li>
        </ul>
        
        <h3>For Quality</h3>
        <ul>
            <li><strong>gpt-4</strong> - Best reasoning and analysis</li>
            <li><strong>claude-3-opus</strong> - Excellent for complex tasks</li>
        </ul>
        
        <h3>For Long Context</h3>
        <ul>
            <li><strong>claude-3-opus/sonnet</strong> - 200K token context</li>
            <li><strong>gpt-4-turbo</strong> - 128K token context</li>
        </ul>
        
        <h3>For Cost Efficiency</h3>
        <ul>
            <li><strong>gpt-3.5-turbo</strong> - Lowest cost per token</li>
            <li><strong>claude-3-sonnet</strong> - Good balance of cost/quality</li>
        </ul>
        
        <h2>List Available Models</h2>
        
        <p>Get a list of all available models:</p>
        
        <pre><code class="language-bash">GET /v1/models</code></pre>
        
        <h3>Response</h3>
        
        <pre><code class="language-json">{
    "object": "list",
    "data": [
        {
            "id": "gpt-3.5-turbo",
            "object": "model",
            "created": 1677649963,
            "owned_by": "openai",
            "permission": [...],
            "root": "gpt-3.5-turbo",
            "parent": null
        },
        {
            "id": "gpt-4",
            "object": "model",
            "created": 1687882411,
            "owned_by": "openai",
            "permission": [...],
            "root": "gpt-4",
            "parent": null
        }
        // ... more models
    ]
}</code></pre>
        
        <h2>Get Model Details</h2>
        
        <p>Get details about a specific model:</p>
        
        <pre><code class="language-bash">GET /v1/models/{model_id}</code></pre>
        
        <h3>Response</h3>
        
        <pre><code class="language-json">{
    "id": "gpt-4",
    "object": "model",
    "created": 1687882411,
    "owned_by": "openai",
    "permission": [...],
    "root": "gpt-4",
    "parent": null,
    "capabilities": {
        "max_tokens": 8192,
        "supports_functions": true,
        "supports_vision": false
    }
}</code></pre>
    `;
}

function getStreamingContent() {
    return `
        <h1>Streaming Responses</h1>
        
        <p>Stream responses in real-time using Server-Sent Events (SSE). This provides a better user experience by showing partial responses as they're generated.</p>
        
        <h2>Enabling Streaming</h2>
        
        <p>Set <code>stream: true</code> in your request:</p>
        
        <pre><code class="language-json">{
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "Write a story"}],
    "stream": true
}</code></pre>
        
        <h2>Stream Format</h2>
        
        <p>Responses are sent as Server-Sent Events with the following format:</p>
        
        <pre><code class="language-text">data: {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1677652288,"model":"gpt-3.5-turbo","choices":[{"index":0,"delta":{"content":"Hello"},"finish_reason":null}]}

data: {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1677652288,"model":"gpt-3.5-turbo","choices":[{"index":0,"delta":{"content":" there"},"finish_reason":null}]}

data: {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1677652288,"model":"gpt-3.5-turbo","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: [DONE]</code></pre>
        
        <h2>Client Examples</h2>
        
        <h3>JavaScript (Fetch API)</h3>
        
        <pre><code class="language-javascript">async function streamChat(message) {
    const response = await fetch('https://api.hustlesynth.space/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer YOUR_API_KEY',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: message }],
            stream: true
        })
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let result = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\\n');

        for (const line of lines) {
            if (line.startsWith('data: ')) {
                const data = line.slice(6);
                
                if (data === '[DONE]') {
                    console.log('Stream completed');
                    return result;
                }

                try {
                    const parsed = JSON.parse(data);
                    const content = parsed.choices[0]?.delta?.content || '';
                    result += content;
                    
                    // Update UI with partial content
                    updateUI(content);
                } catch (e) {
                    console.error('Parse error:', e);
                }
            }
        }
    }
}

function updateUI(content) {
    // Append content to your UI element
    document.getElementById('output').textContent += content;
}</code></pre>
        
        <h3>Python (SSE Client)</h3>
        
        <pre><code class="language-python">import requests
import json

def stream_chat(message):
    url = 'https://api.hustlesynth.space/v1/chat/completions'
    headers = {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
    }
    data = {
        'model': 'gpt-3.5-turbo',
        'messages': [{'role': 'user', 'content': message}],
        'stream': True
    }
    
    response = requests.post(url, headers=headers, json=data, stream=True)
    
    for line in response.iter_lines():
        if line:
            decoded_line = line.decode('utf-8')
            if decoded_line.startswith('data: '):
                data_str = decoded_line[6:]
                if data_str == '[DONE]':
                    break
                
                try:
                    data = json.loads(data_str)
                    content = data['choices'][0]['delta'].get('content', '')
                    print(content, end='', flush=True)
                except json.JSONDecodeError:
                    pass

# Usage
stream_chat("Tell me a joke")</code></pre>
        
        <h3>Node.js (EventSource)</h3>
        
        <pre><code class="language-javascript">const EventSource = require('eventsource');

function streamChat(message) {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    
    const eventSource = new EventSource(
        'https://api.hustlesynth.space/v1/chat/completions',
        {
            headers: {
                'Authorization': 'Bearer YOUR_API_KEY',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: message }],
                stream: true
            })
        }
    );
    
    eventSource.onmessage = (event) => {
        if (event.data === '[DONE]') {
            eventSource.close();
            return;
        }
        
        const data = JSON.parse(event.data);
        const content = data.choices[0]?.delta?.content || '';
        process.stdout.write(content);
    };
    
    eventSource.onerror = (error) => {
        console.error('Stream error:', error);
        eventSource.close();
    };
}</code></pre>
        
        <h2>Handling Stream Errors</h2>
        
        <p>Errors during streaming are sent as regular SSE data:</p>
        
        <pre><code class="language-text">data: {"error":{"message":"Rate limit exceeded","type":"rate_limit_error","code":"rate_limit_exceeded"}}
        
data: [DONE]</code></pre>
        
        <h2>Best Practices</h2>
        
        <ul>
            <li><strong>Connection Management</strong>: Always close the connection when done or on error</li>
            <li><strong>Error Handling</strong>: Implement proper error handling for network issues</li>
            <li><strong>UI Updates</strong>: Update UI incrementally for better user experience</li>
            <li><strong>Buffering</strong>: Buffer partial JSON chunks that span multiple SSE messages</li>
            <li><strong>Timeouts</strong>: Implement client-side timeouts for long-running streams</li>
        </ul>
        
        <h2>Streaming vs Non-Streaming</h2>
        
        <table>
            <thead>
                <tr>
                    <th>Feature</th>
                    <th>Streaming</th>
                    <th>Non-Streaming</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>First token latency</td>
                    <td>Low</td>
                    <td>High</td>
                </tr>
                <tr>
                    <td>User experience</td>
                    <td>Better (see progress)</td>
                    <td>Waiting</td>
                </tr>
                <tr>
                    <td>Implementation</td>
                    <td>More complex</td>
                    <td>Simple</td>
                </tr>
                <tr>
                    <td>Network usage</td>
                    <td>Continuous</td>
                    <td>Burst</td>
                </tr>
                <tr>
                    <td>Cancellation</td>
                    <td>Can stop mid-stream</td>
                    <td>All or nothing</td>
                </tr>
            </tbody>
        </table>
    `;
}

// Export content functions for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getAPIOverviewContent,
        getChatCompletionsContent,
        getModelsContent,
        getStreamingContent
    };
}