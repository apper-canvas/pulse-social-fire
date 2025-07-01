import { useState } from 'react'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'react-toastify'
import Card from '@/components/atoms/Card'
import Avatar from '@/components/atoms/Avatar'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { postService } from '@/services/api/postService'

const PostCard = ({ post, onUpdate }) => {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likes)
  const [showComments, setShowComments] = useState(false)
  
  const handleLike = async () => {
    try {
      const newLiked = !liked
      setLiked(newLiked)
      setLikeCount(prev => newLiked ? prev + 1 : prev - 1)
      
      // Simulate API call
      await postService.toggleLike(post.Id)
      
      if (newLiked) {
        toast.success('Post liked!')
      }
    } catch (error) {
      // Revert on error
      setLiked(!liked)
      setLikeCount(prev => liked ? prev + 1 : prev - 1)
      toast.error('Failed to like post')
    }
  }
  
  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/post/${post.Id}`)
    toast.success('Link copied to clipboard!')
  }
  
  const formatHashtags = (text) => {
    return text.split(' ').map((word, index) => {
      if (word.startsWith('#')) {
        return (
          <span key={index} className="text-primary hover:underline cursor-pointer">
            {word}{' '}
          </span>
        )
      }
      return word + ' '
    })
  }
  
  return (
    <Card className="mb-4">
      <div className="flex items-start space-x-3">
        <Avatar 
          src={post.user?.avatar} 
          alt={post.user?.displayName} 
          size="md" 
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-gray-900 truncate">
              {post.user?.displayName}
            </h3>
            <span className="text-secondary">@{post.user?.username}</span>
            <span className="text-secondary">·</span>
            <span className="text-secondary text-sm">
              {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
            </span>
          </div>
          
          <div className="mt-2">
            <p className="text-gray-900 whitespace-pre-wrap">
              {formatHashtags(post.content)}
            </p>
            
            {post.location && (
              <div className="flex items-center mt-2 text-secondary text-sm">
                <ApperIcon name="MapPin" size={14} className="mr-1" />
                {post.location}
              </div>
            )}
            
            {post.media && post.media.length > 0 && (
              <div className="mt-3 rounded-lg overflow-hidden">
                {post.media[0].type === 'image' ? (
                  <img
                    src={post.media[0].url}
                    alt="Post media"
                    className="w-full max-h-96 object-cover"
                  />
                ) : (
                  <video
                    src={post.media[0].url}
                    controls
                    className="w-full max-h-96"
                  />
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-6">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleLike}
                className={`flex items-center space-x-2 group ${
                  liked ? 'text-red-500' : 'text-secondary hover:text-red-500'
                }`}
              >
                <motion.div
                  animate={liked ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <ApperIcon 
                    name={liked ? "Heart" : "Heart"} 
                    size={18} 
                    className={liked ? "fill-current" : ""}
                  />
                </motion.div>
                <span className="text-sm font-medium">{likeCount}</span>
              </motion.button>
              
              <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center space-x-2 text-secondary hover:text-primary group"
              >
                <ApperIcon name="MessageCircle" size={18} />
                <span className="text-sm font-medium">{post.comments}</span>
              </button>
              
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 text-secondary hover:text-primary group"
              >
                <ApperIcon name="Share" size={18} />
                <span className="text-sm font-medium">{post.shares}</span>
              </button>
            </div>
            
            <Button variant="ghost" size="icon">
              <ApperIcon name="MoreHorizontal" size={18} />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default PostCard