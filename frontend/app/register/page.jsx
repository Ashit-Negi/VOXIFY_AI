"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import Link from "next/link";

import { useAuth } from "@/context/AuthContext";

import API from "@/utils/api";

export default function RegisterPage() {
  const router = useRouter();

  const { isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

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
      const { data } = await API.post("/api/auth/register", formData);

      alert(data.message);

      router.push("/login");
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8">
        <h1 className="text-3xl font-bold text-center mb-2">Create Account</h1>

        <p className="text-zinc-400 text-center mb-8">
          Start using Voxify AI today
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl outline-none focus:border-indigo-500"
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            }
          />

          <input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl outline-none focus:border-indigo-500"
            onChange={(e) =>
              setFormData({
                ...formData,
                email: e.target.value,
              })
            }
          />

          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl outline-none focus:border-indigo-500"
            onChange={(e) =>
              setFormData({
                ...formData,
                password: e.target.value,
              })
            }
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-xl font-medium transition"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-zinc-400 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-500 hover:text-indigo-400">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
