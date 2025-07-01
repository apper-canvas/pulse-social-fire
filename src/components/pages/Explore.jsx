import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import UserCard from '@/components/molecules/UserCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { userService } from '@/services/api/userService'
import { postService } from '@/services/api/postService'
import { hashtagService } from '@/services/api/hashtagService'

const Explore = () => {
  const [activeTab, setActiveTab] = useState('trending')
  const [trendingPosts, setTrendingPosts] = useState([])
  const [suggestedUsers, setSuggestedUsers] = useState([])
  const [trendingHashtags, setTrendingHashtags] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    loadExploreData()
  }, [])
  
  const loadExploreData = async () => {
    try {
      setError(null)
      setLoading(true)
      
      const [trending, users, hashtags] = await Promise.all([
        postService.getTrending(),
        userService.getSuggested(),
        hashtagService.getTrending()
      ])
      
      setTrendingPosts(trending)
      setSuggestedUsers(users)
      setTrendingHashtags(hashtags)
    } catch (error) {
      console.error('Failed to load explore data:', error)
      setError('Failed to load explore data')
    } finally {
      setLoading(false)
    }
  }
  
  const tabs = [
    { id: 'trending', label: 'Trending', icon: 'TrendingUp' },
    { id: 'users', label: 'People', icon: 'Users' },
    { id: 'hashtags', label: 'Hashtags', icon: 'Hash' }
  ]
  
  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadExploreData} />
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Explore</h1>
        <p className="text-secondary">Discover trending content and new people to follow</p>
      </div>
      
      {/* Tabs */}
      <Card padding="none">
        <div className="flex border-b border-gray-100">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary bg-primary/5'
                  : 'text-secondary hover:text-gray-900 hover:bg-surface'
              }`}
            >
              <ApperIcon name={tab.icon} size={18} />
              <span>{tab.label}</span>
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
        {activeTab === 'trending' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trendingPosts.length > 0 ? (
              trendingPosts.map((post) => (
                <Card key={post.Id} hover className="p-4">
                  <div className="flex items-start space-x-3">
                    <img
                      src={post.user?.avatar || '/api/placeholder/40/40'}
                      alt={post.user?.displayName}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {post.user?.displayName}
                        </h3>
                        <span className="text-secondary text-sm">
                          @{post.user?.username}
                        </span>
                      </div>
                      <p className="text-gray-900 mt-1 line-clamp-3">
                        {post.content}
                      </p>
                      <div className="flex items-center space-x-4 mt-3 text-secondary text-sm">
                        <span className="flex items-center">
                          <ApperIcon name="Heart" size={16} className="mr-1" />
                          {post.likes}
                        </span>
                        <span className="flex items-center">
                          <ApperIcon name="MessageCircle" size={16} className="mr-1" />
                          {post.comments}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-full">
                <Empty 
                  icon="TrendingUp"
                  title="No trending posts"
                  description="Check back later for trending content!"
                />
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'users' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestedUsers.length > 0 ? (
              suggestedUsers.map((user) => (
                <UserCard key={user.Id} user={user} />
              ))
            ) : (
              <div className="col-span-full">
                <Empty 
                  icon="Users"
                  title="No suggested users"
                  description="We couldn't find any users to suggest right now"
                />
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'hashtags' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendingHashtags.length > 0 ? (
              trendingHashtags.map((hashtag) => (
                <Card key={hashtag.tag} hover className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                    <ApperIcon name="Hash" size={24} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    #{hashtag.tag}
                  </h3>
                  <p className="text-secondary text-sm mb-4">
                    {hashtag.postCount} posts
                  </p>
                  <Button variant="primary" size="sm" className="w-full">
                    Explore
                  </Button>
                </Card>
              ))
            ) : (
              <div className="col-span-full">
                <Empty 
                  icon="Hash"
                  title="No trending hashtags"
                  description="Start using hashtags in your posts to see them trend!"
                />
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default Explore