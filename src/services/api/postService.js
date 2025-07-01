import mockPosts from '@/services/mockData/posts.json'
import mockUsers from '@/services/mockData/users.json'
import { v4 as uuidv4 } from 'uuid'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// In-memory comment storage (in real app, this would be in database)
let mockComments = [
  {
    Id: 1,
    postId: 1,
    userId: 2,
    content: "This is such a beautiful post! Thanks for sharing.",
    timestamp: "2024-01-15T10:30:00.000Z"
  },
  {
    Id: 2,
    postId: 1,
    userId: 3,
    content: "Absolutely love this! Keep up the great work.",
    timestamp: "2024-01-15T11:45:00.000Z"
  },
  {
    Id: 3,
    postId: 2,
    userId: 1,
    content: "Great insights here. Really helpful perspective.",
    timestamp: "2024-01-14T15:20:00.000Z"
  }
]

class PostService {
  async getAll() {
    await delay(300)
    return this.enrichPostsWithUsers([...mockPosts])
  }
  
  async getById(id) {
    await delay(200)
    const post = mockPosts.find(p => p.Id === parseInt(id))
    if (!post) throw new Error('Post not found')
    return this.enrichPostsWithUsers([post])[0]
  }
  
  async getFeed(limit = 20) {
    await delay(400)
    // Sort by timestamp descending for feed
    const sortedPosts = [...mockPosts]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit)
    
    return this.enrichPostsWithUsers(sortedPosts)
  }
  
  async getTrending(limit = 10) {
    await delay(300)
    // Sort by engagement (likes + comments + shares)
    const trendingPosts = [...mockPosts]
      .sort((a, b) => (b.likes + b.comments + b.shares) - (a.likes + a.comments + a.shares))
      .slice(0, limit)
    
    return this.enrichPostsWithUsers(trendingPosts)
  }
  
  async getByUser(username, limit = 20) {
    await delay(300)
    const user = mockUsers.find(u => u.username === username)
    if (!user) throw new Error('User not found')
    
    const userPosts = mockPosts
      .filter(p => p.userId === user.Id)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit)
    
    return this.enrichPostsWithUsers(userPosts)
  }
  
  async toggleLike(postId) {
    await delay(250)
    const post = mockPosts.find(p => p.Id === parseInt(postId))
    if (!post) throw new Error('Post not found')
    
    // Simulate like toggle
    post.likes += Math.random() > 0.5 ? 1 : -1
    if (post.likes < 0) post.likes = 0
    
    return { success: true, likes: post.likes }
  }
  
  async create(postData) {
    await delay(500)
    const newPost = {
      Id: Math.max(...mockPosts.map(p => p.Id)) + 1,
      userId: 1, // Current user ID for demo
      content: postData.content,
      media: postData.media || [],
      location: postData.location || '',
      hashtags: postData.hashtags || [],
      likes: 0,
      comments: 0,
      shares: 0,
      timestamp: new Date().toISOString()
    }
    
    mockPosts.unshift(newPost)
    return this.enrichPostsWithUsers([newPost])[0]
  }
  
  async update(id, postData) {
    await delay(400)
    const index = mockPosts.findIndex(p => p.Id === parseInt(id))
    if (index === -1) throw new Error('Post not found')
    
    mockPosts[index] = { ...mockPosts[index], ...postData }
    return this.enrichPostsWithUsers([mockPosts[index]])[0]
  }
  
  async delete(id) {
    await delay(300)
    const index = mockPosts.findIndex(p => p.Id === parseInt(id))
    if (index === -1) throw new Error('Post not found')
    
    mockPosts.splice(index, 1)
    return { success: true }
  }
  
  // Helper method to enrich posts with user data
  enrichPostsWithUsers(posts) {
    return posts.map(post => {
      const user = mockUsers.find(u => u.Id === post.userId)
      return {
        ...post,
        user: user ? { ...user } : null
}
    })
  }

  // Comment management methods
  async getComments(postId) {
    await delay(300)
    const postComments = mockComments
      .filter(c => c.postId === parseInt(postId))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    
    return this.enrichCommentsWithUsers(postComments)
  }

  async addComment(postId, content) {
    await delay(400)
    const newComment = {
      Id: Math.max(...mockComments.map(c => c.Id), 0) + 1,
      postId: parseInt(postId),
      userId: 1, // Current user ID for demo
      content: content.trim(),
      timestamp: new Date().toISOString()
    }
    
    mockComments.unshift(newComment)
    
    // Update post comment count
    const post = mockPosts.find(p => p.Id === parseInt(postId))
    if (post) {
      post.comments += 1
    }
    
    return this.enrichCommentsWithUsers([newComment])[0]
  }

  async updateComment(commentId, content) {
    await delay(300)
    const index = mockComments.findIndex(c => c.Id === parseInt(commentId))
    if (index === -1) throw new Error('Comment not found')
    
    mockComments[index] = {
      ...mockComments[index],
      content: content.trim(),
      updatedAt: new Date().toISOString()
    }
    
    return this.enrichCommentsWithUsers([mockComments[index]])[0]
  }

  async deleteComment(commentId) {
    await delay(250)
    const index = mockComments.findIndex(c => c.Id === parseInt(commentId))
    if (index === -1) throw new Error('Comment not found')
    
    const comment = mockComments[index]
    mockComments.splice(index, 1)
    
    // Update post comment count
    const post = mockPosts.find(p => p.Id === comment.postId)
    if (post && post.comments > 0) {
      post.comments -= 1
    }
    
    return { success: true }
  }

  // Helper method to enrich comments with user data
  enrichCommentsWithUsers(comments) {
    return comments.map(comment => {
      const user = mockUsers.find(u => u.Id === comment.userId)
      return {
        ...comment,
        user: user ? { ...user } : null
      }
    })
  }
}

export const postService = new PostService()