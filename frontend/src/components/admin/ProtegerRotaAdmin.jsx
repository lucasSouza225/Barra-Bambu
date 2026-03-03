import { Navigate } from 'react-router-dom';

const ProtegerRotaAdmin = ({ children, user }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtegerRotaAdmin;