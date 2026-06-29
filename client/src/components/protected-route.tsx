import useUser from "@/query/user";
import { Navigate } from "react-router";
import { Outlet } from "react-router";

export default function ProtectedRoute() {
  const { data: user, isLoading, error } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center">
        Loding...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center">
        Error: {error.message}
      </div>
    );
  }

  if (!user) return <Navigate to="/auth/login" replace />;

  return <Outlet />;
}
