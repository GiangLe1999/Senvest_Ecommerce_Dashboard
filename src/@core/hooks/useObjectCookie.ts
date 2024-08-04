// React Imports
import { useMemo } from "react";

// Third-party Imports
import { useCookie } from "react-use";
import Cookies from "js-cookie";

export const useObjectCookie = <T>(
  key: string,
  fallback?: T | null,
): [T, (newVal: T) => void] => {
  // Hooks
  const [valStr, updateCookie] = useCookie(key);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const value = useMemo<T>(
    () => (valStr ? JSON.parse(valStr) : fallback),
    [valStr],
  );

  const updateValue = (newVal: T) => {
    // Update the cookie with js-cookie to set a long expiration date
    Cookies.set(key, JSON.stringify(newVal), { expires: 365 * 10, path: "/" });

    // Update the state managed by useCookie
    updateCookie(JSON.stringify(newVal));
  };

  return [value, updateValue];
};
