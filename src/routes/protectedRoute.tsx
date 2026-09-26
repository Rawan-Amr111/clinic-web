import { useEffect, useState } from "react";
import { supabase } from "../lib/connect";
import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRoute() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      setIsAuthenticated(!!data.session);
      setLoading(false);
    };

    checkSession();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
