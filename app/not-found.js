"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import "./index.css"; // Ensure this is globally imported in `layout.js` if needed
import { useRouter } from "next/navigation";
const PageNotFound = () => {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push("/");
    }, 3000); // Redirect after 3 seconds
  }, []);
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-800">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-gray-800 tracking-widest">404</h1>
        <div className="bg-extraa-delite-bg text-white px-2 text-sm rounded rotate-12 inline-block">
          Page Not Found
        </div>
        <p className="text-gray-600 mt-4 text-lg font-extrabold">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="px-6 py-2 text-sm font-extrabold text-white bg-extraa-yellow
             rounded hover: transition"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
