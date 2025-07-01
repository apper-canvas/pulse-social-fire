import mockConversations from '@/services/mockData/conversations.json'
import mockMessages from '@/services/mockData/messages.json'
import mockUsers from '@/services/mockData/users.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class ChatService {
  async getConversations() {
    await delay(300)
    return [...mockConversations].map(conv => ({
      ...conv,
      participant: mockUsers.find(u => u.Id === conv.participantId)
    }))
  }
  
  async getConversationById(id) {
    await delay(200)
    const conversation = mockConversations.find(c => c.Id === parseInt(id))
    if (!conversation) throw new Error('Conversation not found')
    
    return {
      ...conversation,
      participant: mockUsers.find(u => u.Id === conversation.participantId)
    }
  }
  
  async getMessages(conversationId) {
    await delay(250)
    const messages = mockMessages
      .filter(m => m.conversationId === parseInt(conversationId))
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    return [...messages]
  }
  
  async sendMessage(messageData) {
    await delay(400)
    const newMessage = {
      Id: Math.max(...mockMessages.map(m => m.Id)) + 1,
      conversationId: messageData.conversationId,
      senderId: 1, // Current user ID
      content: messageData.content,
      timestamp: new Date().toISOString(),
      status: 'sent'
    }
    
    mockMessages.push(newMessage)
    
    // Update conversation last message
    const conversation = mockConversations.find(c => c.Id === messageData.conversationId)
    if (conversation) {
      conversation.lastMessage = messageData.content
      conversation.lastMessageTime = newMessage.timestamp
    }
    
    return { ...newMessage }
  }
  
  async simulateResponse(conversationId) {
    await delay(300)
    
    const responses = [
      "Thanks for reaching out!",
      "That sounds great!",
      "I'll get back to you on that.",
      "Absolutely, let's discuss this further.",
      "I agree with your perspective.",
      "Let me think about that.",
      "Good point!",
      "I'm excited about this opportunity.",
      "When would be a good time to chat?",
      "I appreciate you sharing that."
    ]
    
    const conversation = mockConversations.find(c => c.Id === parseInt(conversationId))
    if (!conversation) return null
    
    const participantId = conversation.participantId
    const randomResponse = responses[Math.floor(Math.random() * responses.length)]
    
    const responseMessage = {
      Id: Math.max(...mockMessages.map(m => m.Id)) + 1,
      conversationId: parseInt(conversationId),
      senderId: participantId,
      content: randomResponse,
      timestamp: new Date().toISOString(),
      status: 'sent'
    }
    
    mockMessages.push(responseMessage)
    
    // Update conversation
    conversation.lastMessage = randomResponse
    conversation.lastMessageTime = responseMessage.timestamp
    
    return { ...responseMessage }
  }
  
  async createOrGetConversation(participantId) {
    await delay(300)
    
    // Check if conversation already exists
    let conversation = mockConversations.find(c => c.participantId === parseInt(participantId))
    
    if (!conversation) {
      // Create new conversation
      conversation = {
        Id: Math.max(...mockConversations.map(c => c.Id)) + 1,
        participantId: parseInt(participantId),
        lastMessage: "Start a conversation...",
        lastMessageTime: new Date().toISOString(),
        unreadCount: 0
      }
      
      mockConversations.push(conversation)
    }
    
    return {
      ...conversation,
      participant: mockUsers.find(u => u.Id === conversation.participantId)
    }
  }
  
  async markAsRead(conversationId) {
    await delay(200)
    const conversation = mockConversations.find(c => c.Id === parseInt(conversationId))
    if (conversation) {
      conversation.unreadCount = 0
    }
    return { success: true }
  }
  
  async searchConversations(query) {
    await delay(250)
    const conversations = await this.getConversations()
    return conversations.filter(conv =>
      conv.participant.displayName.toLowerCase().includes(query.toLowerCase()) ||
      conv.participant.username.toLowerCase().includes(query.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(query.toLowerCase())
    )
  }
  
  async deleteConversation(id) {
    await delay(300)
    const index = mockConversations.findIndex(c => c.Id === parseInt(id))
    if (index === -1) throw new Error('Conversation not found')
    
    // Also delete all messages in this conversation
    const messageIndexes = mockMessages
      .map((msg, idx) => msg.conversationId === parseInt(id) ? idx : -1)
      .filter(idx => idx !== -1)
      .reverse() // Delete from end to avoid index shifting
    
    messageIndexes.forEach(idx => mockMessages.splice(idx, 1))
    mockConversations.splice(index, 1)
    
    return { success: true }
  }
}

export const chatService = new ChatService()