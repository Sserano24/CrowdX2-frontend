"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";

export function NavBar() {
  const pathname = usePathname();
  const isActive = (href) => href === pathname;

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`flex items-center justify-between px-6 py-4 sticky top-0 z-50 transition-all duration-300
        ${scrolled
          ? "bg-white/90 shadow-xl dark:bg-black/80 backdrop-blur border-b border-gray-200 dark:border-gray-700"
          : "bg-transparent"}
      `}
    >
      {/* Logo */}
      <Link
        href="/"
        className="text-2xl font-bold text-blue-600 hover:opacity-80 transition"
      >
        CrowdX
      </Link>

      {/* Desktop Nav Links */}
      <div className="hidden md:flex gap-6 text-sm font-medium">
        <Link
          href="/dashboard"
          className={`hover:text-blue-600 transition ${isActive("/dashboard") ? "text-blue-600" : ""}`}
        >
          Dashboard
        </Link>
        <Link
          href="/login"
          className={`hover:text-blue-600 transition ${isActive("/login") ? "text-blue-600" : ""}`}
        >
          Login
        </Link>
        <Link
          href="/about"
          className={`hover:text-blue-600 transition ${isActive("/about") ? "text-blue-600" : ""}`}
        >
          About
        </Link>
      </div>

      {/* Mobile Menu Icon */}
      <div className="md:hidden">
        <Menu className="w-6 h-6" />
      </div>
    </nav>
  );
}
