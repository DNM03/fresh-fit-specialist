import OverlayLoading from "@/components/overlay-loading/overlay-loading";
import { apiAxios, authService } from "@/services";
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
  redirectPath?: string;
}

const ProtectedRoute = ({
  children,
  redirectPath = "/login",
}: ProtectedRouteProps) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthenticated = authService.isAuthenticated();

        if (!isAuthenticated) {
          setIsAuthorized(false);
          return;
        }

        try {
          const response = await apiAxios.get("/users/me");
          if (response.status === 200) {
            setIsAuthorized(true);
          } else {
            setIsAuthorized(false);
          }
        } catch (error) {
          console.error("Token validation failed:", error);
          setIsAuthorized(false);

          authService.logout();
        }
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();

    const tokenExpirationHandler = () => {
      setIsAuthorized(false);
      navigate(redirectPath);
    };

    window.addEventListener("auth:tokenExpired", tokenExpirationHandler);

    return () => {
      window.removeEventListener("auth:tokenExpired", tokenExpirationHandler);
    };
  }, [navigate, redirectPath]);

  if (isChecking) {
    return <OverlayLoading />;
  }

  if (!isAuthorized) {
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
