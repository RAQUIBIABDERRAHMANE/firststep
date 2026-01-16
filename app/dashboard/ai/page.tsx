'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { Send, Bot, User, Loader2, Sparkles, Trash2 } from 'lucide-react'
import { chat, getChatHistory, clearChatHistory } from '@/app/actions/chat'
import { getCurrentUser } from '@/app/actions/auth'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'

interface Message {
    role: 'user' | 'assistant'
    content: string
}

export default function AIPage() {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isInitialLoad, setIsInitialLoad] = useState(true)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        async function loadInitialData() {
            try {
                // 1. Get User and Services for greeting
                const user = await getCurrentUser()
                if (!user) return

                const services = user.services.map((us: any) => us.service.slug)
                const isRestaurant = services.some((s: string) => s.includes('restaurant'))
                const isCabinet = services.some((s: string) => s.includes('cabinet'))

                // 2. Get Chat History
                const history = await getChatHistory()

                if (history.success && history.messages && history.messages.length > 0) {
                    setMessages(history.messages)
                } else {
                    // Default greeting if no history
                    let greeting = `# Hi ${user.companyName}! 👋\n\nI'm your **AI business assistant**. I'm connected to your data and ready to help you:\n\n`
                    if (isCabinet) greeting += `- Manage your **Professional Cabinet** (Clients & Appointments)\n`
                    if (isRestaurant) greeting += `- Optimize your **Restaurant** (Menu & Orders)\n`
                    greeting += `- Answer platform questions\n- Provide actionable business insights\n\nWhat's on your mind today?`
                    setMessages([{ role: 'assistant', content: greeting }])
                }
            } catch (error) {
                console.error('Failed to load initial data:', error)
                setMessages([{ role: 'assistant', content: "# Hi there! 👋\n\nI'm your AI assistant. How can I help you manage your business today?" }])
            } finally {
                setIsInitialLoad(false)
            }
        }
        loadInitialData()
    }, [])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return

        const userMessage = input.trim()
        setInput('')
        setMessages(prev => [...prev, { role: 'user', content: userMessage }])
        setIsLoading(true)

        try {
            const result = await chat([
                ...messages.map(m => ({ role: m.role, content: m.content })),
                { role: 'user' as const, content: userMessage }
            ])

            if (result.success && result.message) {
                setMessages(prev => [...prev, { role: 'assistant', content: result.message! }])
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: `❌ **Error:** ${result.error || 'Something went wrong. Please try again.'}` }])
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: '❌ **Connection Error:** Failed to reach the AI service. Please check your connection.' }])
        } finally {
            setIsLoading(false)
        }
    }

    const clearChat = async () => {
        await clearChatHistory()
        setMessages([
            { role: 'assistant', content: "# Chat Cleared! 🧹\n\nI'm ready for a new conversation. How can I help you?" }
        ])
    }

    return (
        <div className="flex flex-col h-[calc(100vh-120px)]">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Bot className="h-7 w-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black flex items-center gap-2">
                            AI Assistant
                            <Sparkles className="h-5 w-5 text-yellow-500" />
                        </h1>
                        <p className="text-sm text-muted-foreground">Powered by Groq • Context-aware Universal Assistant</p>
                    </div>
                </div>
                <Button variant="outline" onClick={clearChat} className="gap-2">
                    <Trash2 size={16} />
                    Clear Chat
                </Button>
            </div>

            {/* Messages Area */}
            <Card className="flex-1 overflow-hidden flex flex-col">
                <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            className={cn(
                                "flex gap-4",
                                msg.role === 'user' && "flex-row-reverse"
                            )}
                        >
                            <div className={cn(
                                "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                                msg.role === 'assistant'
                                    ? "bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600"
                                    : "bg-slate-200 text-slate-600"
                            )}>
                                {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
                            </div>
                            <div className={cn(
                                "max-w-[75%] px-5 py-4 rounded-2xl",
                                msg.role === 'assistant'
                                    ? "bg-white border border-slate-200 shadow-sm"
                                    : "bg-indigo-600 text-white"
                            )}>
                                {msg.role === 'assistant' ? (
                                    <div className="prose prose-sm prose-slate max-w-none prose-headings:mt-2 prose-headings:mb-2 prose-p:my-1 prose-ul:my-1 prose-li:my-0">
                                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                                    </div>
                                ) : (
                                    <p className="text-sm">{msg.content}</p>
                                )}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-4">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 flex items-center justify-center">
                                <Bot size={20} />
                            </div>
                            <div className="bg-white border border-slate-200 shadow-sm px-5 py-4 rounded-2xl flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
                                <span className="text-sm text-slate-500">Thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </CardContent>

                {/* Input */}
                <div className="p-4 border-t bg-slate-50">
                    <form onSubmit={handleSubmit} className="flex gap-3">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me anything about your business..."
                            className="flex-1 h-12 rounded-xl border-slate-200 bg-white text-base"
                            disabled={isLoading}
                        />
                        <Button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="h-12 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700"
                        >
                            <Send size={20} />
                        </Button>
                    </form>
                </div>
            </Card>
        </div>
    )
}
