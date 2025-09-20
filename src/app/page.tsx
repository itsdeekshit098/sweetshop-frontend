"use client";

import Link from "next/link";
import {  useAuthRedirect } from "@/context/AuthRedirect";

export default function HomePage() {
  useAuthRedirect();
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-indigo-50 text-center p-4">
      <h1 className="text-4xl font-bold mb-4 text-[rgba(66,176,213,1)]">
        Welcome to Sweet Shop Management System
      </h1>
      <p className="text-lg mb-8 text-gray-700">
        By upcoming Incubyte Intern <span className="font-semibold">Deekshith</span>
      </p>
     
      
      <div className="space-x-4">
        <Link
          href="/login"
          className="px-6 py-3 bg-[rgba(66,176,213,1)] text-white font-semibold rounded hover:bg-[rgba(66,176,230,1)] transition"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="px-6 py-3 border border-[rgba(66,176,213,1)] text-[rgba(66,176,213,1)] font-semibold rounded hover:bg-indigo-100 transition"
        >
          Register
        </Link>
      </div>
    </div>
  );
}