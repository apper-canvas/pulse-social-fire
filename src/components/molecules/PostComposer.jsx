import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Card from '@/components/atoms/Card'
import Avatar from '@/components/atoms/Avatar'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { postService } from '@/services/api/postService'

const PostComposer = ({ onPostCreated }) => {
  const [content, setContent] = useState('')
  const [location, setLocation] = useState('')
  const [showLocationInput, setShowLocationInput] = useState(false)
  const [media, setMedia] = useState([])
  const [loading, setLoading] = useState(false)
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!content.trim()) {
      toast.error('Please write something to share')
      return
    }
    
    setLoading(true)
    try {
      const newPost = {
        content: content.trim(),
        location: location.trim(),
        media: media,
        hashtags: extractHashtags(content)
      }
      
      const createdPost = await postService.create(newPost)
      
      // Reset form
      setContent('')
      setLocation('')
      setShowLocationInput(false)
      setMedia([])
      
      toast.success('Post shared successfully!')
      
      if (onPostCreated) {
        onPostCreated(createdPost)
      }
    } catch (error) {
      toast.error('Failed to create post')
    } finally {
      setLoading(false)
    }
  }
  
  const extractHashtags = (text) => {
    const hashtags = text.match(/#[a-zA-Z0-9_]+/g)
    return hashtags ? hashtags.map(tag => tag.substring(1)) : []
  }
  
  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files)
    // In a real app, you'd upload to a service and get URLs
    const mediaItems = files.map(file => ({
      type: file.type.startsWith('image/') ? 'image' : 'video',
      url: URL.createObjectURL(file),
      file
    }))
    setMedia(prev => [...prev, ...mediaItems])
  }
  
  const removeMedia = (index) => {
    setMedia(prev => prev.filter((_, i) => i !== index))
  }
  
  return (
    <Card className="mb-6">
      <form onSubmit={handleSubmit}>
        <div className="flex space-x-3">
          <Avatar 
            src="/api/placeholder/40/40" 
            alt="Your avatar" 
            size="md" 
          />
          
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's happening?"
              className="w-full p-3 text-lg resize-none border-none focus:outline-none placeholder-secondary"
              rows={3}
              maxLength={280}
            />
            
            {showLocationInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2"
              >
                <div className="flex items-center space-x-2 p-2 bg-surface rounded-lg">
                  <ApperIcon name="MapPin" size={16} className="text-secondary" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Add location..."
                    className="flex-1 bg-transparent border-none focus:outline-none text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setShowLocationInput(false)
                      setLocation('')
                    }}
                    className="text-secondary hover:text-gray-600"
                  >
                    <ApperIcon name="X" size={16} />
                  </button>
                </div>
              </motion.div>
            )}
            
            {media.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {media.map((item, index) => (
                  <div key={index} className="relative rounded-lg overflow-hidden">
                    {item.type === 'image' ? (
                      <img
                        src={item.url}
                        alt="Upload preview"
                        className="w-full h-32 object-cover"
                      />
                    ) : (
                      <video
                        src={item.url}
                        className="w-full h-32 object-cover"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => removeMedia(index)}
                      className="absolute top-2 right-2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70"
                    >
                      <ApperIcon name="X" size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <label className="cursor-pointer text-secondary hover:text-primary">
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleMediaUpload}
                className="sr-only"
              />
              <ApperIcon name="Image" size={20} />
            </label>
            
            <button
              type="button"
              onClick={() => setShowLocationInput(!showLocationInput)}
              className={`${showLocationInput ? 'text-primary' : 'text-secondary hover:text-primary'}`}
            >
              <ApperIcon name="MapPin" size={20} />
            </button>
            
            <button
              type="button"
              className="text-secondary hover:text-primary"
            >
              <ApperIcon name="Smile" size={20} />
            </button>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className={`text-sm ${content.length > 250 ? 'text-warning' : content.length > 280 ? 'text-error' : 'text-secondary'}`}>
              {280 - content.length}
            </span>
            
            <Button
              type="submit"
              disabled={!content.trim() || loading || content.length > 280}
              className="px-6"
            >
              {loading ? 'Sharing...' : 'Share'}
            </Button>
          </div>
        </div>
      </form>
    </Card>
  )
}

export default PostComposer