import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import API from '../../Utils/api';
import './Profile.css'

const Profile = () => {
    const { user } = useSelector((state) => state.auth);
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [updatedUser, setUpdatedUser] = useState(user);
    const [newName, setNewName] = useState(user?.name || '');

    useEffect(() => {
        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setPreview('');
        }
    }, [selectedFile]);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('profileImage', selectedFile);

        try {
            const res = await API.post('/user/upload-profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setUpdatedUser(res.data.user);
            alert('Profile image uploaded successfully!');
        } catch (err) {
            console.error(err);
            alert('Upload failed!');
        }
    };

    const handleUpdateProfile = async () => {
        try {
            const res = await API.put('/user/update-name', { name: newName });
            setUpdatedUser(res.data.user);
            alert('Name updated successfully!');
        } catch (err) {
            console.error(err);
            alert('Failed to update name!');
        }
    };

    return (
        <div style={{ padding: '2rem' }} className='profile-container'>
            <h2>Welcome, {updatedUser?.name || 'User'}</h2>

            <div>
                <img
                    src={
                        updatedUser?.profileImage
                            ? `http://localhost:4000/uploads/${updatedUser.profileImage}`
                            : 'https://via.placeholder.com/150'
                    }
                    alt="Profile"
                    width={150}
                    height={150}
                    style={{ borderRadius: '50%', marginBottom: '1rem' }}
                />
            </div>

            <input type="file" onChange={handleFileChange} />
            {selectedFile && (
                <div style={{ margin: '1rem 0' }}>
                    <img src={preview} alt="Preview" width={150} height={150} />
                    <br />
                    <button onClick={handleUpload}>Upload</button>
                </div>
            )}

            <div style={{ marginTop: '2rem' }}>
                <label>Update Name: </label>
                <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    style={{ marginRight: '1rem', padding: '5px' }}
                />
                <button onClick={handleUpdateProfile}>Update Profile</button>
            </div>
        </div>
    );
};

export default Profile;
