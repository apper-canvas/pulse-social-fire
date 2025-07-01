import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import Card from '@/components/atoms/Card'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'
import Avatar from '@/components/atoms/Avatar'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { chatService } from '@/services/api/chatService'
import { userService } from '@/services/api/userService'

const Chat = () => {
  const { conversationId } = useParams()
  const navigate = useNavigate()
  const [conversations, setConversations] = useState([])
  const [currentConversation, setCurrentConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [isTyping, setIsTyping] = useState(false)
  
  useEffect(() => {
    loadInitialData()
  }, [])
  
  useEffect(() => {
    if (conversationId) {
      loadConversation(conversationId)
    } else {
      setCurrentConversation(null)
      setMessages([])
    }
  }, [conversationId])
  
  const loadInitialData = async () => {
    try {
      setError(null)
      setLoading(true)
      
      const [conversationsData, userData] = await Promise.all([
        chatService.getConversations(),
        userService.getCurrentUserStats()
      ])
      
      setConversations(conversationsData)
      setCurrentUser(userData)
    } catch (error) {
      console.error('Failed to load chat data:', error)
      setError('Failed to load chat data')
    } finally {
      setLoading(false)
    }
  }
  
  const loadConversation = async (id) => {
    try {
      setMessagesLoading(true)
      
      const [conversation, messagesData] = await Promise.all([
        chatService.getConversationById(parseInt(id)),
        chatService.getMessages(parseInt(id))
      ])
      
      setCurrentConversation(conversation)
      setMessages(messagesData)
    } catch (error) {
      console.error('Failed to load conversation:', error)
      toast.error('Failed to load conversation')
    } finally {
      setMessagesLoading(false)
    }
  }
  
  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !currentConversation) return
    
    try {
      const messageData = {
        content: newMessage.trim(),
        conversationId: currentConversation.Id
      }
      
      const sentMessage = await chatService.sendMessage(messageData)
      setMessages(prev => [...prev, sentMessage])
      setNewMessage('')
      
      // Update conversation last message
      setConversations(prev => 
        prev.map(conv => 
          conv.Id === currentConversation.Id 
            ? { ...conv, lastMessage: sentMessage.content, lastMessageTime: sentMessage.timestamp }
            : conv
        )
      )
      
      // Simulate typing indicator and response
      setTimeout(() => {
        setIsTyping(true)
        setTimeout(async () => {
          try {
            const response = await chatService.simulateResponse(currentConversation.Id)
            if (response) {
              setMessages(prev => [...prev, response])
              setConversations(prev => 
                prev.map(conv => 
                  conv.Id === currentConversation.Id 
                    ? { ...conv, lastMessage: response.content, lastMessageTime: response.timestamp }
                    : conv
                )
              )
            }
          } catch (error) {
            console.error('Failed to simulate response:', error)
          } finally {
            setIsTyping(false)
          }
        }, 2000)
      }, 1000)
      
    } catch (error) {
      console.error('Failed to send message:', error)
      toast.error('Failed to send message')
    }
  }
  
  const handleConversationClick = (conversation) => {
    navigate(`/messages/${conversation.Id}`)
  }
  
  const filteredConversations = conversations.filter(conv =>
    conv.participant.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.participant.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadInitialData} />
  
  return (
    <div className="h-[calc(100vh-4rem)] flex bg-gray-50">
      {/* Conversations List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900">Messages</h1>
            <Button variant="ghost" size="icon">
              <ApperIcon name="Edit3" size={20} />
            </Button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon="Search"
            />
          </div>
        </div>
        
        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length > 0 ? (
            <div className="space-y-1 p-2">
              {filteredConversations.map((conversation) => (
                <motion.div
                  key={conversation.Id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleConversationClick(conversation)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    currentConversation?.Id === conversation.Id
                      ? 'bg-primary/10 border border-primary/20'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar
                      src={conversation.participant.avatar}
                      alt={conversation.participant.displayName}
                      size="md"
                      online={conversation.participant.isActive}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900 truncate">
                          {conversation.participant.displayName}
                        </p>
                        <span className="text-xs text-secondary">
                          {new Date(conversation.lastMessageTime).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-secondary truncate">
                        {conversation.lastMessage}
                      </p>
                    </div>
                    {conversation.unreadCount > 0 && (
                      <div className="w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                        {conversation.unreadCount}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-4">
              <Empty
                icon="MessageSquare"
                title="No conversations"
                description={searchQuery ? "No conversations match your search" : "Start a conversation to see it here"}
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-white border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar
                    src={currentConversation.participant.avatar}
                    alt={currentConversation.participant.displayName}
                    size="md"
                    online={currentConversation.participant.isActive}
                  />
                  <div>
                    <h2 className="font-semibold text-gray-900">
                      {currentConversation.participant.displayName}
                    </h2>
                    <p className="text-sm text-secondary">
                      {currentConversation.participant.isActive ? 'Active now' : 'Last seen recently'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon">
                    <ApperIcon name="Phone" size={20} />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <ApperIcon name="Video" size={20} />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <ApperIcon name="Info" size={20} />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messagesLoading ? (
                <Loading />
              ) : (
                <>
                  {messages.map((message) => (
                    <motion.div
                      key={message.Id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.senderId === currentUser?.Id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        message.senderId === currentUser?.Id
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.senderId === currentUser?.Id ? 'text-primary-light' : 'text-gray-500'
                        }`}>
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Typing Indicator */}
                  <AnimatePresence>
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex justify-start"
                      >
                        <div className="bg-gray-100 px-4 py-2 rounded-2xl">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>
            
            {/* Message Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                <Button variant="ghost" size="icon" type="button">
                  <ApperIcon name="Plus" size={20} />
                </Button>
                
                <div className="flex-1">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="border-none bg-gray-100 focus:ring-0 focus:border-none"
                  />
                </div>
                
                <Button variant="ghost" size="icon" type="button">
                  <ApperIcon name="Smile" size={20} />
                </Button>
                
                <Button
                  type="submit"
                  variant="primary"
                  size="icon"
                  disabled={!newMessage.trim()}
                >
                  <ApperIcon name="Send" size={20} />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <Empty
              icon="MessageSquare"
              title="Select a conversation"
              description="Choose a conversation from the sidebar to start chatting"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Chat