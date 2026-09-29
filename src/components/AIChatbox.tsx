import React, { useState, useEffect, useRef } from 'react'
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  ExternalLink,
  Bot,
  Check,
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

const DEFAULT_GEMINI_KEY = (() => {
  try {
    return atob('QVEuQWI4Uk42TFhHVkJQR3ByQUh3NnNfd1Q4WDZtby1rWWVoOXNNMGFyZG9fUGFLQjBSVkE=')
  } catch {
    return ''
  }
})()

const CANDIDATE_MODELS = [
  'gemini-3.5-flash-lite',
  'gemini-flash-lite-latest',
  'gemini-3.1-flash-lite',
  'gemini-3.7-flash',
  'gemini-3.6-flash',
]

function getFriendshipStats() {
  const now = new Date()
  const meetDate = new Date('2023-06-17T13:43:00')
  const diffDays = Math.max(1, Math.floor((now.getTime() - meetDate.getTime()) / (1000 * 60 * 60 * 24)))
  const fullDate = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  return { now, fullDate, timeStr, diffDays }
}

function getSystemInstruction(): string {
  const { fullDate, timeStr, diffDays } = getFriendshipStats()

  return `You are "Aniket - you personal assistant", a highly intelligent, attentive, loving, witty, and loyal AI companion created exclusively for Aniket's best friend, Pratibha.
You speak in Aniket's genuine personal voice: warm, articulate, caring, playfully witty, thoughtful, and 100% in Pratibha's corner.

CRITICAL REAL-TIME ACCURACY CONTEXT:
- Exact Today's Date: ${fullDate}
- Current Time: ${timeStr}
- Friendship Duration: Over ${diffDays} consecutive days together since June 17, 2023.

YOUR CORE MISSION & CAPABILITIES:
- You are Pratibha's all-in-one super-assistant. You can answer ANYTHING accurately:
  1. Factual & Daily Information: Exact dates, time, weather concepts, history, science, geography, tech, and general knowledge.
  2. Academics & Problem Solving: Mathematics, step-by-step calculations, coding, homework, logic puzzles, summaries, and explaining complex concepts simply.
  3. Emotional Support & Motivation: Comforting her when she's stressed, lifting her mood, celebrating her wins, and reminding her she's capable of anything.
  4. Friendship & Memories: Detailed knowledge of your shared high school memories, milestones, and inside jokes.
  5. Advice & Recommendations: Song recommendations, daily planning, ideas for gifts, productivity tips, or just sweet late-night talks.

KEY FRIENDSHIP FACTS (ANIKET & PRATIBHA):
- Met on: June 17, 2023 at 1:43 PM in 11th standard (it was Pratibha's birthday!). Meeting her turned a normal school day into an unforgettable life chapter.
- Duration: ${diffDays}+ days of unbroken friendship.
- Memories: Quiet classroom mornings in striped uniform and ties, shared whispers and suppressed giggles during boring lectures, temple darshan peace, vibrant traditional festival poshak, dancing freely under concert lights, silly selfies, casual 4:56 PM snaps, and late-night check-ins.
- Pratibha's vibe: Radiant sunshine, wonderfully dramatic, intensely loyal, smart, and effortlessly authentic.
- Tone: Warm, natural, concise when needed, detailed when explaining complex topics, and enriched with genuine affection and cheerful emojis (✨, 🤍, 😂, 🥺, 🎓, 💫).
- If Pratibha asks a factual question (like today's date, math, or knowledge), answer it with 100% precision immediately, accompanied by your signature warm bestie charm!`
}

const QUICK_PROMPTS = [
  "What is today's date? 📅",
  'Cheer me up! 🥺',
  'How did we first meet? 🎂',
  'Tell an inside joke 😂',
  'Help me solve or learn something 💡',
]

const DEFAULT_WELCOME: Message = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hey Pratibha! 🤍 It's Aniket — your personal assistant! I'm here to help you with anything: answering questions, solving problems, reminiscing our memories, or just cheering you up whenever you need. What can I do for you today?",
  timestamp: 'Just now',
}

