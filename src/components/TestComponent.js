import React from 'react';
import { useAuth } from '../context/AuthContext';

const TestComponent = () => {
  const { user, isAuthenticated, checkUserExists } = useAuth();

  const handleTest = async () => {
    if (checkUserExists) {
      const exists = await checkUserExists();
      console.log('User exists:', exists);
    }
  };

  return (
    <div style={{ padding: '20px', background: '#f0f0f0', margin: '10px' }}>
      <h3>Test Component</h3>
      <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
      <p>User: {user ? user.nome || user.email : 'None'}</p>
      <button onClick={handleTest}>Test User Validation</button>
    </div>
  );
};

export default TestComponent;