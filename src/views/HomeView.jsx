import PageHeading from '../components/PageHeading/PageHeading';
import styles from './HomeView.module.scss';

export default function HomeView() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.contentChunk}>
        <PageHeading text="Welcome to the Bookstore" />
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex vel velit
          nihil illo est! Quos cum rerum dolores voluptates odio iste est nam
          excepturi placeat eligendi voluptatibus a illo eos ipsam.
        </p>
      </div>
    </div>
  );
}