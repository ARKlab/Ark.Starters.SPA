import Cookies from "js-cookie";
import { useState, useCallback } from "react";

export default function useCookie<T>(
  name: string,
  defaultValue: T | undefined,
): [T | undefined, { updateCookie: (value: T, options: Cookies.CookieAttributes) => void; deleteCookie: () => void }] {
  const cookies = Cookies.withConverter<T>({
    read: (value, n) => JSON.parse(Cookies.converter.read(value, n)) as T,

    write: (value, n) => Cookies.converter.write(JSON.stringify(value), n),
  });

  const [value, setValue] = useState<T | undefined>(() => {
    const cookie = cookies.get(name);
    if (typeof cookie == "string") return defaultValue;
    if (cookie) return cookie;
    return defaultValue;
  });

  const updateCookie = useCallback(
    (newValue: T, options: Cookies.CookieAttributes) => {
      cookies.set(name, newValue, options);
      setValue(newValue);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [name, setValue],
  );

  const deleteCookie = useCallback(() => {
    cookies.remove(name);
    setValue(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, setValue]);

  return [value, { updateCookie, deleteCookie }];
}
