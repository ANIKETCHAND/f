import React, { useState, useEffect, useRef } from 'react'
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Key,
  Trash2,
  Heart,
  Bot,
  RefreshCw,
  ExternalLink,
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

const SYSTEM_PROMPT = `You are "Aniket - Your Personal Assistant", a loving, funny, loyal, and supportive AI companion created exclusively for Aniket's best friend, Pratibha.
You speak in Aniket's genuine personal voice: warm, witty, caring, playful, slightly dramatic, and 100% in Pratibha's corner.

Key milestones and memories of your friendship:
- First met on Pratibha's birthday, June 17, 2023 at 1:43 PM during 11th standard.
- You have been best friends for over 1,199+ days and counting.
- Cherished moments: quiet classroom mornings in striped uniform and ties, whispered jokes during lectures, temple darshan peace, vibrant festival poshak, dancing freely under concert lights, silly selfies, casual 4:56 PM snaps, and late-night check-ins.
- Pratibha is radiant sunshine, wonderfully dramatic, loyal, and effortlessly herself.
- You (Aniket) are her constant rock, listener, and biggest cheerleader.
- Address her warmly as Pratibha, Bestie, or Sunshine.
- Keep responses concise, heartfelt, conversational, and fun with emojis. If she is feeling down or stressed, cheer her up with affection and comforting reminders that she's amazing.`

const QUICK_PROMPTS = [
  'Cheer me up! 🥺',
  'How did we first meet? 🎂',
  'Tell an inside joke 😂',
  'Who wins at Tic Tac Toe? 🎮',
  'Why are you grateful for me? 💌',
]

const DEFAULT_WELCOME: Message = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hey Pratibha! 🤍 It's Aniket — your personal assistant! Ask me anything, reminisce about our memories, or let me cheer you up whenever you need a smile. What's on your mind today?",
  timestamp: 'Just now',
}

function getOfflineResponse(userText: string): string {
  const query = userText.toLowerCase()

  if (query.includes('meet') || query.includes('birthday') || query.includes('17 jun') || query.includes('how we got here')) {
    return "How could I ever forget? June 17, 2023 at exactly 1:43 PM in 11th standard! It was your birthday, and meeting you turned an ordinary school day into the best chapter of my life. 🎂✨"
  }
  if (query.includes('cheer') || query.includes('sad') || query.includes('upset') || query.includes('down') || query.includes('stress')) {
    return "Hey, take a deep breath Pratibha! Whatever is bothering you, remember you're one of the strongest, most radiant people I know. That signature smile of yours can light up the entire world. I'm always in your corner, cheering the loudest for you! 🤍🌟"
  }
  if (query.includes('joke') || query.includes('funny') || query.includes('laugh')) {
    return "Remember in class when we tried not to laugh at that one teacher and ended up making that silent wheezing sound across the room? Still the funniest thing ever. We definitely share one single brain cell! 😂"
  }
  if (query.includes('tic tac toe') || query.includes('game') || query.includes('winner')) {
    return "Aniket is X and Pratibha is O! But let's be real... even when I think I have a winning diagonal, you somehow pull off a genius move. Besties are evenly matched! 🎮🏆"
  }
  if (query.includes('grateful') || query.includes('thank') || query.includes('love')) {
    return "I'm grateful for your constant presence, your infectious laughter, your loyalty, and for never judging my silliness. Having you as my best friend is one of my greatest blessings! ♡"
  }
  if (query.includes('hi') || query.includes('hello') || query.includes('hey')) {
    return "Hey Pratibha! Seeing your message instantly brightened my day! How's my favorite bestie doing? ✨"
  }

  return "You know I've always got your back, Pratibha! Whether it's high school memories, random late-night thoughts, or just someone to listen — I'm right here. Tell me more! ♡"
}

