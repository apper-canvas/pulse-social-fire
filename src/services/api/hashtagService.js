import mockHashtags from '@/services/mockData/hashtags.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class HashtagService {
  async getAll() {
    await delay(300)
    return [...mockHashtags]
  }
  
  async getTrending(limit = 10) {
    await delay(250)
    // Sort by post count and trending status
    const trending = mockHashtags
      .filter(hashtag => hashtag.trending)
      .sort((a, b) => b.postCount - a.postCount)
      .slice(0, limit)
    
    return trending.map(hashtag => ({ ...hashtag }))
  }
  
  async getByTag(tag) {
    await delay(200)
    const hashtag = mockHashtags.find(h => h.tag.toLowerCase() === tag.toLowerCase())
    if (!hashtag) throw new Error('Hashtag not found')
    return { ...hashtag }
  }
  
  async create(hashtagData) {
    await delay(400)
    const newHashtag = {
      tag: hashtagData.tag,
      postCount: 1,
      trending: false
    }
    
    // Check if hashtag already exists
    const existingIndex = mockHashtags.findIndex(h => 
      h.tag.toLowerCase() === hashtagData.tag.toLowerCase()
    )
    
    if (existingIndex !== -1) {
      mockHashtags[existingIndex].postCount += 1
      return { ...mockHashtags[existingIndex] }
    } else {
      mockHashtags.push(newHashtag)
      return { ...newHashtag }
    }
  }
  
  async incrementCount(tag) {
    await delay(200)
    const hashtag = mockHashtags.find(h => h.tag.toLowerCase() === tag.toLowerCase())
    if (hashtag) {
      hashtag.postCount += 1
      // Auto-trend if post count reaches threshold
      if (hashtag.postCount >= 50) {
        hashtag.trending = true
      }
    }
    return hashtag ? { ...hashtag } : null
  }
}

export const hashtagService = new HashtagService()