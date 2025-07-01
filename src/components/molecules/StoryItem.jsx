import { motion } from 'framer-motion'
import Avatar from '@/components/atoms/Avatar'
import ApperIcon from '@/components/ApperIcon'

const StoryItem = ({ story, isAddStory = false, onClick }) => {
  if (isAddStory) {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex-shrink-0 cursor-pointer"
        onClick={onClick}
      >
        <div className="flex flex-col items-center space-y-2">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-surface to-gray-100 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center hover:border-primary transition-colors">
              <ApperIcon name="Plus" size={24} className="text-secondary" />
            </div>
          </div>
          <span className="text-xs text-secondary font-medium">Add Story</span>
        </div>
      </motion.div>
    )
  }
  
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex-shrink-0 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-col items-center space-y-2">
        <Avatar 
          src={story.user?.avatar} 
          alt={story.user?.displayName} 
          size="xl"
          story={true}
        />
        <span className="text-xs text-gray-900 font-medium max-w-[60px] truncate">
          {story.user?.displayName}
        </span>
      </div>
    </motion.div>
  )
}

export default StoryItem