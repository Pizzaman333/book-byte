import { useEffect } from 'react';
import { Link, useRouteMatch, useLocation } from 'react-router-dom';
import slugify from 'slugify';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBooks, selectBooks } from '../redux/books/booksSlice';
import { addToCart } from '../redux/cart/cartSlice'; 
import PageHeading from '../components/PageHeading/PageHeading';
import styles from './BooksView.module.scss';

const makeSlug = string => slugify(string, { lower: true });

export default function BooksView() {
  const location = useLocation();
  const { url } = useRouteMatch();
  const dispatch = useDispatch();
  const books = useSelector(selectBooks);

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  const handleQuickAdd = (book) => {
    dispatch(addToCart(book));
  };

  return (
    <div className={styles.wrapper}>
      <PageHeading text="Library" />

      {books.length > 0 && (
        <ul className={styles.bookList}>
          {books.map(book => (
            <li key={book.id} className={styles.bookItem}>
              
              <Link
                className={styles.bookLink}
                to={{
                  pathname: `${url}/${makeSlug(`${book.title} ${book.id}`)}`,
                  state: {
                    from: { location, label: 'Back to all books' },
                  },
                }}
              >
                <div className={styles.imageContainer}>
                  <img src={book.imgUrl} alt={book.title} />
                </div>
                
                <div className={styles.cardContent}>
                  <h3 className={styles.title}>{book.title}</h3>
                  <p className={styles.author}>{book.author}</p>
                  <p className={styles.price}>${book.price}</p>
                </div>
              </Link>

              <div className={styles.cardFooter}>
                <button 
                  className={book.inStock ? styles.addBtn : styles.disabledBtn}
                  onClick={() => handleQuickAdd(book)}
                  disabled={!book.inStock}
                >
                  {book.inStock ? '+ Add to Basket' : 'Out of Stock'}
                </button>
              </div>

            </li>
          ))}
        </ul>
      )}
    </div>
  );
}