'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { Send, Bot, User, Loader2, Sparkles, Trash2, Image as ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'

interface Message {
  role: 'user' | 'model'
  content: string
}

export default function AdminMarketingPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const defaultGreeting = `# Assistant Marketing IA 🚀\n\nJe suis votre **concepteur marketing intelligent** pour FirstStep.\n\nJe suis connecté aux modèles **Gemini** (pour le texte) et **Imagen 3** (pour les images). Je peux vous aider à :\n\n- **Générer des images publicitaires / bannières** : Écrivez simplement *« Génère une image de... »* ou *« Crée une bannière pour... »*\n- **Rédiger du contenu de vente** : Des e-mails promotionnels, des fiches de présentation, des SMS clients ou des bannières pour vos sites SaaS.\n- **Concevoir des slogans** percutants pour vos modules de restauration, de cabinet médical ou de gestion des stocks.\n\nQue voulez-vous créer aujourd'hui ?`

  useEffect(() => {
    // Load chat history from localStorage if available, otherwise set greeting
    const localHistory = localStorage.getItem('fs_marketing_chat')
    if (localHistory) {
      try {
        setMessages(JSON.parse(localHistory))
      } catch {
        setMessages([{ role: 'model', content: defaultGreeting }])
      }
    } else {
      setMessages([{ role: 'model', content: defaultGreeting }])
    }
  }, [])

  const saveHistory = (newMessages: Message[]) => {
    setMessages(newMessages)
    localStorage.setItem('fs_marketing_chat', JSON.stringify(newMessages))
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    
    const updatedMessages = [...messages, { role: 'user' as const, content: userMessage }]
    saveHistory(updatedMessages)
    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/marketing/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages
        })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.message) {
          saveHistory([...updatedMessages, result.message])
        } else {
          saveHistory([
            ...updatedMessages,
            { role: 'model', content: `❌ **Erreur :** ${result.error || 'Échec de la réponse de l\'IA.'}` }
          ])
        }
      } else {
        let errorMsg = 'Impossible de contacter le serveur.'
        try {
          const result = await response.json()
          if (result && result.error) {
            errorMsg = result.error
          }
        } catch {}
        saveHistory([
          ...updatedMessages,
          { role: 'model', content: `❌ **Erreur API :** ${errorMsg}` }
        ])
      }
    } catch (error) {
      saveHistory([
        ...updatedMessages,
        { role: 'model', content: '❌ **Erreur de connexion :** Impossible d\'accéder à l\'assistant.' }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = () => {
    const freshMessages: Message[] = [
      { role: 'model', content: "# Discussion réinitialisée ! 🧹\n\nComment puis-je vous aider dans votre stratégie marketing aujourd'hui ?" }
    ]
    saveHistory(freshMessages)
  }

  const applyPreset = (preset: string) => {
    setInput(preset)
  }

  const presets = [
    "Génère une image de bannière moderne pour notre service Menu Dynamic de restaurant, style photo professionnelle",
    "Rédige un email de prospection pour les cabinets médicaux pour leur vendre notre solution de prise de rendez-vous",
    "Écris 3 slogans originaux pour notre module de Gestion de Stock & Location"
  ]

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              IA Assistant Marketing
            </h1>
            <p className="text-xs text-slate-500">
              Génération de contenu (Gemini) • Création d&apos;images (Imagen 3) • Hébergement Cloudflare R2
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={clearChat} className="gap-2 border-slate-200 text-slate-600 hover:bg-slate-50">
          <Trash2 size={15} />
          <span className="hidden sm:inline">Effacer la discussion</span>
        </Button>
      </div>

      {/* Messages Window */}
      <Card className="flex-1 overflow-hidden flex flex-col border-slate-200 shadow-sm bg-white rounded-2xl">
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
                "h-9 w-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                msg.role === 'model'
                  ? "bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-600 border border-blue-100"
                  : "bg-slate-100 text-slate-600 border border-slate-200"
              )}>
                {msg.role === 'model' ? <Bot size={18} /> : <User size={18} />}
              </div>
              <div className={cn(
                "max-w-[80%] px-5 py-4 rounded-2xl shadow-sm text-sm leading-relaxed",
                msg.role === 'model'
                  ? "bg-slate-50/50 border border-slate-100 text-slate-800"
                  : "bg-blue-600 text-white"
              )}>
                {msg.role === 'model' ? (
                  <div className="prose prose-sm prose-slate max-w-none 
                    prose-headings:text-slate-900 prose-headings:font-bold prose-headings:mt-3 prose-headings:mb-2 
                    prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-strong:text-slate-900 prose-strong:font-bold
                    prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1 prose-code:rounded">
                    <ReactMarkdown
                      components={{
                        img: ({ src, alt }) => (
                          <span className="block my-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm max-w-xl">
                            <img
                              src={src}
                              alt={alt}
                              className="w-full h-auto object-cover max-h-[350px]"
                              loading="lazy"
                            />
                            {alt && (
                              <span className="block text-center text-xs text-slate-400 py-2.5 border-t border-slate-100 bg-slate-50/50 font-medium">
                                {alt}
                              </span>
                            )}
                          </span>
                        )
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-line">{msg.content}</p>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-600 border border-blue-100 flex items-center justify-center shadow-sm">
                <Bot size={18} />
              </div>
              <div className="bg-slate-50 border border-slate-100 shadow-sm px-5 py-4 rounded-2xl flex items-center gap-2.5">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                <span className="text-sm text-slate-500 font-medium flex items-center gap-1.5">
                  L&apos;IA réfléchit et génère le contenu...
                  <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>

        {/* Suggestion Chips */}
        {messages.length <= 1 && !isLoading && (
          <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/30">
            <p className="text-xs text-slate-400 font-bold mb-2 uppercase tracking-wider">Suggestions rapides :</p>
            <div className="flex flex-col gap-2">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => applyPreset(preset)}
                  className="text-left text-xs bg-white hover:bg-blue-50 hover:text-blue-700 text-slate-600 px-3 py-2 rounded-xl border border-slate-200 transition-all font-medium cursor-pointer truncate shadow-2xs"
                >
                  ✨ {preset}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* User Input Form */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Demandez-moi de rédiger un texte ou de générer une image..."
              className="flex-1 h-12 rounded-xl border-slate-200 bg-white text-sm"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="h-12 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white cursor-pointer transition-all flex items-center justify-center"
            >
              <Send size={16} />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}
