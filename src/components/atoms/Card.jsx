import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  className = '', 
  hover = false, 
  padding = 'md',
  onClick,
  ...props 
}) => {
  const baseClasses = "bg-white border border-gray-100 rounded-xl shadow-sm"
  const hoverClasses = hover ? "hover:shadow-md transition-shadow duration-200" : ""
  const clickableClasses = onClick ? "cursor-pointer" : ""
  
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  }
  
  const Component = onClick ? motion.div : 'div'
  const motionProps = onClick ? {
    whileHover: { y: -1 },
    whileTap: { y: 0 }
  } : {}
  
  return (
    <Component
      className={`${baseClasses} ${hoverClasses} ${clickableClasses} ${paddings[padding]} ${className}`}
      onClick={onClick}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  )
}

export default Card