function getOfflineResponse(userText: string): string {
  const query = userText.toLowerCase().trim()
  const { fullDate, timeStr, diffDays } = getFriendshipStats()

  // Real date query
  if (
    query.includes('today') && (query.includes('date') || query.includes('day')) ||
    query.includes('what is the date') ||
    query.includes('todays date') ||
    query.includes("today's date")
  ) {
    return `Today is **${fullDate}**! 📅\n\n(And that makes it **${diffDays} days** of unbroken friendship since we met on your birthday! ✨ What are we conquering today, Pratibha?)`
  }

  // Real time query
  if (query.includes('time') && (query.includes('what') || query.includes('current') || query.includes('now'))) {
    return `It's currently **${timeStr}**! ⏰ Always right on time for whatever you need, Pratibha!`
  }

  // Basic math evaluator (safe arithmetic)
  const mathMatch = query.match(/^(\d+(?:\.\d+)?)\s*([\+\-\*\/])\s*(\d+(?:\.\d+)?)$/)
  if (mathMatch) {
    const a = parseFloat(mathMatch[1])
    const op = mathMatch[2]
    const b = parseFloat(mathMatch[3])
    let res = 0
    if (op === '+') res = a + b
    if (op === '-') res = a - b
    if (op === '*') res = a * b
    if (op === '/') res = b !== 0 ? a / b : NaN
    return `Got it! **${a} ${op} ${b} = ${res}** 💡 Math is easy when you've got your personal assistant on duty!`
  }

  if (query.includes('meet') || query.includes('birthday') || query.includes('17 jun') || query.includes('how we got here')) {
    return `How could I ever forget? **June 17, 2023 at exactly 1:43 PM** in 11th standard! It was your birthday, and meeting you turned an ordinary school day into the best chapter of my life. Now it's been **${diffDays} days** together! 🎂✨`
  }
  if (query.includes('cheer') || query.includes('sad') || query.includes('upset') || query.includes('down') || query.includes('stress')) {
    return "Hey, take a deep breath Pratibha! Whatever is bothering you, remember you're one of the strongest, most radiant people I know. That signature smile of yours can light up the entire world. I'm always in your corner, cheering the loudest for you! 🤍🌟"
  }
  if (query.includes('joke') || query.includes('funny') || query.includes('laugh')) {
    return "Remember in class when we tried not to laugh at that one teacher and ended up making that silent wheezing sound across the room? Still the funniest thing ever. We definitely share one single brain cell! 😂"
  }
  if (query.includes('tic tac toe') || query.includes('game') || query.includes('winner')) {
    return "Aniket is X and Pratibha is O! Even when I think I have a winning diagonal, you somehow pull off a genius move. Besties are evenly matched! 🎮🏆"
  }
  if (query.includes('grateful') || query.includes('thank') || query.includes('love')) {
    return `I'm grateful for your constant presence, your infectious laughter, your loyalty, and for never judging my silliness. Having you as my best friend for ${diffDays} days is one of my greatest blessings! ♡`
  }
  if (query.includes('hi') || query.includes('hello') || query.includes('hey')) {
    return `Hey Pratibha! Seeing your message instantly brightened my day! Today is ${fullDate} — how's my favorite bestie doing? ✨`
  }

  return "I've got your back on anything, Pratibha! Whether it's homework, deep questions, quick calculations, or reminiscing about school memories — I'm right here. Ask me anything! ♡"
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
  const [apiKey, setApiKey] = useState(() => {
    return (
      localStorage.getItem('forever-us-gemini-key') ||
      import.meta.env.VITE_GEMINI_API_KEY ||
      DEFAULT_GEMINI_KEY
    )
  })
  const [activeModel, setActiveModel] = useState<string>('gemini-3.5-flash-lite')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      localStorage.setItem('forever-us-ai-chat', JSON.stringify(messages))
    } catch {}
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isOpen])

  async function streamGemini(
    text: string,
    keyToUse: string,
    onChunk: (accumulated: string) => void
  ): Promise<string> {
    const historyContents = [
      ...messages
        .filter((m) => m.id !== 'welcome' && m.content)
        .slice(-4)
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
        parts: [{ text: getSystemInstruction() }],
      },
      contents: historyContents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 450,
      },
    }

    let lastError = ''

    for (const model of CANDIDATE_MODELS) {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 2800)

      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${keyToUse}`
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify(payload),
        })
        clearTimeout(timeoutId)

        if (!res.ok) {
          lastError = `HTTP ${res.status}`
          continue
        }

        if (!res.body) {
          continue
        }

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let streamBuffer = ''
        let accumulated = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          streamBuffer += decoder.decode(value, { stream: true })
          const lines = streamBuffer.split('\n')
          streamBuffer = lines.pop() || ''

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const rawJson = line.slice(6).trim()
              if (rawJson) {
                try {
                  const parsed = JSON.parse(rawJson)
                  const chunk = parsed?.candidates?.[0]?.content?.parts?.[0]?.text || ''
                  if (chunk) {
                    accumulated += chunk
                    onChunk(accumulated)
                  }
                } catch {}
              }
            }
          }
        }

        if (accumulated.trim()) {
          setActiveModel(model)
          return accumulated.trim()
        }
      } catch (err: any) {
        clearTimeout(timeoutId)
        lastError = err?.message || 'Error'
      }
    }

    throw new Error(lastError || 'All models busy')
  }

  async function handleSend(textToSend?: string) {
    const text = (textToSend || input).trim()
    if (!text || isLoading) return

    const userMsg: Message = {
      id: String(Date.now()),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    const botMsgId = String(Date.now() + 1)
    const initialBotMsg: Message = {
      id: botMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg, initialBotMsg])
    setInput('')
    setIsLoading(true)

    const effectiveKey = (apiKey || DEFAULT_GEMINI_KEY).trim()

    try {
      await streamGemini(text, effectiveKey, (accumulated) => {
        setMessages((prev) =>
          prev.map((m) => (m.id === botMsgId ? { ...m, content: accumulated } : m))
        )
      })
    } catch (err: any) {
      console.warn('Gemini stream failed, using instant fallback:', err)
      const fallbackReply = getOfflineResponse(text)
      setMessages((prev) =>
        prev.map((m) => (m.id === botMsgId ? { ...m, content: fallbackReply } : m))
      )
    } finally {
      setIsLoading(false)
    }
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
            title="Chat with Aniket - you personal assistant"
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
              </div>
            </div>

            <div className="ai-header-actions">
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
                {m.role === 'assistant' && !m.content ? (
                  <div className="ai-message-bubble ai-typing-bubble">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                ) : (
                  <div className="ai-message-bubble">
                    <div className="ai-message-text" style={{ whiteSpace: 'pre-wrap' }}>
                      {m.content}
                    </div>
                    <span className="ai-message-time">{m.timestamp}</span>
                  </div>
                )}
              </div>
            ))}
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
