"use client";

import { useState } from "react";

import Link from "next/link";

import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard,
  History,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

export default function Sidebar() {
  const pathname = usePathname();

  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);

  const { isAuthenticated, logout, user } = useAuth();

  const menuItems = isAuthenticated
    ? [
        {
          name: "Dashboard",
          href: "/",
          icon: LayoutDashboard,
        },
        {
          name: "History",
          href: "/history",
          icon: History,
        },
      ]
    : [
        {
          name: "Dashboard",
          href: "/",
          icon: LayoutDashboard,
        },
        {
          name: "Login",
          href: "/login",
          icon: LogIn,
        },
        {
          name: "Register",
          href: "/register",
          icon: UserPlus,
        },
      ];

  const handleLogout = () => {
    logout();

    router.push("/login");

    setMobileOpen(false);
  };

  return (
    <>
      {/* MOBILE HEADER */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-zinc-950 border-b border-zinc-800 px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-indigo-500">Voxify AI</h1>

        <button onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* MOBILE SIDEBAR */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/70">
          <aside className="w-[260px] h-full bg-zinc-950 border-r border-zinc-800 p-6 pt-20 flex flex-col">
            {isAuthenticated && user && (
              <div className="mb-8 pb-6 border-b border-zinc-800 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center text-xl font-bold mb-3">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>

                <h3 className="font-semibold text-white">{user?.name}</h3>

                <p className="text-sm text-zinc-500">{user?.email}</p>
              </div>
            )}

            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                      pathname === item.href
                        ? "bg-indigo-600 text-white"
                        : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="mt-auto flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-zinc-900 transition"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            )}
          </aside>
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside className="w-[250px] bg-zinc-950 border-r border-zinc-800 p-6 hidden md:flex flex-col">
        <div>
          <h1 className="text-3xl font-bold mb-10 text-indigo-500">
            Voxify AI
          </h1>

          {isAuthenticated && user && (
            <div className="mb-8 p-4 bg-zinc-900 rounded-2xl border border-zinc-800">
              <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-lg font-bold mb-3">
                {user?.name?.charAt(0).toUpperCase()}
              </div>

              <h3 className="font-semibold text-white">{user?.name}</h3>

              <p className="text-sm text-zinc-500 truncate">{user?.email}</p>
            </div>
          )}

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    pathname === item.href
                      ? "bg-indigo-600 text-white"
                      : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="mt-auto flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-zinc-900 transition"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        )}
      </aside>
    </>
  );
}
