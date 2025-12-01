import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "wasp/client/auth";
import "./App.css";
import { Header } from "./shared/components/Header";
import { DashboardNavbar } from "./shared/components/DashboardNavbar";

export function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: user } = useAuth();
  const isLandingPage = location.pathname === "/";
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup" || 
                     location.pathname === "/request-password-reset" || location.pathname === "/password-reset" ||
                     location.pathname === "/email-verification";
  const isDashboardPage = location.pathname.startsWith("/trips") || location.pathname.startsWith("/join");

  // Handle redirect after authentication
  useEffect(() => {
    if (user && isAuthPage) {
      const searchParams = new URLSearchParams(location.search);
      const redirect = searchParams.get("redirect");
      if (redirect) {
        // Small delay to ensure auth state is fully updated
        setTimeout(() => {
          navigate(redirect);
        }, 100);
      }
    }
  }, [user, isAuthPage, location.search, navigate]);

  return (
    <main className="flex min-h-screen w-full flex-col bg-neutral-50 text-neutral-800">
      {isDashboardPage ? <DashboardNavbar /> : !isLandingPage && !isAuthPage && <Header />}
      <Outlet />
    </main>
  );
}
