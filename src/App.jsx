import { lazy, Suspense, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import AppBar from "./components/AppBar/AppBar";
import Container from "./components/Container/Container";
import { fetchCart } from './redux/cart/cartSlice';
import styles from './App.module.scss';

const BasketView = lazy(() => import("./views/BasketView.jsx"));

const HomeView = lazy(() =>
  import("./views/HomeView.jsx" /* webpackChunkName: "home-view" */),
);
const BooksView = lazy(() =>
  import("./views/BooksView.jsx" /* webpackChunkName: "books-view" */),
);
const BookDetailsView = lazy(() =>
  import("./views/BookDetailsView.jsx" /* webpackChunkName: "book-view" */),
);
const NotFoundView = lazy(() =>
  import("./views/NotFoundView.jsx" /* webpackChunkName: "404-view" */),
);

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  return (
    <>
      <div className={styles.animatedBg}></div>
    
     <Container>

      <AppBar />

      <Suspense fallback={<h2>LOADING ROUTE...</h2>}>
        <Switch>
          <Route path="/" exact>
            <HomeView />
          </Route>

          <Route path="/books" exact>
            <BooksView />
          </Route>

          <Route path="/books/:slug">
            <BookDetailsView />
          </Route>

          <Route path="/basket" exact>
            <BasketView />
          </Route>

          <Route>
            <NotFoundView />
          </Route>
        </Switch>
      </Suspense>
    </Container>
    </>
  );
}
