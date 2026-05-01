import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiUser } from 'react-icons/fi';
import {
  selectCurrentUser,
  selectIsAuthenticated,
} from '../../redux/auth/authSlice';
import { selectCartItemCount } from '../../redux/cart/cartSelectors';
import styles from './Navigation.module.scss';

export default function Navigation() {
  const totalItems = useSelector(selectCartItemCount);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser);
  const accountPath = isAuthenticated ? '/account' : '/login';
  const userInitial = currentUser?.name?.trim()?.charAt(0)?.toUpperCase();

  return (
    <div className={styles.navShell}>
      <nav className={styles.nav}>
        <NavLink exact to="/" className={styles.link} activeClassName={styles.activeLink}>Home</NavLink>
        <NavLink to="/books" className={styles.link} activeClassName={styles.activeLink}>Books</NavLink>
        
        <NavLink to="/basket" className={styles.link} activeClassName={styles.activeLink}>
          Basket {totalItems > 0 && <span className={styles.badge}>{totalItems}</span>}
        </NavLink>
      </nav>

      <NavLink
        to={accountPath}
        className={styles.accountLink}
        activeClassName={styles.accountLinkActive}
        aria-label={isAuthenticated ? 'Go to your account' : 'Go to login'}
      >
        <span className={styles.accountIcon}>
          {userInitial || <FiUser aria-hidden="true" />}
        </span>
        <span className={styles.accountText}>
          {isAuthenticated ? (currentUser?.name || 'Account') : 'Sign in'}
        </span>
      </NavLink>
    </div>
  );
}
