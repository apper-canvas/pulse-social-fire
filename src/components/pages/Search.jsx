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

const Search = () => {
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [results, setResults] = useState({ users: [], posts: [], hashtags: [] })
  const [activeTab, setActiveTab] = useState('all')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
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
      <Card>
        <form onSubmit={handleSearch}>
          <Input
            type="text"
            placeholder="Search for people, posts, hashtags..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            icon="Search"
            className="text-lg"
          />
        </form>
      </Card>
      
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