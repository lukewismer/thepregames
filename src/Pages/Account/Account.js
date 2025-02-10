import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase';
import { 
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import styles from './Account.module.css';

function Account() {
  const [user, setUser] = useState(null);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        navigate('/login');
      } else {
        setUser(currentUser);
      }
    });
    return unsubscribe;
  }, [navigate]);

  const handleReauth = async () => {
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    try {
      await reauthenticateWithCredential(user, credential);
      return true;
    } catch (err) {
      setError('Incorrect password. Please try again.');
      return false;
    }
  };

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    if (await handleReauth()) {
      try {
        await updateEmail(user, newEmail);
        setSuccess('Email updated successfully!');
        setNewEmail('');
      } catch (err) {
        setError(err.message);
      }
    }
    setLoading(false);
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    if (await handleReauth()) {
      try {
        await updatePassword(user, newPassword);
        setSuccess('Password updated successfully!');
        setNewPassword('');
      } catch (err) {
        setError(err.message);
      }
    }
    setLoading(false);
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This cannot be undone!')) {
      setLoading(true);
      if (await handleReauth()) {
        try {
          await deleteUser(user);
          navigate('/');
        } catch (err) {
          setError(err.message);
        }
      }
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2 className={styles.authTitle}>Account Settings</h2>
        
        {/* Account Info */}
        <div className={styles.accountInfo}>
          <h3>Profile Information</h3>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Account Created:</strong> {new Date(user.metadata.creationTime).toLocaleDateString()}</p>
        </div>

        {error && <p className={styles.errorMessage}>{error}</p>}
        {success && <p className={styles.successMessage}>{success}</p>}

        {/* Update Email Form */}
        <form onSubmit={handleUpdateEmail} className={styles.authForm}>
          <h3>Change Email</h3>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>New Email:</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className={styles.formInput}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Current Password:</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={styles.formInput}
              required
            />
          </div>
          <button 
            type="submit" 
            className={styles.authButton}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Email'}
          </button>
        </form>

        {/* Update Password Form */}
        <form onSubmit={handleUpdatePassword} className={styles.authForm}>
          <h3>Change Password</h3>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={styles.formInput}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Current Password:</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={styles.formInput}
              required
            />
          </div>
          <button 
            type="submit" 
            className={styles.authButton}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>

        {/* Danger Zone */}
        <div className={styles.dangerZone}>
          <h3>Danger Zone</h3>
          <button 
            onClick={handleDeleteAccount}
            className={styles.dangerButton}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete Account'}
          </button>
          <p className={styles.warningText}>
            Warning: This will permanently delete your account and all associated data!
          </p>
        </div>
      </div>
    </div>
  );
}

export default Account;