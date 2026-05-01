import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../../redux/auth/authSlice';

export default function PublicOnlyRoute({ children, ...routeProps }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <Route
      {...routeProps}
      render={() => (isAuthenticated ? <Redirect to="/account" /> : children)}
    />
  );
}
