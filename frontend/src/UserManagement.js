import React, { useState, useEffect } from 'react';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Update this URL to your deployed Render backend
  const API_URL = "https://crud-webapp-project.onrender.com/users";

  // Fetch users from backend
  const fetchUsers = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => { fetchUsers(); }, []);

  // Add or update user
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await fetch(`${API_URL}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      });
      setEditingId(null);
    } else {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      });
    }
    setName(''); setEmail('');
    fetchUsers();
  };

  // Delete user
  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchUsers();
  };

  // Edit user
  const handleEdit = (user) => {
    setEditingId(user.id);
    setName(user.name);
    setEmail(user.email);
  };

  return (
    <div className="container mt-4">
      <h2>User Management</h2>
      <form onSubmit={handleSubmit} className="mb-3">
        <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="form-control mb-2"/>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="form-control mb-2"/>
        <button className="btn btn-primary" type="submit">{editingId ? "Update" : "Add"} User</button>
      </form>

      <table className="table table-bordered">
        <thead>
          <tr><th>ID</th><th>Name</th><th>Email</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(u)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserManagement;

