import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import Select from 'react-select'
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

const ChatOverlay = ({ isOpen, onClose }) => {
  const [conversations, setConversations] = useState([])
  const [currentConversation, setCurrentConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [isTyping, setIsTyping] = useState(false)
  const [showNewChatModal, setShowNewChatModal] = useState(false)
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [newChatLoading, setNewChatLoading] = useState(false)
  
  useEffect(() => {
    if (isOpen) {
      loadInitialData()
    }
  }, [isOpen])
  
  useEffect(() => {
    if (currentConversation) {
      loadMessages(currentConversation.Id)
    }
  }, [currentConversation])
  
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
  
  const loadMessages = async (conversationId) => {
    try {
      setMessagesLoading(true)
      const messagesData = await chatService.getMessages(conversationId)
      setMessages(messagesData)
    } catch (error) {
      console.error('Failed to load messages:', error)
      toast.error('Failed to load messages')
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
    setCurrentConversation(conversation)
    setMessages([])
  }
  
  const handleStartNewChat = async () => {
    try {
      setUsers(await userService.getAllUsers())
      setShowNewChatModal(true)
    } catch (error) {
      console.error('Failed to load users:', error)
      toast.error('Failed to load users')
    }
  }
  
  const handleCreateConversation = async () => {
    if (!selectedUser) return
    
    try {
      setNewChatLoading(true)
      const conversation = await chatService.createOrGetConversation(selectedUser.value)
      
      // Update conversations list
      const existingConv = conversations.find(c => c.Id === conversation.Id)
      if (!existingConv) {
        setConversations(prev => [conversation, ...prev])
      }
      
      setCurrentConversation(conversation)
      setMessages([])
      setShowNewChatModal(false)
      setSelectedUser(null)
      
      toast.success('Chat started successfully!')
    } catch (error) {
      console.error('Failed to create conversation:', error)
      toast.error('Failed to start new chat')
    } finally {
      setNewChatLoading(false)
    }
  }
  
  const filteredConversations = conversations.filter(conv =>
    conv.participant.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.participant.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  const userOptions = users
    .filter(user => user.Id !== currentUser?.Id)
    .map(user => ({
      value: user.Id,
      label: user.displayName,
      avatar: user.avatar,
      username: user.username
    }))
  
  const customSelectComponents = {
    Option: ({ data, ...props }) => (
      <div {...props.innerProps} className="flex items-center p-2 hover:bg-gray-50 cursor-pointer">
        <Avatar src={data.avatar} alt={data.label} size="sm" />
        <div className="ml-3">
          <p className="font-medium text-gray-900">{data.label}</p>
          <p className="text-sm text-gray-500">@{data.username}</p>
        </div>
      </div>
    ),
    SingleValue: ({ data }) => (
      <div className="flex items-center">
        <Avatar src={data.avatar} alt={data.label} size="sm" />
        <span className="ml-2">{data.label}</span>
      </div>
    )
  }
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          
          {/* Chat Overlay */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-white rounded-lg shadow-2xl z-50 flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <ApperIcon name="X" size={20} />
              </Button>
            </div>
            
            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <Loading />
              </div>
            ) : error ? (
              <div className="flex-1 flex items-center justify-center">
                <Error message={error} onRetry={loadInitialData} />
              </div>
            ) : (
              <div className="flex-1 flex min-h-0">
                {/* Conversations List */}
                <div className="w-80 border-r border-gray-200 flex flex-col">
                  {/* Search and New Chat */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">Conversations</h3>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={handleStartNewChat}
                        title="Start new chat"
                      >
                        <ApperIcon name="Plus" size={18} />
                      </Button>
                    </div>
                    
                    <Input
                      placeholder="Search conversations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      icon="Search"
                      className="w-full"
                    />
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
                                  <span className="text-xs text-gray-500">
                                    {new Date(conversation.lastMessageTime).toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-500 truncate">
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
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar
                              src={currentConversation.participant.avatar}
                              alt={currentConversation.participant.displayName}
                              size="md"
                              online={currentConversation.participant.isActive}
                            />
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {currentConversation.participant.displayName}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {currentConversation.participant.isActive ? 'Active now' : 'Last seen recently'}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="icon">
                              <ApperIcon name="Phone" size={18} />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <ApperIcon name="Video" size={18} />
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
                                <div className={`max-w-xs px-4 py-2 rounded-2xl ${
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
                      <div className="p-4 border-t border-gray-200">
                        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                          <Button variant="ghost" size="icon" type="button">
                            <ApperIcon name="Plus" size={18} />
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
                            <ApperIcon name="Smile" size={18} />
                          </Button>
                          
                          <Button
                            type="submit"
                            variant="primary"
                            size="icon"
                            disabled={!newMessage.trim()}
                          >
                            <ApperIcon name="Send" size={18} />
                          </Button>
                        </form>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <Empty
                        icon="MessageSquare"
                        title="Select a conversation"
                        description="Choose a conversation from the sidebar to start chatting"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
          
          {/* New Chat Modal */}
          <AnimatePresence>
            {showNewChatModal && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowNewChatModal(false)}
                  className="fixed inset-0 bg-black/50 z-60"
                />
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-60 w-full max-w-md mx-4"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Start New Chat</h3>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setShowNewChatModal(false)}
                      >
                        <ApperIcon name="X" size={20} />
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select a user to chat with
                        </label>
                        <Select
                          options={userOptions}
                          value={selectedUser}
                          onChange={setSelectedUser}
                          components={customSelectComponents}
                          placeholder="Search for a user..."
                          isSearchable
                          className="react-select-container"
                          classNamePrefix="react-select"
                        />
                      </div>
                      
                      <div className="flex items-center justify-end space-x-3 pt-4">
                        <Button
                          variant="ghost"
                          onClick={() => setShowNewChatModal(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          onClick={handleCreateConversation}
                          disabled={!selectedUser || newChatLoading}
                        >
                          {newChatLoading ? 'Starting...' : 'Start Chat'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  )
}

export default ChatOverlay