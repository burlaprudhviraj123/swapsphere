import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/Home/HomePage.jsx'
import { MarketplacePage } from './pages/Marketplace/MarketplacePage.jsx'
import { AboutPage } from './pages/About/AboutPage.jsx'
import { LoginPage } from './pages/Auth/LoginPage.jsx'
import { RegisterPage } from './pages/Auth/RegisterPage.jsx'
import { BackgroundLab } from './pages/BackgroundLab/BackgroundLab.jsx'
import { ProductDetailsPage } from './pages/ProductDetails/ProductDetailsPage.jsx'
import { ProfilePage } from './pages/Profile/ProfilePage.jsx'
import { CreateListingPage } from './pages/CreateListing/CreateListingPage.jsx'
import { MyActivityPage } from './pages/MyActivity/MyActivityPage.jsx'
import { MessagesPage } from './pages/Messages/MessagesPage.jsx'
import { ProtectedRoute } from './components/auth/ProtectedRoute.jsx'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/marketplace/:id" element={<ProductDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/lab" element={<BackgroundLab />} />
        
        {/* Protected Routes */}
        <Route path="/messages" element={
          <ProtectedRoute>
            <MessagesPage />
          </ProtectedRoute>
        } />
        <Route path="/my-activity" element={
          <ProtectedRoute>
            <MyActivityPage />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/create-listing" element={
          <ProtectedRoute>
            <CreateListingPage />
          </ProtectedRoute>
        } />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
