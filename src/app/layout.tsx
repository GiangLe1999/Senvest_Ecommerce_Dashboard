// Third-party Imports
import "react-perfect-scrollbar/dist/css/styles.css";

// Type Imports
import type { ChildrenType } from "@core/types";

// Style Imports
import "@/app/globals.css";

// Generated Icon CSS Imports
import "@assets/iconify-icons/generated-icons.css";

export const metadata = {
  title: "Materialize - Material Next.js Admin Template",
  description: "Materialize - Material Next.js Admin Template",
};

const RootLayout = ({ children }: ChildrenType) => {
  return (
    <html id="__next" lang="en" dir="ltr">
      <body className="flex is-full min-bs-full flex-auto flex-col">
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
