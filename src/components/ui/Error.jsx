import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Error = ({ 
  message = 'Something went wrong',
  onRetry,
  type = 'page'
}) => {
  if (type === 'inline') {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <ApperIcon name="AlertCircle" size={24} className="text-error mx-auto mb-2" />
          <p className="text-secondary text-sm">{message}</p>
          {onRetry && (
            <Button variant="ghost" size="sm" onClick={onRetry} className="mt-2">
              Try again
            </Button>
          )}
        </div>
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
        <div className="w-16 h-16 mx-auto mb-6 bg-error/10 rounded-full flex items-center justify-center">
          <ApperIcon name="AlertTriangle" size={32} className="text-error" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Oops! Something went wrong
        </h3>
        
        <p className="text-secondary mb-6">
          {message}. Please try again or contact support if the problem persists.
        </p>
        
        <div className="flex items-center justify-center space-x-3">
          {onRetry && (
            <Button variant="primary" onClick={onRetry} icon="RefreshCw">
              Try Again
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}

export default Error