"use client";


import Link from "next/link";
import { Sparkles, ArrowRight, User, LayoutDashboard, FolderOpen, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";


export function LoggedOutNavbar() {
  const pathname = usePathname();
  const isActive = (href) => href === pathname;

  return (
    <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <div className="size-8 grid place-items-center rounded-xl bg-primary/10">
            <Sparkles className="w-4 h-4" />
          </div>
          <Link href="/" className="font-bold tracking-tight">
            CrowdX
          </Link>
        </div>
        {/* Center: Nav Links */}
        <nav className="flex-1 flex justify-center">
          <div className="flex gap-6 text-sm">
            <Link href="/#features" className={`hover:text-primary ${isActive("/dashboard") ? "text-primary font-bold" : ""}`}>Features</Link>
            <Link href="/explore" className={`hover:text-primary ${isActive("/dashboard") ? "text-primary font-bold" : ""}`}>Projects</Link>
            <Link href="/#recruiters" className={`hover:text-primary ${isActive("/dashboard") ? "text-primary font-bold" : ""}`}>Recruiters</Link>
            <Link href="/#faq" className={`hover:text-primary ${isActive("/dashboard") ? "text-primary font-bold" : ""}`}>FAQ</Link>
          </div>
        </nav>
        {/* Right: Buttons */}
        <div className="flex items-center gap-2">
        <Button variant="ghost" asChild>
          <Link href="/login">Sign In</Link>
        </Button>

        <Button className="gap-1" asChild>
          <Link href="/dashboard">
            Launch Project <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
        </div>
      </div>
    </header>
  );
}


export function LoggedInNavbar() {
  const pathname = usePathname();
  const isActive = (href) => href === pathname;

  return (
    <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <div className="size-8 grid place-items-center rounded-xl bg-primary/10">
            <Sparkles className="w-4 h-4" />
          </div>
          <Link href="/" className="font-bold tracking-tight">
            CrowdX
          </Link>
        </div>

        {/* Center: Nav Links */}
        <nav className="flex-1 flex justify-center">
          <div className="flex gap-6 text-sm">
            <Link
              href="/explore"
              className={`hover:text-primary ${isActive("/explore") ? "text-primary font-bold" : ""}`}
            >
              <Compass className="inline w-4 h-4 mr-1" /> Explore
            </Link>
            
            <Link
              href="/dashboard"
              className={`hover:text-primary ${isActive("/dashboard") ? "text-primary font-bold" : ""}`}
            >
              <LayoutDashboard className="inline w-4 h-4 mr-1" /> Dashboard
            </Link>
            <Link
              href="/account"
              className={`hover:text-primary ${isActive("/account") ? "text-primary font-bold" : ""}`}
            >
              <User className="inline w-4 h-4 mr-1" /> Account
            </Link>
          </div>
        </nav>

        {/* Right: Quick Action */}
        <div className="flex items-center gap-2">
          <Button className="gap-1" asChild>
            <Link href="/campaigns/new">
              Launch Project <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}