// src/app/MetadataHeader.tsx
"use client";

import Header from "./components/Header";
import Footer from "./components/Footer";
import { usePathname } from "next/navigation";

export default function MetadataHeader() {
  const pathname = usePathname();
  const hideHeaderFooter = pathname === "/";

  return (
    <>
      {!hideHeaderFooter && <Header />}
      {!hideHeaderFooter && <Footer />}
    </>
  );
}
