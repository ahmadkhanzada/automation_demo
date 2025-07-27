import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getItems, createItem, updateItem, deleteItem } from '../api/client'

const Items = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [newItem, setNewItem] = useState({ title: '', description: '' })
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    try {
      const data = await getItems()
      setItems(data)
    } catch (err) {
      if (err.message === 'Unauthorized') {
        localStorage.removeItem('auth_token')
        navigate('/login')
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!newItem.title.trim()) return

    try {
      const created = await createItem(newItem)
      setItems([...items, created])
      setNewItem({ title: '', description: '' })
    } catch (err) {
      if (err.message === 'Unauthorized') {
        localStorage.removeItem('auth_token')
        navigate('/login')
      } else {
        setError(err.message)
      }
    }
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setEditData({ title: item.title, description: item.description })
  }

  const handleSave = async (id) => {
    try {
      const updated = await updateItem(id, editData)
      setItems(items.map(item => item.id === id ? updated : item))
      setEditingId(null)
      setEditData({})
    } catch (err) {
      if (err.message === 'Unauthorized') {
        localStorage.removeItem('auth_token')
        navigate('/login')
      } else {
        setError(err.message)
      }
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditData({})
  }

  const handleDelete = async (id) => {
    try {
      await deleteItem(id)
      setItems(items.filter(item => item.id !== id))
    } catch (err) {
      if (err.message === 'Unauthorized') {
        localStorage.removeItem('auth_token')
        navigate('/login')
      } else {
        setError(err.message)
      }
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    navigate('/login')
  }

  if (loading) return <div>Loading...</div>

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Items</h1>
        <button 
          onClick={handleLogout}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#dc3545', 
            color: 'white', 
            border: 'none', 
            cursor: 'pointer' 
          }}
        >
          Logout
        </button>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}

      {/* Create Form */}
      <form onSubmit={handleCreate} data-testid="create-form" style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd' }}>
        <h3>Create New Item</h3>
        <div style={{ marginBottom: '15px' }}>
          <label>Title:</label>
          <input
            type="text"
            value={newItem.title}
            onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
            data-testid="create-title-input"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Description:</label>
          <textarea
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            data-testid="create-description-input"
            style={{ width: '100%', padding: '8px', marginTop: '5px', height: '60px' }}
          />
        </div>
        <button 
          type="submit"
          data-testid="create-button"
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#28a745', 
            color: 'white', 
            border: 'none', 
            cursor: 'pointer' 
          }}
        >
          Create Item
        </button>
      </form>

      {/* Items List */}
      <div data-testid="items-list">
        {items.length === 0 ? (
          <p>No items found.</p>
        ) : (
          items.map(item => (
            <div key={item.id} data-testid={`item-${item.id}`} style={{ 
              border: '1px solid #ddd', 
              padding: '15px', 
              marginBottom: '10px',
              borderRadius: '4px'
            }}>
              {editingId === item.id ? (
                <div>
                  <div style={{ marginBottom: '10px' }}>
                    <label>Title:</label>
                    <input
                      type="text"
                      value={editData.title}
                      onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                      data-testid={`edit-title-${item.id}`}
                      style={{ width: '100%', padding: '5px', marginTop: '3px' }}
                    />
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <label>Description:</label>
                    <textarea
                      value={editData.description}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                      data-testid={`edit-description-${item.id}`}
                      style={{ width: '100%', padding: '5px', marginTop: '3px', height: '50px' }}
                    />
                  </div>
                  <button 
                    onClick={() => handleSave(item.id)}
                    data-testid={`save-${item.id}`}
                    style={{ 
                      padding: '5px 10px', 
                      backgroundColor: '#28a745', 
                      color: 'white', 
                      border: 'none', 
                      cursor: 'pointer',
                      marginRight: '10px'
                    }}
                  >
                    Save
                  </button>
                  <button 
                    onClick={handleCancel}
                    data-testid={`cancel-${item.id}`}
                    style={{ 
                      padding: '5px 10px', 
                      backgroundColor: '#6c757d', 
                      color: 'white', 
                      border: 'none', 
                      cursor: 'pointer' 
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div>
                  <h4 data-testid={`title-${item.id}`}>{item.title}</h4>
                  <p data-testid={`description-${item.id}`}>{item.description}</p>
                  <button 
                    onClick={() => handleEdit(item)}
                    data-testid={`edit-${item.id}`}
                    style={{ 
                      padding: '5px 10px', 
                      backgroundColor: '#007bff', 
                      color: 'white', 
                      border: 'none', 
                      cursor: 'pointer',
                      marginRight: '10px'
                    }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    data-testid={`delete-${item.id}`}
                    style={{ 
                      padding: '5px 10px', 
                      backgroundColor: '#dc3545', 
                      color: 'white', 
                      border: 'none', 
                      cursor: 'pointer' 
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Items
