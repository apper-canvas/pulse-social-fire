import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import Input from '@/components/atoms/Input'
import UserCard from '@/components/molecules/UserCard'
import PostCard from '@/components/molecules/PostCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { searchService } from '@/services/api/searchService'
import { hashtagService } from '@/services/api/hashtagService'

const Search = () => {
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [results, setResults] = useState({ users: [], posts: [], hashtags: [] })
  const [activeTab, setActiveTab] = useState('all')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showTrending, setShowTrending] = useState(false)
  const [trendingHashtags, setTrendingHashtags] = useState([])
  const [trendingLoading, setTrendingLoading] = useState(false)
  useEffect(() => {
    const q = searchParams.get('q')
    if (q) {
      setQuery(q)
      performSearch(q)
    }
  }, [searchParams])
  
  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults({ users: [], posts: [], hashtags: [] })
      return
    }
    
    try {
      setError(null)
      setLoading(true)
      const searchResults = await searchService.searchAll(searchQuery)
      setResults(searchResults)
    } catch (error) {
      console.error('Search failed:', error)
      setError('Search failed')
    } finally {
      setLoading(false)
    }
  }
  
  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      performSearch(query)
    }
}
  
  const handleSearchInputFocus = async () => {
    if (!showTrending) {
      setShowTrending(true)
      if (trendingHashtags.length === 0) {
        try {
          setTrendingLoading(true)
          const trending = await hashtagService.getTrending(8)
          setTrendingHashtags(trending)
        } catch (error) {
          console.error('Failed to fetch trending hashtags:', error)
        } finally {
          setTrendingLoading(false)
        }
      }
    }
  }
  
  const handleTrendingHashtagClick = (hashtag) => {
    const searchQuery = `#${hashtag.tag}`
    setQuery(searchQuery)
    setShowTrending(false)
    performSearch(searchQuery)
  }
  
  const handleSearchInputBlur = () => {
    // Delay hiding to allow hashtag clicks
    setTimeout(() => setShowTrending(false), 200)
  }
  
  const tabs = [
    { id: 'all', label: 'All', count: results.users.length + results.posts.length + results.hashtags.length },
    { id: 'users', label: 'People', count: results.users.length },
    { id: 'posts', label: 'Posts', count: results.posts.length },
    { id: 'hashtags', label: 'Hashtags', count: results.hashtags.length }
  ]
  
  const renderResults = () => {
    if (loading) return <Loading />
    if (error) return <Error message={error} onRetry={() => performSearch(query)} />
    
    const hasResults = results.users.length > 0 || results.posts.length > 0 || results.hashtags.length > 0
    
    if (!hasResults && query) {
      return (
        <Empty 
          icon="Search"
          title="No results found"
          description={`We couldn't find anything for "${query}"`}
        />
      )
    }
    
    return (
      <div className="space-y-6">
        {(activeTab === 'all' || activeTab === 'users') && results.users.length > 0 && (
          <div>
            {activeTab === 'all' && <h3 className="font-semibold text-gray-900 mb-4">People</h3>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.users.map((user) => (
                <UserCard key={user.Id} user={user} />
              ))}
            </div>
          </div>
        )}
        
        {(activeTab === 'all' || activeTab === 'hashtags') && results.hashtags.length > 0 && (
          <div>
            {activeTab === 'all' && <h3 className="font-semibold text-gray-900 mb-4">Hashtags</h3>}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.hashtags.map((hashtag) => (
                <Card key={hashtag.tag} hover className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                    <ApperIcon name="Hash" size={24} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    #{hashtag.tag}
                  </h3>
                  <p className="text-secondary text-sm">
                    {hashtag.postCount} posts
                  </p>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {(activeTab === 'all' || activeTab === 'posts') && results.posts.length > 0 && (
          <div>
            {activeTab === 'all' && <h3 className="font-semibold text-gray-900 mb-4">Posts</h3>}
            <div className="space-y-4">
              {results.posts.map((post) => (
                <PostCard key={post.Id} post={post} />
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Search</h1>
        <p className="text-secondary">Find people, posts, and hashtags</p>
      </div>
      
{/* Search Form */}
      <div className="relative">
        <Card>
          <form onSubmit={handleSearch}>
            <Input
              type="text"
              placeholder="Search for people, posts, hashtags..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={handleSearchInputFocus}
              onBlur={handleSearchInputBlur}
              icon="Search"
              className="text-lg"
            />
          </form>
        </Card>
        
        {/* Trending Hashtags Dropdown */}
        {showTrending && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 z-10"
          >
            <Card>
              <div className="p-2">
                <div className="flex items-center space-x-2 mb-3">
                  <ApperIcon name="TrendingUp" size={16} className="text-primary" />
                  <h3 className="font-medium text-gray-900">Trending Hashtags</h3>
                </div>
                
                {trendingLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {trendingHashtags.map((hashtag) => (
                      <button
                        key={hashtag.tag}
                        onClick={() => handleTrendingHashtagClick(hashtag)}
                        className="flex items-center space-x-2 p-2 rounded-lg bg-gray-50 hover:bg-primary/10 transition-colors text-left"
                      >
                        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <ApperIcon name="Hash" size={12} className="text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 text-sm truncate">
                            {hashtag.tag}
                          </p>
                          <p className="text-xs text-secondary">
                            {hashtag.postCount} posts
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </div>
      {/* Tabs */}
      {query && (
        <Card padding="none">
          <div className="flex border-b border-gray-100 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 flex items-center space-x-2 py-4 px-6 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                    : 'text-secondary hover:text-gray-900 hover:bg-surface'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </Card>
      )}
      
      {/* Results */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderResults()}
      </motion.div>
    </div>
  )
}

export default Search