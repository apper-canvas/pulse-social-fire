import { useEffect, useState } from 'react'
import Card from '@/components/atoms/Card'
import Avatar from '@/components/atoms/Avatar'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import UserCard from '@/components/molecules/UserCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { userService } from '@/services/api/userService'
import { hashtagService } from '@/services/api/hashtagService'

const Sidebar = () => {
  const [currentUser, setCurrentUser] = useState(null)
  const [suggestedUsers, setSuggestedUsers] = useState([])
  const [activeUsers, setActiveUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  useEffect(() => {
    loadSidebarData()
  }, [])
  
const loadSidebarData = async () => {
    try {
      setError(null)
      setLoading(true)
      
      const [userStats, suggested, active] = await Promise.all([
        userService.getCurrentUserStats(),
        userService.getSuggested(),
        userService.getActiveUsers()
      ])
      
      setCurrentUser(userStats)
      setSuggestedUsers(suggested)
      setActiveUsers(active)
    } catch (error) {
      console.error('Failed to load sidebar data:', error)
      setError('Failed to load sidebar data')
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadSidebarData} />
  
  return (
    <div className="w-80 space-y-6">
      {/* Current User Stats */}
      {currentUser && (
        <Card>
          <div className="flex items-center space-x-3 mb-4">
            <Avatar
              src={currentUser.avatar}
              alt={currentUser.displayName}
              size="lg"
            />
            <div>
              <h3 className="font-semibold text-gray-900">{currentUser.displayName}</h3>
              <p className="text-secondary">@{currentUser.username}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xl font-bold text-gray-900">{currentUser.postsCount}</p>
              <p className="text-xs text-secondary">Posts</p>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{currentUser.followersCount}</p>
              <p className="text-xs text-secondary">Followers</p>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{currentUser.followingCount}</p>
              <p className="text-xs text-secondary">Following</p>
            </div>
          </div>
        </Card>
)}
      {/* Suggested Users */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Suggested for you</h3>
          <Button variant="ghost" size="sm">
            See all
          </Button>
        </div>
        
        {suggestedUsers.length > 0 ? (
          <div className="space-y-3">
            {suggestedUsers.slice(0, 3).map((user) => (
              <div key={user.Id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar
                    src={user.avatar}
                    alt={user.displayName}
                    size="sm"
                  />
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{user.displayName}</p>
                    <p className="text-xs text-secondary">@{user.username}</p>
                  </div>
                </div>
                <Button variant="primary" size="sm">
                  Follow
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <Empty 
            icon="UserPlus"
            title="No suggestions"
            description="Check back later for new people to follow!"
          />
        )}
      </Card>
      
      {/* Active Now */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Active Now</h3>
          <div className="w-2 h-2 bg-success rounded-full"></div>
        </div>
        
        {activeUsers.length > 0 ? (
          <div className="space-y-3">
            {activeUsers.slice(0, 5).map((user) => (
              <div key={user.Id} className="flex items-center space-x-3">
                <Avatar
                  src={user.avatar}
                  alt={user.displayName}
                  size="sm"
                  online={true}
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{user.displayName}</p>
                  <p className="text-xs text-success">Active now</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Empty 
            icon="Users"
            title="No one is active"
            description="Your friends will appear here when they're online"
          />
        )}
      </Card>
    </div>
  )
}

export default Sidebar