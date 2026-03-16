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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [UsernameError, setUsernameError] = useState<string | null>(null);

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if(password.length < 10) errors.push('Password must be at least 10 characters long');
    if(password.length > 24) errors.push('Passwords must be at most 24 characters long');
    if(/\s/.test(password)) errors.push('Password cannot contain spaces');
    if(!/[0-9]/.test(password)) errors.push('Password must contain at least one number');
    if(!/[A-Z]/.test(password)) errors.push('Password must contain at least one uppercase letter');
    if(!/[a-z]/.test(password)) errors.push('Password must contain at least one lowercase letter');

    return errors;
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null); {/* resets error on every submission */}

    {/* blocks if username is empty*/}
    if(!username.trim()){
      setUsernameError('Username is required');
      return;
    }

    {/* block if password has errors or is empty */}
    if(passwordErrors.length > 0 || password === ''){
      return;
    }
    setUsernameError(null);

    const errors = validatePassword(password);
    if(errors.length > 0){
      setPasswordErrors(errors);
      return;
    }
      setPasswordErrors([]); {/* clears errors if all good*/}

    fetch(`${BASE_URL}/challenge-signup`, {
      method: 'POST',
      headers: { 
        'Content-Type' : 'application/json', 
        'Authorization' : `Bearer ${AUTH_TOKEN}`
      },
      body: JSON.stringify({username, password})
    })
      .then(res => {
        if(res.status === 200){
          setUserWasCreated(true);
        }else if(res.status === 401 || res.status ===403){
          setErrorMessage('Not authenticated to access this resource.');
        }else if(res.status === 422){
          setErrorMessage('Sorry, the entered password is not allowed, please try a different one.');
        }else{
          setErrorMessage('Something went wrong, please try again.');
        }
      })
      .catch(() => {
        {/* only runs on network failure */}
        setErrorMessage('Something went wrong, please try again.');
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
          onChange={e => {
            setUsername(e.target.value);
            if(e.target.value.trim()) setUsernameError(null); {/* clears when user types */}
          }}
        />
        {UsernameError && <p style={errorStyle}>{UsernameError}</p>}
        
        <label style={formLabel} htmlFor="password">Password</label>
        <input 
          style={formInput} 
          id="password"
          name="password"
          value={password}
          onChange={e => {
            const value = e.target.value
            setPassword(value)
            setPasswordErrors(validatePassword(value)); {/* Runs every time you add a value, on every keystroke*/}
          }}
        />
        {passwordErrors.length > 0 && (
          <ul style={validationList}>
            {passwordErrors.map(error => (
              <li key={error} style={errorStyle}>{error}</li>
            ))}
          </ul>
        )}

        {errorMessage && <p style={apiErrorStyle}>{errorMessage}</p>}
        <button style={formButton} type="submit">Create User</button>
      </form>
    </div>
  );
}

{/* The api errors only comes after the username and password are set successfully, the user tries to create user. If the something is wrong from the api end, then the api errors are dispalayed. Otherwise the code checks that the username and password is correct before being posted to the api to fetch data.*/}
{/*The form does not make an API request when there is no username or when password is invalid */}
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

const errorStyle: CSSProperties = {
  color: 'red',
  fontSize: '14px',
};

const validationList: CSSProperties = {
  margin: '4px 0',
  paddingLeft: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px'
};

const apiErrorStyle: CSSProperties = {
  color: '#cc0000',
  fontSize: '13px',
  backgroundColor: '#fff0f0',
  border: '1px solid #f5c2c2',
  borderRadius: '4px',
  padding: '8px 12px',
};