import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Avatar from "@/components/atoms/Avatar";
import PostCard from "@/components/molecules/PostCard";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import { postService } from "@/services/api/postService";
import { userService } from "@/services/api/userService";

const Profile = () => {
  const { username } = useParams()
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [following, setFollowing] = useState(false)
  const [activeTab, setActiveTab] = useState('posts')
  
  useEffect(() => {
    if (username) {
      loadProfile()
    }
  }, [username])
  
  const loadProfile = async () => {
    try {
      setError(null)
      setLoading(true)
      
      const [userData, userPosts] = await Promise.all([
        userService.getByUsername(username),
        postService.getByUser(username)
      ])
      
      setUser(userData)
      setPosts(userPosts)
    } catch (error) {
      console.error('Failed to load profile:', error)
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }
  
  const handleFollow = async () => {
    if (!user) return
    
    try {
      const newFollowing = !following
      setFollowing(newFollowing)
      setUser(prev => ({
        ...prev,
        followersCount: prev.followersCount + (newFollowing ? 1 : -1)
      }))
      
      await userService.toggleFollow(user.Id)
      
      if (newFollowing) {
        toast.success(`Now following ${user.displayName}`)
      } else {
        toast.info(`Unfollowed ${user.displayName}`)
      }
    } catch (error) {
      // Revert on error
      setFollowing(!following)
      setUser(prev => ({
        ...prev,
        followersCount: prev.followersCount + (following ? 1 : -1)
      }))
      toast.error('Failed to update follow status')
    }
}
  
  const handleMessageClick = () => {
    // TODO: Implement messaging functionality
    toast.info('Messaging feature coming soon!')
  }
  
  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadProfile} />
  if (!user) return <Error message="User not found" />
  const tabs = [
    { id: 'posts', label: 'Posts', count: user.postsCount },
    { id: 'media', label: 'Media', count: 0 },
    { id: 'likes', label: 'Likes', count: 0 }
  ]
  
  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <div className="relative">
          {/* Cover Photo */}
          <div className="h-32 bg-gradient-to-r from-primary/20 to-accent/20 rounded-t-xl"></div>
          
          {/* Profile Info */}
          <div className="px-6 pb-6">
            <div className="flex items-end justify-between -mt-16 mb-6">
              <Avatar
                src={user.avatar}
                alt={user.displayName}
                size="2xl"
                className="border-4 border-white shadow-lg"
              />
              
<div className="flex items-center space-x-3">
                <Button variant="ghost" size="icon" onClick={handleMessageClick}>
                  <ApperIcon name="Mail" size={20} />
                </Button>
                
                <Button
                  variant={following ? "secondary" : "primary"}
                  onClick={handleFollow}
                  icon={following ? "UserCheck" : "UserPlus"}
                >
                  {following ? 'Following' : 'Follow'}
                </Button>
              </div>
            </div>
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.displayName}</h1>
              <p className="text-secondary">@{user.username}</p>
              
              {user.bio && (
                <p className="text-gray-700 mt-3">{user.bio}</p>
              )}
              
              <div className="flex items-center space-x-6 mt-4">
                <div className="flex items-center space-x-1 text-secondary">
                  <ApperIcon name="MapPin" size={16} />
                  <span className="text-sm">San Francisco, CA</span>
                </div>
                <div className="flex items-center space-x-1 text-secondary">
                  <ApperIcon name="Calendar" size={16} />
                  <span className="text-sm">Joined March 2023</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-8 mt-4">
                <div>
                  <span className="font-bold text-gray-900">{user.followingCount}</span>
                  <span className="text-secondary ml-1">Following</span>
                </div>
                <div>
                  <span className="font-bold text-gray-900">{user.followersCount}</span>
                  <span className="text-secondary ml-1">Followers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Tabs */}
      <Card padding="none">
        <div className="flex border-b border-gray-100">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-4 px-6 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary bg-primary/5'
                  : 'text-secondary hover:text-gray-900 hover:bg-surface'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </Card>
      
      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'posts' && (
          <div className="space-y-4">
            {posts.length > 0 ? (
              posts.map((post) => (
                <PostCard key={post.Id} post={post} />
              ))
            ) : (
              <Empty 
                icon="MessageSquare"
                title="No posts yet"
                description={`${user.displayName} hasn't posted anything yet.`}
              />
            )}
          </div>
        )}
        
        {activeTab === 'media' && (
          <Empty 
            icon="Image"
            title="No media"
            description="Posts with photos and videos will appear here"
          />
        )}
        
        {activeTab === 'likes' && (
          <Empty 
            icon="Heart"
            title="No likes"
            description="Liked posts will appear here"
          />
        )}
      </motion.div>
    </div>
  )
}

export default Profile