import { Outlet } from "react-router";
import { Navigate } from "react-router";

export default function AuthLayout() {
  const user = null;

  if (user) <Navigate to="/" />;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="space-y-4 bg-white shadow-md w-full max-w-sm text-gray-800 p-6 rounded text-sm">
        <Outlet />
      </div>
    </div>
  );
}
