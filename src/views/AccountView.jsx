import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PageHeading from '../components/PageHeading/PageHeading';
import {
  logoutUser,
  selectCurrentUser,
  selectIsAuthLoading,
} from '../redux/auth/authSlice';
import styles from './AuthView.module.scss';

export default function AccountView() {
  const dispatch = useDispatch();
  const history = useHistory();
  const currentUser = useSelector(selectCurrentUser);
  const isLoading = useSelector(selectIsAuthLoading);
  const initial = currentUser?.name?.trim()?.charAt(0)?.toUpperCase() || '?';

  const handleLogout = async () => {
    const result = await dispatch(logoutUser());

    if (logoutUser.fulfilled.match(result)) {
      history.replace('/login');
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.accountCard}>
        <div className={styles.accountTop}>
          <div className={styles.avatar}>{initial}</div>
          <div>
            <p className={styles.eyebrow}>Current user</p>
            <PageHeading text={currentUser?.name || 'Your account'} />
          </div>
        </div>

        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <span>Name</span>
            <strong>{currentUser?.name || 'Not available'}</strong>
          </div>
          <div className={styles.infoCard}>
            <span>Email</span>
            <strong>{currentUser?.email || 'Not available'}</strong>
          </div>
          {currentUser?.subscription && (
            <div className={styles.infoCard}>
              <span>Subscription</span>
              <strong>{currentUser.subscription}</strong>
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.submitButton}
            onClick={handleLogout}
            disabled={isLoading}
          >
            {isLoading ? 'Signing out...' : 'Log out'}
          </button>
        </div>
      </div>
    </div>
  );
}
