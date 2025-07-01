import ApperIcon from '@/components/ApperIcon'

const Loading = ({ type = 'page' }) => {
  if (type === 'inline') {
    return (
      <div className="flex items-center justify-center py-4">
        <ApperIcon name="Loader2" size={20} className="animate-spin text-primary" />
      </div>
    )
  }
  
  if (type === 'posts') {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-xl p-4">
            <div className="flex space-x-3">
              <div className="w-10 h-10 bg-surface rounded-full animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-4 bg-surface rounded animate-pulse"></div>
                  <div className="w-16 h-4 bg-surface rounded animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-4 bg-surface rounded animate-pulse"></div>
                  <div className="w-3/4 h-4 bg-surface rounded animate-pulse"></div>
                </div>
                <div className="w-full h-32 bg-surface rounded-lg animate-pulse"></div>
                <div className="flex space-x-6 pt-2">
                  <div className="w-12 h-4 bg-surface rounded animate-pulse"></div>
                  <div className="w-12 h-4 bg-surface rounded animate-pulse"></div>
                  <div className="w-12 h-4 bg-surface rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }
  
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <ApperIcon name="Loader2" size={32} className="animate-spin text-primary mx-auto mb-4" />
        <p className="text-secondary">Loading...</p>
      </div>
    </div>
  )
}

export default Loading