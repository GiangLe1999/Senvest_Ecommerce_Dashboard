"use client";

// Next Imports
import { redirect, usePathname } from "next/navigation";

// Type Imports
import type { Locale } from "@/configs/i18n";

const AuthRedirect = ({ lang }: { lang: Locale }) => {
  const pathname = usePathname();

  // ℹ️ Bring me `lang`
  console.log(pathname);

  const redirectUrl = `/${lang}/login?redirectTo=${pathname}`;
  const login = `/${lang}/login`;
  const homePage = "/";

  return redirect(
    pathname === login ? login : pathname === homePage ? login : redirectUrl,
  );
};

export default AuthRedirect;
