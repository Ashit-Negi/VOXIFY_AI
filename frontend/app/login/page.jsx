"use client";

import { useState, useEffect } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

import API from "@/utils/api";

export default function LoginPage() {
  const router = useRouter();

  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await API.post("/api/auth/login", {
        email,
        password,
      });

      await login(data.token);

      router.push("/");
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8">
        <h1 className="text-3xl font-bold text-center mb-2">Welcome Back</h1>

        <p className="text-zinc-400 text-center mb-8">
          Login to continue using Voxify AI
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl outline-none focus:border-indigo-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl outline-none focus:border-indigo-500"
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-xl font-medium transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-zinc-400 mt-6">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-indigo-500 hover:text-indigo-400"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
