import React, { useEffect, useState } from 'react';

const API_KEY = process.env.REACT_APP_API_KEY;

function UserProfile() {
  const [users, setUsers] = useState([]);
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify({ apiKey: API_KEY }),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  const handleClick = (id) => {
    fetch(`/api/users/${id}`, {
      method: 'POST',
      body: JSON.stringify({ apiKey: API_KEY })
    });
  };

  return (
    <div>
      <h1>User Profiles</h1>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      <ul>
        {users.map(user => (
          <li key={user.id} onClick={() => handleClick(user.id)}>
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserProfile;
