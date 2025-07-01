import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import React, { useState } from "react";
import Search from "@/components/pages/Search";
import Profile from "@/components/pages/Profile";
import Home from "@/components/pages/Home";
import Explore from "@/components/pages/Explore";
import Chat from "@/components/pages/Chat";
import ChatOverlay from "@/components/organisms/ChatOverlay";
import Layout from "@/components/organisms/Layout";

function App() {
  const [isChatOverlayOpen, setIsChatOverlayOpen] = useState(false);
return (
    <div className="min-h-screen bg-white">
      <Layout onToggleChat={() => setIsChatOverlayOpen(!isChatOverlayOpen)}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/search" element={<Search />} />
          <Route path="/messages" element={<Chat />} />
          <Route path="/messages/:conversationId" element={<Chat />} />
        </Routes>
      </Layout>
      
      <ChatOverlay 
        isOpen={isChatOverlayOpen}
        onClose={() => setIsChatOverlayOpen(false)}
      />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  )
}

export default App