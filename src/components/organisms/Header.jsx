import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import SearchBar from '@/components/molecules/SearchBar'
import Avatar from '@/components/atoms/Avatar'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Header = ({ onToggleChat }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [notifications] = useState(3) // Mock notification count
  const navigate = useNavigate()
  
  const currentUser = {
    Id: 1,
    username: 'johndoe',
    displayName: 'John Doe',
    avatar: '/api/placeholder/40/40'
  }
  
  const handleProfileClick = () => {
    navigate(`/profile/${currentUser.username}`)
    setShowProfileMenu(false)
  }
  
return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center"
            >
              <ApperIcon name="Zap" size={20} className="text-white" />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Pulse
            </span>
          </Link>
          
          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <SearchBar />
          </div>
          
          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className="text-gray-700 hover:text-primary transition-colors font-medium"
              >
                Home
              </Link>
              <Link
                to="/explore"
                className="text-gray-700 hover:text-primary transition-colors font-medium"
              >
                Explore
              </Link>
            </nav>
            
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <ApperIcon name="Bell" size={20} />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white text-xs rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </Button>
            
{/* Messages */}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onToggleChat}
              title="Open messages"
            >
              <ApperIcon name="Mail" size={20} />
            </Button>
            
            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-1 rounded-full hover:bg-surface transition-colors"
              >
                <Avatar
                  src={currentUser.avatar}
                  alt={currentUser.displayName}
                  size="sm"
                />
              </button>
              
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50"
                  >
                    <button
                      onClick={handleProfileClick}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-surface flex items-center space-x-2"
                    >
                      <ApperIcon name="User" size={16} />
                      <span>Profile</span>
                    </button>
                    <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-surface flex items-center space-x-2">
                      <ApperIcon name="Settings" size={16} />
                      <span>Settings</span>
                    </button>
                    <hr className="my-2 border-gray-100" />
                    <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-surface flex items-center space-x-2">
                      <ApperIcon name="LogOut" size={16} />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header