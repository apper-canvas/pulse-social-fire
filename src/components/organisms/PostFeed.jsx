import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import PostCard from '@/components/molecules/PostCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { postService } from '@/services/api/postService'

const PostFeed = ({ refreshTrigger }) => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    loadPosts()
  }, [refreshTrigger])
  
  const loadPosts = async () => {
    try {
      setError(null)
      setLoading(true)
      const postsData = await postService.getFeed()
      setPosts(postsData)
    } catch (error) {
      console.error('Failed to load posts:', error)
      setError('Failed to load posts')
    } finally {
      setLoading(false)
    }
  }
  
  const handlePostUpdate = (postId, updatedData) => {
    setPosts(prev => prev.map(post => 
      post.Id === postId ? { ...post, ...updatedData } : post
    ))
  }
  
  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadPosts} />
  
  if (posts.length === 0) {
    return (
      <Empty 
        icon="MessageSquare"
        title="No posts yet"
        description="Follow some users to see their posts in your feed!"
        actionText="Explore Users"
        onAction={() => window.location.href = '/explore'}
      />
    )
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {posts.map((post, index) => (
        <motion.div
          key={post.Id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <PostCard 
            post={post} 
            onUpdate={handlePostUpdate}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}

export default PostFeed