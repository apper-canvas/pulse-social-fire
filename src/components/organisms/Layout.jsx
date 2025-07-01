import Header from '@/components/organisms/Header'
import Sidebar from '@/components/organisms/Sidebar'

const Layout = ({ children, onToggleChat }) => {
  return (
    <div className="min-h-screen bg-white">
      <Header onToggleChat={onToggleChat} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Main Content */}
          <main className="flex-1 max-w-2xl">
            {children}
          </main>
          
          {/* Right Sidebar */}
          <aside className="hidden lg:block">
            <Sidebar />
          </aside>
        </div>
      </div>
    </div>
  )
}

export default Layout