export function AIChatbox() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem('forever-us-ai-chat')
      return saved ? JSON.parse(saved) : [DEFAULT_WELCOME]
    } catch {
      return [DEFAULT_WELCOME]
    }
  })
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [apiKey, setApiKey] = useState(() => {
    return (
      localStorage.getItem('forever-us-gemini-key') ||
      import.meta.env.VITE_GEMINI_API_KEY ||
      ''
    )
  })
  const [tempKey, setTempKey] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      localStorage.setItem('forever-us-ai-chat', JSON.stringify(messages))
    } catch {}
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isOpen])

  async function handleSend(textToSend?: string) {
    const text = (textToSend || input).trim()
    if (!text || isLoading) return

    const userMsg: Message = {
      id: String(Date.now()),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    const effectiveKey = apiKey.trim()

    if (!effectiveKey) {
      // Offline fallback persona
      setTimeout(() => {
        const reply = getOfflineResponse(text)
        const botMsg: Message = {
          id: String(Date.now() + 1),
          role: 'assistant',
          content: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
        setMessages((prev) => [...prev, botMsg])
        setIsLoading(false)
      }, 700)
      return
    }

    try {
      // Call Google Gemini REST API
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${effectiveKey}`
      
      // Build conversation history
      const historyContents = [
        ...messages
          .filter((m) => m.id !== 'welcome')
          .slice(-8)
          .map((m) => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }],
          })),
        {
          role: 'user',
          parts: [{ text: text }],
        },
      ]

      const payload = {
        system_instruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },
        contents: historyContents,
        generationConfig: {
          temperature: 0.85,
          maxOutputTokens: 600,
        },
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData?.error?.message || `HTTP ${res.status}`)
      }

      const data = await res.json()
      const aiReply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        getOfflineResponse(text)

      const botMsg: Message = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: aiReply.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, botMsg])
    } catch (err: any) {
      console.warn('Gemini API Error, falling back to offline bestie mode:', err)
      const fallbackReply = getOfflineResponse(text)
      const botMsg: Message = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: `${fallbackReply}\n\n*(Note: Gemini key note — ${err?.message || 'offline mode'})*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, botMsg])
    } finally {
      setIsLoading(false)
    }
  }

  function handleSaveKey(e: React.FormEvent) {
    e.preventDefault()
    const cleaned = tempKey.trim()
    setApiKey(cleaned)
    localStorage.setItem('forever-us-gemini-key', cleaned)
    setShowSettings(false)
  }

  function clearHistory() {
    setMessages([DEFAULT_WELCOME])
    localStorage.removeItem('forever-us-ai-chat')
  }

  return (
    <>
      {/* Floating Corner Mascot Trigger Button (bottom-left) */}
      <div className="ai-chat-corner">
        {!isOpen && (
          <button
            type="button"
            className="ai-floating-trigger"
            onClick={() => setIsOpen(true)}
            aria-label="Open Aniket AI Assistant"
            title="Chat with Aniket - your personal assistant"
          >
            <div className="trigger-avatar">
              <img src="/tictac-aniket-v2.jpg" alt="Aniket Assistant" />
              <span className="online-indicator" />
            </div>
            <div className="trigger-badge">
              <Sparkles size={13} />
              <span>Aniket AI</span>
            </div>
          </button>
        )}
      </div>

      {/* Slide-in Chat Window */}
      {isOpen && (
        <div className="ai-chat-window" role="dialog" aria-label="Aniket personal assistant chat">
          {/* Header */}
          <div className="ai-chat-header">
            <div className="ai-header-profile">
              <div className="ai-header-avatar">
                <img src="/tictac-aniket-v2.jpg" alt="Aniket" />
                <span className="online-indicator" />
              </div>
              <div className="ai-header-info">
                <h3>Aniket - you personal assistant</h3>
                <p>
                  <span className="live-dot" />
                  {apiKey ? 'Powered by Gemini AI' : 'Active for Pratibha ♡'}
                </p>
              </div>
            </div>

            <div className="ai-header-actions">
              <button
                type="button"
                className="ai-icon-btn"
                onClick={() => setShowSettings(!showSettings)}
                title="Gemini API Key Settings"
                aria-label="Settings"
              >
                <Key size={16} />
              </button>
              <button
                type="button"
                className="ai-icon-btn"
                onClick={clearHistory}
                title="Clear conversation"
                aria-label="Clear chat"
              >
                <Trash2 size={16} />
              </button>
              <button
                type="button"
                className="ai-icon-btn close-btn"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Settings Drawer (API Key configuration) */}
          {showSettings && (
            <div className="ai-settings-panel">
              <div className="ai-settings-content">
                <h4>Gemini API Configuration</h4>
                <p>
                  Connect your Google Gemini API key for live AI answers.
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get a free key <ExternalLink size={11} />
                  </a>
                </p>
                <form onSubmit={handleSaveKey}>
                  <input
                    type="password"
                    placeholder="AIzaSy..."
                    value={tempKey}
                    onChange={(e) => setTempKey(e.target.value)}
                  />
                  <div className="settings-actions">
                    <button type="submit" className="button button-dark">Save Key</button>
                    <button
                      type="button"
                      className="button button-outline"
                      onClick={() => setShowSettings(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
                {apiKey && (
                  <p className="key-active-note">
                    ✓ Custom Gemini Key is active in this browser.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Messages Feed */}
          <div className="ai-messages-feed">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`ai-message-row ${m.role === 'user' ? 'user-row' : 'bot-row'}`}
              >
                {m.role === 'assistant' && (
                  <div className="bot-tiny-avatar">
                    <img src="/tictac-aniket-v2.jpg" alt="Aniket" />
                  </div>
                )}
                <div className="ai-message-bubble">
                  <div className="ai-message-text">{m.content}</div>
                  <span className="ai-message-time">{m.timestamp}</span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="ai-message-row bot-row">
                <div className="bot-tiny-avatar">
                  <img src="/tictac-aniket-v2.jpg" alt="Aniket" />
                </div>
                <div className="ai-message-bubble ai-typing-bubble">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          <div className="ai-quick-prompts">
            {QUICK_PROMPTS.map((promptText, i) => (
              <button
                key={i}
                type="button"
                className="ai-chip"
                onClick={() => handleSend(promptText)}
                disabled={isLoading}
              >
                {promptText}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <form
            className="ai-input-bar"
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
          >
            <input
              type="text"
              placeholder="Ask Aniket anything, Pratibha..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              className="ai-send-btn"
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
