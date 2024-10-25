"use client";
import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className="relative bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow-lg">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center p-6 md:p-8 transition-transform duration-500 ease-in-out transform hover:scale-105">
        <a href="#" className="text-3xl font-extrabold tracking-wide mb-4 md:mb-0 transition-opacity duration-300 hover:opacity-80">
          True Feedback
        </a>
        {session ? (
          <div className="flex items-center space-x-6 animate-slide-in">
            <span className="text-lg font-medium italic tracking-wide">
              Welcome, {user.username || user.email}
            </span>
            <Button
              onClick={() => signOut()}
              className="w-full md:w-auto bg-white text-gray-800 px-6 py-3 rounded-full shadow-md transition-transform duration-300 transform hover:scale-105 hover:shadow-lg"
              variant="outline"
            >
              Logout
            </Button>
          </div>
        ) : (
          <Link href="/sign-in">
            <Button
              className="w-full md:w-auto bg-white text-gray-800 px-6 py-3 rounded-full shadow-md transition-transform duration-300 transform hover:scale-105 hover:shadow-lg"
              variant="outline"
            >
              Login
            </Button>
          </Link>
        )}
      </div>
      {/* Add animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 opacity-30 blur-lg animate-pulse rounded-full absolute top-1/4 left-1/3 w-48 h-48 md:w-64 md:h-64"></div>
        <div className="bg-gradient-to-r from-yellow-400 to-red-500 opacity-40 blur-xl animate-ping rounded-full absolute bottom-1/4 right-1/4 w-32 h-32 md:w-48 md:h-48"></div>
      </div>
    </nav>
  );
};

export default Navbar;
