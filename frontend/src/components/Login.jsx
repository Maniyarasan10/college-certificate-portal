import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();
  const { role } = useParams();

  // ✅ By default, students see Register. Admins see Login only.
  const [isRegister, setIsRegister] = useState(role === 'student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (role === 'student' && isRegister) {
        await axios.post('http://localhost:5000/register', { username, password });
        alert('Registered! Now login.');
        setIsRegister(false); // switch to login after registering
      } else {
        const res = await axios.post('http://localhost:5000/login', { username, password });
        if (res.data.role === 'student') navigate('/student');
        else if (res.data.role === 'admin') navigate('/admin');
        else alert('Unknown role.');
      }
    } catch {
      alert('Error! Try again.');
    }
  };

  return (
    <div className="login">
      <h2>{isRegister ? 'Register' : 'Login'} - {role.toUpperCase()}</h2>

      {/* ✅ Only show toggle for students */}
      {role === 'student' && (
        <button onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? 'Switch to Login' : 'Switch to Register'}
        </button>
      )}

      <form onSubmit={handleAuth}>
        <input
          placeholder="Username"
          required
          value={username}
          onChange={e => setUsername(e.target.value)}
        />

        <div className="password-field">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <span onClick={togglePassword}>{showPassword ? '🙈' : '👁️'}</span>
        </div>

        <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
      </form>
    </div>
  );
}
