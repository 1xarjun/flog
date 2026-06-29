import { useState } from "react";
import { Link } from "react-router";
import { queryClient } from "@/query/client";
import API from "@/api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!res.ok) throw new Error("Request failed!");

      const result = await res.json();
      if (result?.data) {
        queryClient.setQueryData(["user"], result.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
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
          to="/auth/login"
          className="text-gray-800 hover:underline underline-offset-4"
        >
          Login
        </Link>
      </p>
    </>
  );
}
