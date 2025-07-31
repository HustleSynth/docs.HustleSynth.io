// Global state
let currentChatId = null;
let chats = {};
let settings = {
    temperature: 0.7,
    maxTokens: 1000,
    streaming: true,
    apiKeys: {
        openai: '',
        anthropic: '',
        hustlesynth: ''
    }
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    loadChats();
    
    // Check if we have existing chats
    const chatIds = Object.keys(chats);
    if (chatIds.length > 0) {
        // Load the most recent chat or the last active one
        const lastActiveChatId = localStorage.getItem('lastActiveChatId');
        if (lastActiveChatId && chats[lastActiveChatId]) {
            selectChat(lastActiveChatId);
        } else {
            // Select the most recent chat
            const mostRecentChat = Object.values(chats)
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
            selectChat(mostRecentChat.id);
        }
    } else {
        // Only create new chat if no chats exist
        createNewChat();
    }
    
    updateCharCount();
});

// Load settings from localStorage
function loadSettings() {
    const saved = localStorage.getItem('chatSettings');
    if (saved) {
        settings = { ...settings, ...JSON.parse(saved) };
        // Update UI
        document.getElementById('temperature').value = settings.temperature;
        document.getElementById('tempValue').textContent = settings.temperature;
        document.getElementById('maxTokens').value = settings.maxTokens;
        document.getElementById('streamResponses').checked = settings.streaming;
        
        // Load API keys
        if (settings.apiKeys.openai) {
            document.getElementById('openaiKey').value = settings.apiKeys.openai;
        }
        if (settings.apiKeys.anthropic) {
            document.getElementById('anthropicKey').value = settings.apiKeys.anthropic;
        }
        if (settings.apiKeys.hustlesynth) {
            document.getElementById('hustlesynthKey').value = settings.apiKeys.hustlesynth;
        }
    }
}

// Save settings to localStorage
function saveSettings() {
    localStorage.setItem('chatSettings', JSON.stringify(settings));
}

// Load chats from localStorage
function loadChats() {
    const saved = localStorage.getItem('chats');
    if (saved) {
        chats = JSON.parse(saved);
        renderChatList();
    }
}

// Save chats to localStorage
function saveChats() {
    localStorage.setItem('chats', JSON.stringify(chats));
}

// Create new chat
function createNewChat() {
    const chatId = Date.now().toString();
    chats[chatId] = {
        id: chatId,
        title: 'New Chat',
        messages: [],
        model: document.getElementById('modelSelect').value,
        createdAt: new Date().toISOString()
    };
    
    currentChatId = chatId;
    // Save last active chat ID
    localStorage.setItem('lastActiveChatId', chatId);
    saveChats();
    renderChatList();
    renderMessages();
}

// Render chat list
function renderChatList() {
    const chatList = document.getElementById('chatList');
    chatList.innerHTML = '';
    
    // Sort chats by creation date (newest first)
    const sortedChats = Object.values(chats).sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    sortedChats.forEach(chat => {
        const chatItem = document.createElement('div');
        chatItem.className = `chat-item ${chat.id === currentChatId ? 'active' : ''}`;
        chatItem.innerHTML = `
            <span class="chat-item-title">${chat.title}</span>
            <button class="chat-item-delete" onclick="deleteChat('${chat.id}', event)">
                <i class="fas fa-trash"></i>
            </button>
        `;
        chatItem.onclick = () => selectChat(chat.id);
        chatList.appendChild(chatItem);
    });
}

// Select chat
function selectChat(chatId) {
    currentChatId = chatId;
    // Save last active chat ID
    localStorage.setItem('lastActiveChatId', chatId);
    document.getElementById('modelSelect').value = chats[chatId].model;
    renderChatList();
    renderMessages();
}

// Delete chat
function deleteChat(chatId, event) {
    event.stopPropagation();
    if (confirm('Delete this chat?')) {
        delete chats[chatId];
        
        // If deleting the current chat, switch to another or create new
        if (chatId === currentChatId) {
            const remainingChats = Object.keys(chats);
            if (remainingChats.length > 0) {
                // Select the most recent remaining chat
                const mostRecentChat = Object.values(chats)
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
                selectChat(mostRecentChat.id);
            } else {
                // No chats left, create a new one
                createNewChat();
            }
        } else {
            saveChats();
            renderChatList();
        }
    }
}

// Clear current chat
function clearCurrentChat() {
    if (confirm('Clear all messages in this chat?')) {
        chats[currentChatId].messages = [];
        chats[currentChatId].title = 'New Chat';
        saveChats();
        renderChatList();
        renderMessages();
    }
}

