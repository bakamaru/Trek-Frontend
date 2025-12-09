import React from "react";
import GridShape from "../../components/common/GridShape";
import { Link } from "react-router";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex">
      {/* Left Side: Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 relative bg-white dark:bg-gray-900 z-10 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-50" />
        </div>

        <div className="relative z-10 max-w-sm w-full mx-auto lg:mx-0 lg:w-96">
          <Link to="/" className="block mb-8">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-400 text-white font-bold text-xl shadow-lg shadow-blue-500/20">
                Y
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">Yang One</span>
            </div>
          </Link>
          {children}
        </div>
        <div className="fixed bottom-6 left-6 z-50">
          <ThemeTogglerTwo />
        </div>
      </div>

      {/* Right Side: Hero Image */}
      <div className="hidden lg:block relative w-0 flex-1 hero-bg bg-cover bg-center">
        <div className="absolute inset-0 bg-blue-900/40 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
          <blockquote className="space-y-2">
            <p className="text-lg font-medium">
              "The journey of a thousand miles begins with a single step."
            </p>
            <footer className="text-sm font-light text-white/80">
              &mdash; Lao Tzu
            </footer>
          </blockquote>
        </div>

        {/* Optional: Overlay grid shape if desired for branding */}
        <div className="absolute top-0 right-0 p-12 opacity-20">
          <GridShape />
        </div>
      </div>
    </div>
  );
}
