import React, { useState } from 'react';
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import styles from './Auth.module.css';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const db = getFirestore();

  const checkUsernameUnique = async (username) => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username.toLowerCase()));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
        if (!/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
            throw new Error('Username must be 3-30 characters (letters, numbers, underscores)');
        }

        const isUnique = await checkUsernameUnique(username);
        if (!isUnique) {
            throw new Error('Username is already taken');
        }
        
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        
        await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            username: username.toLowerCase(),
            email: user.email,
            displayName: '',
            photoURL: '/default-avatar.jpg',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        // Update auth profile with basic info
        await updateProfile(user, {
            displayName: username
        });

        navigate('/');
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2 className={styles.authTitle}>Create Account</h2>
        {error && <p className={styles.errorMessage}>{error}</p>}
        
        <form onSubmit={handleSignup} className={styles.authForm}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.formInput}
              required
              minLength="3"
            />
          </div>

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
              minLength="6"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Confirm Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={styles.formInput}
              required
              minLength="6"
            />
          </div>
          
          <button type="submit" className={styles.authButton}>
            Sign Up
          </button>
        </form>
        
        <p className={styles.authText}>
          Already have an account?{' '}
          <a href="/login" className={styles.authLink}>Login here</a>
        </p>
      </div>
    </div>
  );
}

export default Signup;