'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { Send, Bot, User, Loader2, Sparkles, Trash2, Image as ImageIcon, ArrowRight } from 'lucide-react'
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
    "Génère une bannière moderne pour notre service Menu Dynamic de restaurant, photo pro",
    "Rédige un email de prospection pour les cabinets médicaux",
    "Écris 3 slogans originaux pour notre module de Gestion de Stock & Location"
  ]

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-5xl mx-auto space-y-4 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 text-xs font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-600" />
              IA Générative Intégrée
            </span>
            <span className="text-xs text-slate-400 font-mono">Gemini & Imagen 3</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
            Assistant Marketing IA
          </h1>
          <p className="text-xs text-slate-500">
            Génération de contenu promotionnel, bannières publicitaires et visuels pour vos modules SaaS.
          </p>
        </div>

        <button
          onClick={clearChat}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-xs font-semibold transition-colors cursor-pointer self-start sm:self-center"
        >
          <Trash2 size={13} />
          <span>Effacer le chat</span>
        </button>
      </div>

      {/* Preset Quick Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Idées rapides :</span>
        {presets.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => applyPreset(preset)}
            className="px-3 py-1 rounded-xl bg-white border border-slate-200/80 hover:border-cyan-500/50 hover:bg-cyan-50/50 text-[11px] font-medium text-slate-600 hover:text-cyan-700 transition-all shrink-0 cursor-pointer shadow-2xs"
          >
            {preset}
          </button>
        ))}
      </div>

      {/* Messages Window */}
      <div className="flex-1 overflow-hidden flex flex-col bg-white rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                "flex gap-3.5",
                msg.role === 'user' && "flex-row-reverse"
              )}
            >
              <div className={cn(
                "h-8 w-8 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs",
                msg.role === 'model'
                  ? "bg-gradient-to-br from-indigo-50 to-cyan-50 text-indigo-600 border border-indigo-100"
                  : "bg-slate-900 text-white"
              )}>
                {msg.role === 'model' ? <Bot size={16} /> : <User size={16} />}
              </div>
              <div className={cn(
                "max-w-[85%] px-5 py-3.5 rounded-3xl text-xs leading-relaxed",
                msg.role === 'model'
                  ? "bg-slate-50/80 border border-slate-100 text-slate-800"
                  : "bg-cyan-600 text-white font-medium shadow-xs"
              )}>
                {msg.role === 'model' ? (
                  <div className="prose prose-xs prose-slate max-w-none 
                    prose-headings:text-slate-900 prose-headings:font-bold prose-headings:mt-2 prose-headings:mb-1.5 
                    prose-p:my-1.5 prose-ul:my-1.5 prose-ol:my-1.5 prose-li:my-0.5 prose-strong:text-slate-900 prose-strong:font-bold
                    prose-code:text-cyan-700 prose-code:bg-cyan-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded-md font-sans">
                    <ReactMarkdown
                      components={{
                        img: ({ src, alt }) => (
                          <span className="block my-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs max-w-xl">
                            <img
                              src={src}
                              alt={alt}
                              className="w-full h-auto object-cover max-h-[350px]"
                              loading="lazy"
                            />
                            {alt && (
                              <span className="block text-center text-[10px] text-slate-400 py-2 border-t border-slate-100 bg-slate-50 font-medium">
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
            <div className="flex gap-3 items-center text-xs text-slate-400">
              <div className="h-8 w-8 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <span className="font-semibold text-slate-600">Génération de la réponse en cours…</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Posez votre question ou décrivez l'image/le texte à concevoir..."
              disabled={isLoading}
              className="flex-1 bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all font-sans"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-5 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-xs hover:shadow-md transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
            >
              <span>Envoyer</span>
              <Send size={13} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
