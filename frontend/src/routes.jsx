import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Items from './pages/Items'

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('auth_token')
  return token ? children : <Navigate to="/login" />
}

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/items" 
          element={
            <ProtectedRoute>
              <Items />
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/items" />} />
      </Routes>
    </Router>
  )
}

export default AppRoutes
