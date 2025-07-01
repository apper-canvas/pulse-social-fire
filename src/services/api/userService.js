import mockUsers from '@/services/mockData/users.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class UserService {
  async getAll() {
    await delay(300)
    return [...mockUsers]
  }
  
  async getById(id) {
    await delay(200)
    const user = mockUsers.find(u => u.Id === parseInt(id))
    if (!user) throw new Error('User not found')
    return { ...user }
  }
  
  async getByUsername(username) {
    await delay(200)
    const user = mockUsers.find(u => u.username === username)
    if (!user) throw new Error('User not found')
    return { ...user }
  }
  
  async getCurrentUserStats() {
    await delay(200)
    // Return first user as current user for demo
    const currentUser = { ...mockUsers[0] }
    return currentUser
  }
  
  async getSuggested(limit = 10) {
    await delay(300)
    // Return random users excluding current user
    const suggested = mockUsers.slice(1, limit + 1)
    return suggested.map(user => ({ ...user }))
  }
  
  async getActiveUsers(limit = 5) {
    await delay(250)
    // Return users marked as active
    const activeUsers = mockUsers
      .filter(user => user.isActive)
      .slice(0, limit)
    return activeUsers.map(user => ({ ...user }))
  }
  
  async toggleFollow(userId) {
    await delay(400)
    // Simulate follow/unfollow API call
    return { success: true, following: true }
  }
  
  async create(userData) {
    await delay(500)
    const newUser = {
      Id: Math.max(...mockUsers.map(u => u.Id)) + 1,
      ...userData,
      postsCount: 0,
      followersCount: 0,
      followingCount: 0,
      isActive: true
    }
    mockUsers.push(newUser)
    return { ...newUser }
  }
  
  async update(id, userData) {
    await delay(400)
    const index = mockUsers.findIndex(u => u.Id === parseInt(id))
    if (index === -1) throw new Error('User not found')
    
    mockUsers[index] = { ...mockUsers[index], ...userData }
    return { ...mockUsers[index] }
  }
  
  async delete(id) {
    await delay(300)
    const index = mockUsers.findIndex(u => u.Id === parseInt(id))
    if (index === -1) throw new Error('User not found')
    
    mockUsers.splice(index, 1)
    return { success: true }
  }
}

export const userService = new UserService()