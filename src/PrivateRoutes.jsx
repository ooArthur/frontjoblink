import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from './Context/UserContext';
import { toast } from 'sonner';
import Loading from './ui/components/Loading/Loading';

const PrivateRoute = ({ element: Element, allowedRoles }) => {
  const { user, loading } = useUser();
  const [notified, setNotified] = useState(false);

  useEffect(() => {
    if (user && !allowedRoles.includes(user.role) && !notified) {
      toast.error(`Acesso negado para sua conta!`);
      setNotified(true);
    }
  }, [user, allowedRoles, notified]);

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return <Element />;
};

export default PrivateRoute;