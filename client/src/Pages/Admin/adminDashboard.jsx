import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './adminDashboard.css'

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editData, setEditData] = useState({ name: '', email: '', isAdmin: false });
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    password: '',
    isAdmin: false,
  });

  const handleAddUserChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewUserData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddUser = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:4000/api/user/add-user', newUserData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsAddOpen(false);
      fetchUsers()
    } catch (err) {
      console.error(err);
      alert('Failed to add user');
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:4000/api/user/all-users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:4000/api/user/delete-user/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Refresh the user list
        fetchUsers();
      } catch (err) {
        console.error('Delete failed:', err);
        alert('Error deleting user');
      }
    }
  };


  useEffect(() => {
    fetchUsers();
  }, []);
  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditData({ name: user.name, email: user.email, isAdmin: user.isAdmin });
    setIsEditOpen(true);
  };
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  const handleUpdateUser = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:4000/api/user/edit-user/${selectedUser._id}`,
        editData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsEditOpen(false);
      fetchUsers(); // refresh after update
    } catch (err) {
      console.error(err);
      alert('Update failed');
    }
  };


  return (
    <div className='admin-dashboard'>
      <h2>Admin Dashboard</h2>

      <input
        type="text"
        placeholder="Search by name or email"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '1rem', padding: '5px', width: '300px' }}
      />

      <button onClick={() => setIsAddOpen(true)}>➕ Add New User</button>

      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>#</th>
            <th>Profile</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {[...users]
            .reverse()
            .filter(
              (user) =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((user, idx) => (
              <tr key={user._id}>
                <td>{idx + 1}</td>
                <td>
                  <img
                    src={`http://localhost:4000/uploads/${user.profileImage}`}
                    alt="profile"
                    width="50"
                    height="50"
                  />
                </td>
                <td>{user.name || 'N/A'}</td>
                <td>{user.email}</td>
                <td>{user.isAdmin ? 'Admin' : 'User'}</td>
                <td>
                  <button onClick={() => openEditModal(user)}>Edit</button>
                  <button onClick={() => handleDelete(user._id)}>Delete</button>
                </td>
              </tr>
            ))}

          {isEditOpen && (
            <div className="modal">
              <h3>Edit User</h3>
              <input
                type="text"
                name="name"
                value={editData.name}
                onChange={handleEditChange}
                placeholder="Name"
              />
              <input
                type="email"
                name="email"
                value={editData.email}
                onChange={handleEditChange}
                placeholder="Email"
              />
              <label>
                <input
                  type="checkbox"
                  name="isAdmin"
                  checked={editData.isAdmin}
                  onChange={handleEditChange}
                />{' '}
                Is Admin
              </label>
              <button onClick={handleUpdateUser}>Save</button>
              <button onClick={() => setIsEditOpen(false)}>Cancel</button>
            </div>
          )}

          {isAddOpen && (
            <div className="modal">
              <h3>Add New User</h3>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={newUserData.name}
                onChange={handleAddUserChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={newUserData.email}
                onChange={handleAddUserChange}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={newUserData.password}
                onChange={handleAddUserChange}
              />
              <label>
                <input
                  type="checkbox"
                  name="isAdmin"
                  checked={newUserData.isAdmin}
                  onChange={handleAddUserChange}
                />{' '}
                Is Admin
              </label>
              <button onClick={handleAddUser}>Add</button>
              <button onClick={() => setIsAddOpen(false)}>Cancel</button>
            </div>
          )}
        </tbody>
      </table>
    </div>


  )
};

export default AdminDashboard;
