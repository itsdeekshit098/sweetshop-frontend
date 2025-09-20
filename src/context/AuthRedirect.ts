"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isLoggedIn } from "../utils/auth";

export const useAuthRedirect = () => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {

    if (isLoggedIn()) {
      // If user is logged in, redirect away from home page
      if (pathname === "/") {
        router.push("/sweets/components/SweetList");
      }
      if (pathname === "/login" || pathname === "/register") {
        router.push("/sweets/components/SweetList");
      }
    } else {
      // If user not logged in, protect SweetList page
      if (pathname?.startsWith("/sweets")) {
        router.push("/");
      }
    }
  }, [router, pathname]);
};
