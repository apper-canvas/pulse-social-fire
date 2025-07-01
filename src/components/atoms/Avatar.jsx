import { motion } from 'framer-motion'

const Avatar = ({ 
  src, 
  alt, 
  size = 'md', 
  online = false, 
  story = false,
  className = '',
  onClick 
}) => {
  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20'
  }
  
  const storyClasses = story ? 'ring-2 ring-primary ring-offset-2' : ''
  const clickableClasses = onClick ? 'cursor-pointer' : ''
  
  return (
    <div className={`relative ${clickableClasses}`}>
      <motion.div
        whileHover={onClick ? { scale: 1.05 } : {}}
        whileTap={onClick ? { scale: 0.95 } : {}}
        className={`${sizes[size]} rounded-full overflow-hidden bg-surface ${storyClasses} ${className}`}
        onClick={onClick}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <span className="text-primary font-semibold text-sm">
              {alt?.charAt(0)?.toUpperCase() || '?'}
            </span>
          </div>
        )}
      </motion.div>
      
      {online && (
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success border-2 border-white rounded-full"></div>
      )}
    </div>
  )
}

export default Avatar