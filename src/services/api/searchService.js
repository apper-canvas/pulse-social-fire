import mockUsers from '@/services/mockData/users.json'
import mockPosts from '@/services/mockData/posts.json'
import mockHashtags from '@/services/mockData/hashtags.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class SearchService {
  async search(query, limit = 10) {
    await delay(300)
    
    const lowerQuery = query.toLowerCase()
    const results = []
    
    // Search users
    const users = mockUsers
      .filter(user => 
        user.displayName.toLowerCase().includes(lowerQuery) ||
        user.username.toLowerCase().includes(lowerQuery) ||
        (user.bio && user.bio.toLowerCase().includes(lowerQuery))
      )
      .slice(0, Math.floor(limit / 2))
      .map(user => ({ ...user, type: 'user' }))
    
    // Search hashtags
    const hashtags = mockHashtags
      .filter(hashtag => 
        hashtag.tag.toLowerCase().includes(lowerQuery)
      )
      .slice(0, Math.floor(limit / 2))
      .map(hashtag => ({ ...hashtag, type: 'hashtag' }))
    
    return [...users, ...hashtags]
  }
  
  async searchAll(query) {
    await delay(400)
    
    const lowerQuery = query.toLowerCase()
    
    // Search users
    const users = mockUsers.filter(user => 
      user.displayName.toLowerCase().includes(lowerQuery) ||
      user.username.toLowerCase().includes(lowerQuery) ||
      (user.bio && user.bio.toLowerCase().includes(lowerQuery))
    )
    
    // Search posts
    const posts = mockPosts.filter(post => 
      post.content.toLowerCase().includes(lowerQuery) ||
      post.hashtags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      (post.location && post.location.toLowerCase().includes(lowerQuery))
    ).map(post => {
      const user = mockUsers.find(u => u.Id === post.userId)
      return { ...post, user: user ? { ...user } : null }
    })
    
    // Search hashtags
    const hashtags = mockHashtags.filter(hashtag => 
      hashtag.tag.toLowerCase().includes(lowerQuery)
    )
    
    return {
      users: users.map(user => ({ ...user })),
      posts: posts,
      hashtags: hashtags.map(hashtag => ({ ...hashtag }))
    }
  }
  
  async searchUsers(query, limit = 20) {
    await delay(300)
    
    const lowerQuery = query.toLowerCase()
    const users = mockUsers
      .filter(user => 
        user.displayName.toLowerCase().includes(lowerQuery) ||
        user.username.toLowerCase().includes(lowerQuery) ||
        (user.bio && user.bio.toLowerCase().includes(lowerQuery))
      )
      .slice(0, limit)
    
    return users.map(user => ({ ...user }))
  }
  
  async searchPosts(query, limit = 20) {
    await delay(300)
    
    const lowerQuery = query.toLowerCase()
    const posts = mockPosts
      .filter(post => 
        post.content.toLowerCase().includes(lowerQuery) ||
        post.hashtags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
        (post.location && post.location.toLowerCase().includes(lowerQuery))
      )
      .slice(0, limit)
    
    return posts.map(post => {
      const user = mockUsers.find(u => u.Id === post.userId)
      return { ...post, user: user ? { ...user } : null }
    })
  }
  
  async searchHashtags(query, limit = 20) {
    await delay(300)
    
    const lowerQuery = query.toLowerCase()
    const hashtags = mockHashtags
      .filter(hashtag => 
        hashtag.tag.toLowerCase().includes(lowerQuery)
      )
      .slice(0, limit)
    
    return hashtags.map(hashtag => ({ ...hashtag }))
  }
}

export const searchService = new SearchService()