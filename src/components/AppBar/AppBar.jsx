import Navigation from '../Navigation/Navigation';
import styles from './Appbar.module.scss';

export default function Appbar() {
  return (
    <header className={styles.header}>
      <Navigation />
    </header>
  );
}