// Render messages
function renderMessages() {
    const container = document.getElementById('messagesContainer');
    const chat = chats[currentChatId];
    
    if (!chat || chat.messages.length === 0) {
        container.innerHTML = `
            <div class="welcome-message">
                <h1>Welcome to HustleSynth Chat</h1>
                <p>Select a model and start chatting with AI</p>
                <div class="suggestions">
                    <button onclick="sendMessage('Explain quantum computing in simple terms')">
                        <i class="fas fa-atom"></i> Explain quantum computing
                    </button>
                    <button onclick="sendMessage('Write a Python function to sort a list')">
                        <i class="fas fa-code"></i> Python sorting function
                    </button>
                    <button onclick="sendMessage('What are the benefits of meditation?')">
                        <i class="fas fa-brain"></i> Benefits of meditation
                    </button>
                </div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    chat.messages.forEach(msg => {
        const messageEl = createMessageElement(msg.role, msg.content);
        container.appendChild(messageEl);
    });
    
    container.scrollTop = container.scrollHeight;
}

// Create message element
function createMessageElement(role, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = role === 'user' ? 
        '<i class="fas fa-user"></i>' : 
        '<i class="fas fa-robot"></i>';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = formatMessage(content);
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(contentDiv);
    
    return messageDiv;
}

// Format message content (basic markdown support)
function formatMessage(content) {
    // Escape HTML
    content = content.replace(/&/g, '&amp;')
                     .replace(/</g, '&lt;')
                     .replace(/>/g, '&gt;')
                     .replace(/"/g, '&quot;')
                     .replace(/'/g, '&#039;');
    
    // Code blocks
    content = content.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
    
    // Inline code
    content = content.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Bold
    content = content.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    // Italic
    content = content.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    
    // Line breaks
    content = content.replace(/\n/g, '<br>');
    
    return content;
}

// Send message
async function sendMessage(text = null) {
    const input = document.getElementById('messageInput');
    const messageText = text || input.value.trim();
    
    if (!messageText) return;
    
    const chat = chats[currentChatId];
    const model = document.getElementById('modelSelect').value;
    
    // Update chat model
    chat.model = model;
    
    // Add user message
    chat.messages.push({
        role: 'user',
        content: messageText
    });
    
    // Update chat title if it's the first message
    if (chat.messages.length === 1) {
        chat.title = messageText.substring(0, 30) + (messageText.length > 30 ? '...' : '');
    }
    
    // Clear input
    input.value = '';
    updateCharCount();
    autoResize(input);
    
    // Disable send button
    document.getElementById('sendBtn').disabled = true;
    
    // Save and render
    saveChats();
    renderChatList();
    renderMessages();
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        // Get API response
        const response = await callAI(model, chat.messages);
        
        // Remove typing indicator
        hideTypingIndicator();
        
        // Add assistant message
        chat.messages.push({
            role: 'assistant',
            content: response
        });
        
        // Save and render
        saveChats();
        renderMessages();
    } catch (error) {
        hideTypingIndicator();
        alert('Error: ' + error.message);
    } finally {
        document.getElementById('sendBtn').disabled = false;
    }
}

// Call AI API through worker
async function callAI(model, messages) {
    const provider = getProvider(model);
    const apiKey = settings.apiKeys[provider];
    
    if (!apiKey) {
        throw new Error(`Please add your ${provider} API key in settings`);
    }
    
    const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model,
            messages,
            temperature: settings.temperature,
            max_tokens: settings.maxTokens,
            stream: settings.streaming,
            api_key: apiKey
        })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'API request failed');
    }
    
    if (settings.streaming) {
        return await handleStreamResponse(response);
    } else {
        const data = await response.json();
        return data.content;
    }
}

// Handle streaming response
async function handleStreamResponse(response) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let content = '';
    
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
            if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') continue;
                
                try {
                    const parsed = JSON.parse(data);
                    if (parsed.content) {
                        content += parsed.content;
                        // Update message in real-time
                        updateLastAssistantMessage(content);
                    }
                } catch (e) {
                    // Ignore parse errors
                }
            }
        }
    }
    
    return content;
}

// Update last assistant message
function updateLastAssistantMessage(content) {
    const messages = document.querySelectorAll('.message.assistant');
    if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        const contentDiv = lastMessage.querySelector('.message-content');
        contentDiv.innerHTML = formatMessage(content);
    }
}

// Get provider from model
function getProvider(model) {
    if (model.startsWith('gpt')) return 'openai';
    if (model.startsWith('claude')) return 'anthropic';
    return 'hustlesynth';
}

// Show typing indicator
function showTypingIndicator() {
    const container = document.getElementById('messagesContainer');
    const indicator = document.createElement('div');
    indicator.className = 'message assistant';
    indicator.id = 'typingIndicator';
    indicator.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `;
    container.appendChild(indicator);
    container.scrollTop = container.scrollHeight;
}

// Hide typing indicator
function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.remove();
    }
}

// Handle key press
function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

// Auto resize textarea
function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

// Update character count
function updateCharCount() {
    const input = document.getElementById('messageInput');
    const count = document.getElementById('charCount');
    count.textContent = input.value.length;
}

// Toggle sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('show');
    // Save current state when toggling sidebar
    if (currentChatId) {
        localStorage.setItem('lastActiveChatId', currentChatId);
    }
}

// Settings functions
function openSettings() {
    document.getElementById('settingsModal').classList.add('show');
}

function closeSettings() {
    document.getElementById('settingsModal').classList.remove('show');
}

function saveApiKey(provider, value) {
    settings.apiKeys[provider] = value;
    saveSettings();
}

function toggleVisibility(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    
    if (input.type === 'password') {
        input.type = 'text';
        button.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        input.type = 'password';
        button.innerHTML = '<i class="fas fa-eye"></i>';
    }
}

function updateTemperature(value) {
    settings.temperature = parseFloat(value);
    document.getElementById('tempValue').textContent = value;
    saveSettings();
}

function updateMaxTokens(value) {
    settings.maxTokens = parseInt(value);
    saveSettings();
}

function updateStreaming(checked) {
    settings.streaming = checked;
    saveSettings();
}

function updateModel() {
    const model = document.getElementById('modelSelect').value;
    if (chats[currentChatId]) {
        chats[currentChatId].model = model;
        saveChats();
    }
}

// Clear all data
function clearAllData() {
    if (confirm('This will delete all chats and settings. Are you sure?')) {
        localStorage.clear();
        location.reload();
    }
}

// Export chats
function exportChats() {
    const data = JSON.stringify(chats, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hustlesynth-chats-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// Handle message input
document.getElementById('messageInput').addEventListener('input', function() {
    updateCharCount();
    autoResize(this);
});

// Save state before page unload
window.addEventListener('beforeunload', () => {
    if (currentChatId) {
        localStorage.setItem('lastActiveChatId', currentChatId);
        saveChats();
    }
});