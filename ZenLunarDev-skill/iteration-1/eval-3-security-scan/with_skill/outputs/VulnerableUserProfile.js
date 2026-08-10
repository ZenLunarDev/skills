import React, { useState, useEffect } from 'react';

const API_KEY = 'sk-1234567890abcdef-exposed-api-key';

const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`https://api.example.com/users/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUser();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');

    const response = await fetch('https://api.example.com/users/update', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({ name }),
    });

    const data = await response.json();
    alert(data.message);
  };

  const renderBio = () => {
    return user?.bio || 'No bio available';
  };

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="user-profile">
      <h1>{user.name}</h1>
      <div className="user-bio">
        <p dangerouslySetInnerHTML={{ __html: renderBio() }} />
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" defaultValue={user.name} />
        <button type="submit">Update</button>
      </form>
      <div className="user-stats">
        <span onClick={() => console.log(user.id)}>ID: {user.id}</span>
        <span onClick={() => alert('Email: ' + user.email)}>Email</span>
      </div>
    </div>
  );
};

export default UserProfile;
