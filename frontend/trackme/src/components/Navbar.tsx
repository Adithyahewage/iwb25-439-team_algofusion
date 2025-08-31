"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="w-full border-b border-neutral-200/40 glass sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl text-slate-900 hover:text-blue-600 transition-colors">
          TrackMe
        </Link>
        <div className="flex items-center gap-8">
          <Link href="/track" className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">
            Track Package
          </Link>
          <Link href="#features" className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">
            Features
          </Link>
          <Link href="#insights" className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">
            Insights
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Register
          </Link>
        </div>
      </nav>
    </header>
  );
}


