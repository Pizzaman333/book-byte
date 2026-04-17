import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cart/cartSlice'; 
import PageHeading from '../components/PageHeading/PageHeading';
import * as bookShelfAPI from '../services/bookshelf-api';
import styles from './BookDetailsView.module.scss';

export default function BookDetailsView() {
  const location = useLocation();
  const { slug } = useParams();
  const bookId = slug.match(/[a-z0-9]+$/)[0];
  const [book, setBook] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    bookShelfAPI.fetchBookById(bookId).then(setBook);
  }, [bookId]);

  const handleAddToCart = () => {
    dispatch(addToCart(book));
  };

  return (
    <div className={styles.wrapper}>
      {book && (
        <>
          {/* Top Controls: Back Button & Title */}
          <div className={styles.topControls}>
            <Link className={styles.backLink} to={location?.state?.from?.location ?? '/books'}>
              &larr; {location?.state?.from?.label ?? 'Back'}
            </Link>
            
              <PageHeading text={book.title} />
          </div>

          {/* Main Content Card */}
          <div className={styles.contentChunk}>
            <div className={styles.detailsContainer}>
              <img className={styles.image} src={book.imgUrl} alt={book.title} />
              
              <div className={styles.info}>
                <p><strong>Author:</strong> {book.author}</p>
                <p><strong>Genre:</strong> {book.genre}</p>
                <p className={styles.price}>${book.price}</p>
                
                <span className={book.inStock ? styles.inStock : styles.outOfStock}>
                  {book.inStock ? 'In Stock' : 'Out of Stock'}
                </span>

                <p className={styles.description}>{book.description}</p>

                <button 
                  className={book.inStock ? styles.addBtn : styles.disabledBtn}
                  onClick={handleAddToCart}
                  disabled={!book.inStock}
                >
                  {book.inStock ? '+ Add to Basket' : 'Out of Stock'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}