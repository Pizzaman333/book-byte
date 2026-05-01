import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  selectIsAuthenticated,
  selectIsAuthRefreshing,
} from '../../redux/auth/authSlice';

export default function PrivateRoute({ children, ...routeProps }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isRefreshing = useSelector(selectIsAuthRefreshing);

  return (
    <Route
      {...routeProps}
      render={({ location }) => {
        if (isRefreshing) {
          return null;
        }

        return isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        );
      }}
    />
  );
}
