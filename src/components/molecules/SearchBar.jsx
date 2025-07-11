import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Input from '@/components/atoms/Input'
import Card from '@/components/atoms/Card'
import Avatar from '@/components/atoms/Avatar'
import ApperIcon from '@/components/ApperIcon'
import { searchService } from '@/services/api/searchService'

const SearchBar = ({ className = '' }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [trendingHashtags, setTrendingHashtags] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([])
      setIsOpen(false)
      return
    }
    
    setLoading(true)
    try {
      const searchResults = await searchService.search(searchQuery)
      setResults(searchResults)
      setIsOpen(true)
    } catch (error) {
      console.error('Search failed:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
}
  
  const loadTrendingHashtags = async () => {
    try {
      const trending = await searchService.getTrendingHashtags()
      setTrendingHashtags(trending)
    } catch (error) {
      console.error('Failed to load trending hashtags:', error)
      setTrendingHashtags([])
    }
  }
  
  const handleInputChange = (e) => {
    const value = e.target.value
    setQuery(value)
    handleSearch(value)
  }
  
  const handleFocus = () => {
    setIsOpen(true)
    if (trendingHashtags.length === 0) {
      loadTrendingHashtags()
    }
  }
  
  const handleResultClick = (result) => {
    if (result.type === 'user') {
      navigate(`/profile/${result.username}`)
    } else if (result.type === 'hashtag') {
      navigate(`/search?q=${encodeURIComponent(result.tag)}`)
    }
    setIsOpen(false)
    setQuery('')
  }
  
  const handleHashtagClick = (hashtag) => {
    navigate(`/search?q=${encodeURIComponent(hashtag.tag)}`)
    setIsOpen(false)
  }
  return (
    <div className={`relative ${className}`}>
      <Input
        type="text"
        placeholder="Search users, hashtags..."
        value={query}
        onChange={handleInputChange}
        icon="Search"
className="w-full"
        onFocus={handleFocus}
      />
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 z-50 mt-2"
>
            <Card className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-secondary">
                  <ApperIcon name="Loader2" size={20} className="animate-spin mx-auto" />
                </div>
              ) : (
                <>
                  {/* Show trending hashtags when no query */}
                  {!query && trendingHashtags.length > 0 && (
                    <div className="space-y-1">
                      <div className="px-3 py-2 border-b border-gray-100">
                        <h4 className="text-sm font-medium text-gray-700 flex items-center">
                          <ApperIcon name="TrendingUp" size={16} className="text-primary mr-2" />
                          Trending Hashtags
                        </h4>
                      </div>
                      {trendingHashtags.map((hashtag) => (
                        <motion.div
                          key={hashtag.tag}
                          whileHover={{ backgroundColor: '#F8FAFC' }}
                          className="flex items-center p-3 rounded-lg cursor-pointer"
                          onClick={() => handleHashtagClick(hashtag)}
                        >
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <ApperIcon name="Hash" size={16} className="text-primary" />
                          </div>
                          <div className="ml-3">
                            <p className="font-medium text-gray-900">#{hashtag.tag}</p>
                            <p className="text-sm text-secondary">{hashtag.postCount} posts</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                  
                  {/* Show search results when query exists */}
                  {query && results.length > 0 && (
                    <div className="space-y-1">
                      {results.map((result) => (
                        <motion.div
                          key={`${result.type}-${result.id || result.tag}`}
                          whileHover={{ backgroundColor: '#F8FAFC' }}
                          className="flex items-center p-3 rounded-lg cursor-pointer"
                          onClick={() => handleResultClick(result)}
                        >
                          {result.type === 'user' ? (
                            <>
                              <Avatar src={result.avatar} alt={result.displayName} size="sm" />
                              <div className="ml-3">
                                <p className="font-medium text-gray-900">{result.displayName}</p>
                                <p className="text-sm text-secondary">@{result.username}</p>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <ApperIcon name="Hash" size={16} className="text-primary" />
                              </div>
                              <div className="ml-3">
                                <p className="font-medium text-gray-900">#{result.tag}</p>
                                <p className="text-sm text-secondary">{result.postCount} posts</p>
                              </div>
                            </>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                  
                  {/* Show no results message */}
                  {query && results.length === 0 && (
                    <div className="p-4 text-center text-secondary">
                      <ApperIcon name="Search" size={24} className="mx-auto mb-2 opacity-50" />
                      <p>No results found for "{query}"</p>
                    </div>
                  )}
                </>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SearchBar