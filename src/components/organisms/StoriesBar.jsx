import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import StoryItem from '@/components/molecules/StoryItem'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { storyService } from '@/services/api/storyService'

const StoriesBar = () => {
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    loadStories()
  }, [])
  
  const loadStories = async () => {
    try {
      setError(null)
      setLoading(true)
      const storiesData = await storyService.getAll()
      setStories(storiesData)
    } catch (error) {
      console.error('Failed to load stories:', error)
      setError('Failed to load stories')
    } finally {
      setLoading(false)
    }
  }
  
  const handleAddStory = () => {
    // In a real app, this would open a story creation modal
    toast.info('Story creation coming soon!')
  }
  
  const handleStoryClick = (story) => {
    // In a real app, this would open the story viewer
    toast.info(`Viewing ${story.user.displayName}'s story`)
  }
  
  if (loading) {
    return (
      <div className="mb-6">
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex-shrink-0">
              <div className="w-16 h-16 bg-surface rounded-full animate-pulse"></div>
              <div className="w-12 h-3 bg-surface rounded mt-2 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  if (error) {
    return <Error message={error} onRetry={loadStories} />
  }
  
  return (
    <div className="mb-6">
      <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
        {/* Add Story Button */}
        <StoryItem isAddStory onClick={handleAddStory} />
        
        {/* Stories */}
        {stories.length > 0 ? (
          stories.map((story) => (
            <StoryItem
              key={story.Id}
              story={story}
              onClick={() => handleStoryClick(story)}
            />
          ))
        ) : (
          <div className="flex-1">
            <Empty 
              icon="Camera"
              title="No stories yet"
              description="Be the first to share a story!"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default StoriesBar