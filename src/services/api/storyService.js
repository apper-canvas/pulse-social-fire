import mockStories from '@/services/mockData/stories.json'
import mockUsers from '@/services/mockData/users.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class StoryService {
  async getAll() {
    await delay(300)
    return this.enrichStoriesWithUsers([...mockStories])
  }
  
  async getById(id) {
    await delay(200)
    const story = mockStories.find(s => s.Id === parseInt(id))
    if (!story) throw new Error('Story not found')
    return this.enrichStoriesWithUsers([story])[0]
  }
  
  async getActive() {
    await delay(250)
    const now = new Date()
    const activeStories = mockStories.filter(story => 
      new Date(story.expiresAt) > now
    )
    return this.enrichStoriesWithUsers(activeStories)
  }
  
  async create(storyData) {
    await delay(500)
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000) // 24 hours
    
    const newStory = {
      Id: Math.max(...mockStories.map(s => s.Id)) + 1,
      userId: 1, // Current user ID for demo
      media: storyData.media,
      timestamp: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      views: 0
    }
    
    mockStories.unshift(newStory)
    return this.enrichStoriesWithUsers([newStory])[0]
  }
  
  async markAsViewed(id) {
    await delay(200)
    const story = mockStories.find(s => s.Id === parseInt(id))
    if (story) {
      story.views += 1
    }
    return { success: true }
  }
  
  async delete(id) {
    await delay(300)
    const index = mockStories.findIndex(s => s.Id === parseInt(id))
    if (index === -1) throw new Error('Story not found')
    
    mockStories.splice(index, 1)
    return { success: true }
  }
  
  // Helper method to enrich stories with user data
  enrichStoriesWithUsers(stories) {
    return stories.map(story => {
      const user = mockUsers.find(u => u.Id === story.userId)
      return {
        ...story,
        user: user ? { ...user } : null
      }
    })
  }
}

export const storyService = new StoryService()