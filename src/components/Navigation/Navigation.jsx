import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCartItemCount } from '../../redux/cart/cartSelectors';
import styles from './Navigation.module.scss';

export default function Navigation() {
  const totalItems = useSelector(selectCartItemCount);

  return (
    <nav className={styles.nav}>
      <NavLink exact to="/" className={styles.link} activeClassName={styles.activeLink}>Home</NavLink>
      <NavLink to="/books" className={styles.link} activeClassName={styles.activeLink}>Books</NavLink>
      
      <NavLink to="/basket" className={styles.link} activeClassName={styles.activeLink}>
        Basket {totalItems > 0 && <span style={{ background: '#3498db', color: 'white', borderRadius: '10px', padding: '2px 8px', fontSize: '0.8rem', marginLeft: '5px' }}>{totalItems}</span>}
      </NavLink>
    </nav>
  );
}
