import { useState } from 'react'
import PostComposer from '@/components/molecules/PostComposer'
import StoriesBar from '@/components/organisms/StoriesBar'
import PostFeed from '@/components/organisms/PostFeed'

const Home = () => {
  const [feedRefreshTrigger, setFeedRefreshTrigger] = useState(0)
  
  const handlePostCreated = (newPost) => {
    // Trigger feed refresh
    setFeedRefreshTrigger(prev => prev + 1)
  }
  
  return (
    <div className="space-y-6">
      {/* Stories */}
      <StoriesBar />
      
      {/* Post Composer */}
      <PostComposer onPostCreated={handlePostCreated} />
      
      {/* Feed */}
      <PostFeed refreshTrigger={feedRefreshTrigger} />
    </div>
  )
}

export default Home