import { useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PageHeading from '../components/PageHeading/PageHeading';
import {
  loginUser,
  selectAuthError,
  selectIsAuthLoading,
} from '../redux/auth/authSlice';
import styles from './AuthView.module.scss';

export default function LoginView() {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const isLoading = useSelector(selectIsAuthLoading);
  const authError = useSelector(selectAuthError);
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
  });
  const [formError, setFormError] = useState('');

  const redirectTo = location.state?.from?.pathname || '/account';

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormValues((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formValues.email.trim() || !formValues.password.trim()) {
      setFormError('Enter both your email and password.');
      return;
    }

    setFormError('');

    const result = await dispatch(loginUser(formValues));

    if (loginUser.fulfilled.match(result)) {
      history.replace(redirectTo);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.intro}>
          <PageHeading text="Sign in" />
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
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
              autoComplete="current-password"
              value={formValues.password}
              onChange={handleChange}
            />
          </label>

          {(formError || authError) && (
            <p className={styles.errorMessage}>{formError || authError}</p>
          )}

          <div className={styles.actions}>
            <button type="submit" className={styles.submitButton} disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
            <Link to="/signup" className={styles.secondaryButton}>Create account</Link>
          </div>
        </form>

        <p className={styles.switchText}>
          New here? <Link to="/signup">Create your account</Link>
        </p>
      </div>
    </div>
  );
}
