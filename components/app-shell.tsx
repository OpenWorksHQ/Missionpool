"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/logo";

const nav = [
  { href: "/pools", label: "Explore Pools" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/create", label: "Create a Pool" },
  { href: "/#about", label: "About" }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="site-header">
        <div className="site-header-inner">
          <Link className="focus-ring" href="/" aria-label="Mission Pool home">
            <Logo />
          </Link>
          <nav className="desktop-nav">
            {nav.map((item) => (
              <Link key={item.href} className={pathname === item.href ? "text-poolBlue" : "hover:text-poolBlue"} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="desktop-actions">
            <label className="site-search">
              <span className="sr-only">Search pools</span>
              <input placeholder="Search pools..." onKeyDown={(event) => {
                if (event.key === "Enter") {
                  const value = (event.currentTarget as HTMLInputElement).value.trim();
                  window.location.href = value ? `/pools?q=${encodeURIComponent(value)}` : "/pools";
                }
              }} />
              <Search size={18} aria-hidden />
            </label>
            <Link className="site-login focus-ring" href="/login">
              Log in
            </Link>
            <Link className="site-signup focus-ring" href="/signup">
              Sign up
            </Link>
          </div>
          <button className="mobile-menu-button focus-ring" type="button" aria-label="Open menu" onClick={() => setOpen(true)}>
            <Menu size={22} />
          </button>
        </div>
      </header>
      {open ? (
        <div className="fixed inset-0 z-50 bg-white md:hidden">
          <div className="container-shell flex h-[68px] items-center justify-between">
            <Logo />
            <button className="focus-ring rounded-lg border border-line p-2" type="button" aria-label="Close menu" onClick={() => setOpen(false)}>
              <X size={22} />
            </button>
          </div>
          <div className="container-shell grid gap-4 py-6">
            {nav.map((item) => (
              <Link key={item.href} className="rounded-lg border border-line px-4 py-4 font-semibold" href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            <div className="grid grid-cols-2 gap-3 pt-3">
              <Link className="rounded-lg border border-line px-4 py-3 text-center font-semibold" href="/login" onClick={() => setOpen(false)}>
                Log in
              </Link>
              <Link className="rounded-lg bg-navy px-4 py-3 text-center font-semibold text-white" href="/signup" onClick={() => setOpen(false)}>
                Sign up
              </Link>
            </div>
          </div>
        </div>
      ) : null}
      <main>{children}</main>
    </>
  );
}
