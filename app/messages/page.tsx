'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Send, Search, MessageCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { getUserConversations, sendMessage, formatTime } from '@/lib/supabase/queries'

interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  timestamp: string
  isRead: boolean
}

interface Conversation {
  id: string
  userId: string
  userName: string
  userAvatar: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  productId?: string
  productTitle?: string
  messages: Message[]
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversationId, setSelectedConversationId] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [messageInput, setMessageInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    loadConversations()
  }, [])

  const loadConversations = async () => {
    try {
      const supabase = createClient()
      const { data: { user }, error: userError } = await supabase.auth.getUser()

      if (userError) {
        console.error('Auth error:', userError)
        return
      }

      if (!user) {
        console.log('No user found')
        return
      }

      console.log('User authenticated:', user.id)
      setCurrentUser(user)

      const conversations = await getUserConversations(user.id)
      console.log('Conversations loaded:', conversations.length)
      setConversations(conversations)

      // Auto-select first conversation
      if (conversations.length > 0 && !selectedConversationId) {
        setSelectedConversationId(conversations[0].id)
      }
    } catch (error) {
      console.error('Error loading messages:', error)
      // You could set an error state here to show to the user
    } finally {
      setLoading(false)
    }
  }

  const filteredConversations = conversations.filter((conv) =>
    conv.userName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedConversation = conversations.find((c) => c.id === selectedConversationId)

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageInput.trim() || !selectedConversation || !currentUser) return

    try {
      await sendMessage(
        currentUser.id,
        selectedConversation.userId,
        messageInput.trim(),
        selectedConversation.productId
      )

      setMessageInput('')
      loadConversations() // Reload to show new message
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
        {/* Back to Dashboard */}
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-6">
          <ArrowLeft size={20} />
          Volver al dashboard
        </Link>

        <h1 className="text-3xl font-bold text-green-900 mb-6">Mis Mensajes</h1>

        <div className="flex-1 bg-white rounded-xl shadow-lg overflow-hidden flex">
          {/* Conversaciones */}
          <div className="w-full md:w-80 border-r border-gray-200 flex flex-col">
            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <Input
                type="text"
                placeholder="Buscar conversaciones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <p>Cargando conversaciones...</p>
                </div>
              ) : filteredConversations.length > 0 ? (
                filteredConversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedConversationId(conversation.id)}
                    className={`w-full p-4 border-b border-gray-100 text-left hover:bg-green-50 transition-colors ${
                      selectedConversationId === conversation.id ? 'bg-green-100' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      <img
                        src={conversation.userAvatar}
                        alt={conversation.userName}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="font-bold text-gray-900 truncate">
                            {conversation.userName}
                          </h3>
                          {conversation.unreadCount > 0 && (
                            <span className="bg-green-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.productTitle}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {conversation.lastMessageTime}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <MessageCircle size={48} className="mb-2 text-gray-300" />
                  <p>No hay conversaciones</p>
                </div>
              )}
            </div>
          </div>

          {/* Chat Window */}
          {selectedConversation ? (
            <div className="hidden md:flex flex-1 flex-col">
              {/* Header */}
              <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                <img
                  src={selectedConversation.userAvatar}
                  alt={selectedConversation.userName}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h2 className="font-bold text-gray-900">{selectedConversation.userName}</h2>
                  {selectedConversation.productTitle && (
                    <p className="text-xs text-gray-600">
                      Sobre: {selectedConversation.productTitle}
                    </p>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedConversation.messages
                  .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                  .map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.senderId === currentUser?.id ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.senderId !== currentUser?.id && (
                      <img
                        src={message.senderAvatar}
                        alt={message.senderName}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        message.senderId === currentUser?.id
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs mt-1 opacity-70">{message.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Escribe tu mensaje..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-4"
                    disabled={!messageInput.trim()}
                  >
                    <Send size={18} />
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div className="hidden md:flex flex-1 items-center justify-center text-gray-500">
              <p>Selecciona una conversación para comenzar</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
