import { Navigate } from 'react-router-dom';

export function PageLayoutRedirect() {
  return <Navigate to="/pages" replace />;
}
