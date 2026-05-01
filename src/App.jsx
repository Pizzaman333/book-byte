import { lazy, Suspense, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AppBar from "./components/AppBar/AppBar";
import PrivateRoute from "./components/AuthRoute/PrivateRoute";
import PublicOnlyRoute from "./components/AuthRoute/PublicOnlyRoute";
import Container from "./components/Container/Container";
import {
  refreshCurrentUser,
  selectIsAuthRefreshing,
} from "./redux/auth/authSlice";
import { fetchCart } from './redux/cart/cartSlice';
import styles from './App.module.scss';

const BasketView = lazy(() => import("./views/BasketView.jsx"));
const LoginView = lazy(() => import("./views/LoginView.jsx"));
const SignupView = lazy(() => import("./views/SignupView.jsx"));
const AccountView = lazy(() => import("./views/AccountView.jsx"));

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
  const isRefreshing = useSelector(selectIsAuthRefreshing);

  useEffect(() => {
    dispatch(fetchCart());
    dispatch(refreshCurrentUser());
  }, [dispatch]);

  if (isRefreshing) {
    return (
      <>
        <div className={styles.animatedBg}></div>
        <Container>
          <AppBar />
          <div className={styles.sessionLoader}>Restoring your session...</div>
        </Container>
      </>
    );
  }

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

          <PublicOnlyRoute path="/login" exact>
            <LoginView />
          </PublicOnlyRoute>

          <PublicOnlyRoute path="/signup" exact>
            <SignupView />
          </PublicOnlyRoute>

          <PrivateRoute path="/account" exact>
            <AccountView />
          </PrivateRoute>

          <Route>
            <NotFoundView />
          </Route>
        </Switch>
      </Suspense>
    </Container>
    </>
  );
}
