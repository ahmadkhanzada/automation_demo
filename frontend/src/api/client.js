const API_BASE_URL = 'http://localhost:3001'

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token')
  return token ? { 'Authorization': `Bearer ${token}` } : {}
}

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `HTTP ${response.status}`)
  }
  
  if (response.status === 204) {
    return null
  }
  
  return await response.json()
}

export const login = async ({ email, password }) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })
  
  return await handleResponse(response)
}

export const getItems = async () => {
  const response = await fetch(`${API_BASE_URL}/items`, {
    headers: {
      ...getAuthHeaders(),
    },
  })
  
  return await handleResponse(response)
}

export const createItem = async ({ title, description }) => {
  const response = await fetch(`${API_BASE_URL}/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ title, description }),
  })
  
  return await handleResponse(response)
}

export const updateItem = async (id, { title, description }) => {
  const response = await fetch(`${API_BASE_URL}/items/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ title, description }),
  })
  
  return await handleResponse(response)
}

export const deleteItem = async (id) => {
  const response = await fetch(`${API_BASE_URL}/items/${id}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders(),
    },
  })
  
  return await handleResponse(response)
}
