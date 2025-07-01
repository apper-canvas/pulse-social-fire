import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  icon = 'Inbox',
  title = 'Nothing here yet',
  description = 'Check back later for new content',
  actionText,
  onAction,
  type = 'page'
}) => {
  if (type === 'inline') {
    return (
      <div className="text-center py-8">
        <ApperIcon name={icon} size={24} className="text-secondary mx-auto mb-2 opacity-50" />
        <p className="text-secondary text-sm">{title}</p>
        {description && (
          <p className="text-secondary text-xs mt-1 opacity-75">{description}</p>
        )}
      </div>
    )
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center py-12"
    >
      <Card className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-surface to-gray-100 rounded-full flex items-center justify-center">
          <ApperIcon name={icon} size={32} className="text-secondary" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        
        <p className="text-secondary mb-6">
          {description}
        </p>
        
        {actionText && onAction && (
          <Button variant="primary" onClick={onAction} className="mx-auto">
            {actionText}
          </Button>
        )}
      </Card>
    </motion.div>
  )
}

export default Empty