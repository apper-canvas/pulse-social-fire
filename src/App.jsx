import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import React from "react";
import Search from "@/components/pages/Search";
import Profile from "@/components/pages/Profile";
import Home from "@/components/pages/Home";
import Explore from "@/components/pages/Explore";
import Chat from "@/components/pages/Chat";
import Layout from "@/components/organisms/Layout";

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Layout>
<Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/search" element={<Search />} />
          <Route path="/messages" element={<Chat />} />
          <Route path="/messages/:conversationId" element={<Chat />} />
        </Routes>
      </Layout>
      
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