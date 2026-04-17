import styles from './PageHeading.module.scss';

export default function PageHeading({ text }) {
  return <div className={styles.headerChunk}><h1 className={styles.title}>{text}</h1></div>;
}