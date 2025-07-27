import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/client'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await login({ email, password })
      localStorage.setItem('auth_token', response.token)
      navigate('/items')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit} data-testid="login-form">
        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            data-testid="email-input"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            data-testid="password-input"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            required
          />
        </div>
        {error && <div data-testid="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        <button 
          type="submit" 
          disabled={loading}
          data-testid="login-button"
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            cursor: 'pointer' 
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        Demo credentials: user@example.com / Password123
      </p>
    </div>
  )
}

export default Login
