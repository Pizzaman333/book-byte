import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PageHeading from '../components/PageHeading/PageHeading';
import {
  registerUser,
  selectAuthError,
  selectIsAuthLoading,
} from '../redux/auth/authSlice';
import styles from './AuthView.module.scss';

export default function SignupView() {
  const dispatch = useDispatch();
  const history = useHistory();
  const isLoading = useSelector(selectIsAuthLoading);
  const authError = useSelector(selectAuthError);
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [formError, setFormError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormValues((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formValues.name.trim() || !formValues.email.trim() || !formValues.password.trim()) {
      setFormError('Complete name, email, and password to create your account.');
      return;
    }

    if (formValues.password.trim().length < 7) {
      setFormError('Use a password with at least 7 characters.');
      return;
    }

    setFormError('');

    const result = await dispatch(registerUser(formValues));

    if (registerUser.fulfilled.match(result)) {
      history.replace('/account');
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.intro}>
          <PageHeading text="Create account" />
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span>Name</span>
            <input
              type="text"
              name="name"
              autoComplete="name"
              value={formValues.name}
              onChange={handleChange}
            />
          </label>

          <label className={styles.field}>
            <span>Email</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              value={formValues.email}
              onChange={handleChange}
            />
          </label>

          <label className={styles.field}>
            <span>Password</span>
            <input
              type="password"
              name="password"
              autoComplete="new-password"
              value={formValues.password}
              onChange={handleChange}
            />
          </label>


          {(formError || authError) && (
            <p className={styles.errorMessage}>{formError || authError}</p>
          )}

          <div className={styles.actions}>
            <button type="submit" className={styles.submitButton} disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create account'}
            </button>
            <Link to="/login" className={styles.secondaryButton}>Already have an account</Link>
          </div>
        </form>

        <p className={styles.switchText}>
          Already registered? <Link to="/login">Sign in instead</Link>
        </p>
      </div>
    </div>
  );
}
