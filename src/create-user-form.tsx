import type { CSSProperties, Dispatch, SetStateAction } from 'react';
import { useState } from 'react';

interface CreateUserFormProps {
  setUserWasCreated: Dispatch<SetStateAction<boolean>>;
}

const BASE_URL = 'https://api.challenge.hennge.com/password-validation-challenge-api/001';
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsib2NoaWVuZ3NoZWlsYTE3NUBnbWFpbC5jb20iXSwiaXNzIjoiaGVubmdlLWFkbWlzc2lvbi1jaGFsbGVuZ2UiLCJzdWIiOiJjaGFsbGVuZ2UifQ.3W2nkN7VnVrkgZF_pweFBbEixCochabxSccauDPrMxs';

function CreateUserForm({ setUserWasCreated}: CreateUserFormProps) {
  const [username, setUsername] = useState('');
  const [password , setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    fetch(`${BASE_URL}/challenge-signup`, {
      method: 'POST',
      headers: { 
        'Content-Type' : 'application/json', 
        'Authorization' : `Bearer ${AUTH_TOKEN}`
      },
      body: JSON.stringify({username, password})
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setUserWasCreated(true);
      })
      .catch(error => {
        console.log('Error:', error)
      });
  }

  return (
    <div style={formWrapper}>
      <form style={form} onSubmit={handleSubmit}>
        {/* make sure the username and password are submitted */}
        {/* make sure the inputs have the accessible names of their labels */}
        <label style={formLabel} htmlFor="username">Username</label>
        <input 
          style={formInput}
          id="username" 
          name="username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />

        <label style={formLabel} htmlFor="password">Password</label>
        <input 
          style={formInput} 
          id="password"
          name="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button style={formButton} type="submit">Create User</button>
      </form>
    </div>
  );
}

export { CreateUserForm };

const formWrapper: CSSProperties = {
  maxWidth: '500px',
  width: '80%',
  backgroundColor: '#efeef5',
  padding: '24px',
  borderRadius: '8px',
};

const form: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const formLabel: CSSProperties = {
  fontWeight: 700,
};

const formInput: CSSProperties = {
  outline: 'none',
  padding: '8px 16px',
  height: '40px',
  fontSize: '14px',
  backgroundColor: '#f8f7fa',
  border: '1px solid rgba(0, 0, 0, 0.12)',
  borderRadius: '4px',
};

const formButton: CSSProperties = {
  outline: 'none',
  borderRadius: '4px',
  border: '1px solid rgba(0, 0, 0, 0.12)',
  backgroundColor: '#7135d2',
  color: 'white',
  fontSize: '16px',
  fontWeight: 500,
  height: '40px',
  padding: '0 8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '8px',
  alignSelf: 'flex-end',
  cursor: 'pointer',
};
