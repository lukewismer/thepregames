import React, { useState } from 'react';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import styles from './Auth.module.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2 className={styles.authTitle}>Welcome Back</h2>
        {error && <p className={styles.errorMessage}>Error: Incorrect email or password</p>}
        
        <form onSubmit={handleLogin} className={styles.authForm}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.formInput}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.formInput}
              required
            />
          </div>
          
          <button type="submit" className={styles.authButton}>
            Login
          </button>
        </form>
        
        <p className={styles.authText}>
          Don't have an account?{' '}
          <a href="/signup" className={styles.authLink}>Sign up here</a>
        </p>
      </div>
    </div>
  );
}

export default Login;