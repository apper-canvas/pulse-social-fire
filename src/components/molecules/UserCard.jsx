import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Card from '@/components/atoms/Card'
import Avatar from '@/components/atoms/Avatar'
import Button from '@/components/atoms/Button'
import { userService } from '@/services/api/userService'

const UserCard = ({ user, onUpdate, showFollowButton = true }) => {
  const [following, setFollowing] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const handleFollow = async () => {
    if (loading) return
    
    setLoading(true)
    try {
      const newFollowing = !following
      setFollowing(newFollowing)
      
      await userService.toggleFollow(user.Id)
      
      if (newFollowing) {
        toast.success(`Now following ${user.displayName}`)
      } else {
        toast.info(`Unfollowed ${user.displayName}`)
      }
      
      if (onUpdate) {
        onUpdate(user.Id, newFollowing)
      }
    } catch (error) {
      setFollowing(!following)
      toast.error('Failed to update follow status')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <Card hover className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar 
            src={user.avatar} 
            alt={user.displayName} 
            size="lg"
            online={user.isActive}
          />
          <div>
            <h3 className="font-semibold text-gray-900">{user.displayName}</h3>
            <p className="text-secondary">@{user.username}</p>
            {user.bio && (
              <p className="text-sm text-gray-600 mt-1 max-w-[200px] truncate">
                {user.bio}
              </p>
            )}
          </div>
        </div>
        
        {showFollowButton && (
          <Button
            variant={following ? "secondary" : "primary"}
            size="sm"
            onClick={handleFollow}
            disabled={loading}
          >
            {loading ? "..." : following ? "Following" : "Follow"}
          </Button>
        )}
      </div>
      
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <p className="font-semibold text-gray-900">{user.postsCount}</p>
          <p className="text-xs text-secondary">Posts</p>
        </div>
        <div className="text-center">
          <p className="font-semibold text-gray-900">{user.followersCount}</p>
          <p className="text-xs text-secondary">Followers</p>
        </div>
        <div className="text-center">
          <p className="font-semibold text-gray-900">{user.followingCount}</p>
          <p className="text-xs text-secondary">Following</p>
        </div>
      </div>
    </Card>
  )
}

export default UserCard