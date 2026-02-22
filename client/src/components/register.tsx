import { useState } from "react";
import { Link } from "react-router";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    console.log({ username, email, password });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="space-y-4 bg-white shadow-md w-full max-w-sm text-gray-800 p-6 rounded text-sm">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>

          <label className="block mb-4">
            <span className="font-medium">Username</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="username"
              required
            />
          </label>

          <label className="block mb-4">
            <span className="font-medium">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="block mb-6">
            <span className="font-medium">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="********"
              required
            />
          </label>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors"
          >
            Register
          </button>
        </form>

        <p className=" text-gray-500 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-gray-800 hover:underline underline-offset-4"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
