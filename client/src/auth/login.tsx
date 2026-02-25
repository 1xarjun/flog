import { queryClient } from "@/query/client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const mutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const response = await fetch(
        `http://localhost:3000/users?email=${email}&password=${password}`,
      );
      const result = await response.json();

      if (result.length === 0) {
        throw new Error("Invalid credentials");
      }

      return result[0];
    },

    onSuccess: (user) => {
      console.log("login succeeds", user);
      localStorage.setItem("user", JSON.stringify(user));
      queryClient.setQueryData(["user"], user);
    },
  });

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    mutation.mutate({ email, password });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>

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
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Login
        </button>
      </form>

      <p className=" text-gray-500 text-center">
        Don&apos;t have an account?{" "}
        <Link
          to="/auth/register"
          className="text-gray-800 hover:underline underline-offset-4"
        >
          Register
        </Link>
      </p>
    </>
  );
}
