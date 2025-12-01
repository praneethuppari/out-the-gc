import { Outlet, useLocation } from "react-router-dom";
import "./App.css";
import { Header } from "./shared/components/Header";

export function App() {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup" || 
                     location.pathname === "/request-password-reset" || location.pathname === "/password-reset" ||
                     location.pathname === "/email-verification";

  return (
    <main className="flex min-h-screen w-full flex-col bg-neutral-50 text-neutral-800">
      {!isLandingPage && !isAuthPage && <Header />}
      <Outlet />
    </main>
  );
}
