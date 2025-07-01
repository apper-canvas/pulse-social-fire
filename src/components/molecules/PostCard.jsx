import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'react-toastify'
import Card from '@/components/atoms/Card'
import Avatar from '@/components/atoms/Avatar'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import ApperIcon from '@/components/ApperIcon'
import { postService } from '@/services/api/postService'

const PostCard = ({ post, onUpdate }) => {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likes)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState([])
  const [commentCount, setCommentCount] = useState(post.comments)
  const [commentText, setCommentText] = useState('')
  const [loadingComments, setLoadingComments] = useState(false)
  const [submittingComment, setSubmittingComment] = useState(false)
  
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

  const handleCommentToggle = async () => {
    const newShowComments = !showComments
    setShowComments(newShowComments)
    
    if (newShowComments && comments.length === 0) {
      await loadComments()
    }
  }

  const loadComments = async () => {
    try {
      setLoadingComments(true)
      const postComments = await postService.getComments(post.Id)
      setComments(postComments)
    } catch (error) {
      toast.error('Failed to load comments')
    } finally {
      setLoadingComments(false)
    }
  }

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    if (!commentText.trim()) return

    try {
      setSubmittingComment(true)
      const newComment = await postService.addComment(post.Id, commentText.trim())
      setComments(prev => [newComment, ...prev])
      setCommentCount(prev => prev + 1)
      setCommentText('')
      toast.success('Comment added successfully!')
    } catch (error) {
      toast.error('Failed to add comment')
    } finally {
      setSubmittingComment(false)
    }
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
              
<motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCommentToggle}
                className={`flex items-center space-x-2 group ${
                  showComments ? 'text-primary' : 'text-secondary hover:text-primary'
                }`}
              >
                <ApperIcon name="MessageCircle" size={18} />
                <span className="text-sm font-medium">{commentCount}</span>
              </motion.button>
              
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

          {/* Comments Section */}
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 pt-4 border-t border-gray-100"
            >
              {/* Comment Input Form */}
              <form onSubmit={handleSubmitComment} className="mb-4">
                <div className="flex items-start space-x-3">
                  <Avatar 
                    src="/default-avatar.png" 
                    alt="Your avatar" 
                    size="sm" 
                  />
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder="Write a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      disabled={submittingComment}
                    />
                    {commentText.trim() && (
                      <div className="flex justify-end mt-2">
                        <Button
                          type="submit"
                          size="sm"
                          disabled={submittingComment}
                          className="px-4 py-1 text-sm"
                        >
                          {submittingComment ? 'Posting...' : 'Post'}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-3">
                {loadingComments ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.Id} className="flex items-start space-x-3">
                      <Avatar 
                        src={comment.user?.avatar} 
                        alt={comment.user?.displayName} 
                        size="sm" 
                      />
                      <div className="flex-1 min-w-0">
                        <div className="bg-gray-50 rounded-lg px-3 py-2">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-semibold text-sm text-gray-900">
                              {comment.user?.displayName}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-sm text-gray-900">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 text-sm py-4">
                    No comments yet. Be the first to comment!
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </Card>
  )
}

export default PostCard