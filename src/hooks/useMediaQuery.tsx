import { useEffect, useState } from "react";

export function useMediaQuery(query: string) {
  const [isScreenMatch, setIsScreenMatch] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    // Set initial state
    setIsScreenMatch(mediaQuery.matches);

    // Listener for screen changes
    const handleResize = () => setIsScreenMatch(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleResize);

    return () => mediaQuery.removeEventListener("change", handleResize);
  }, [isScreenMatch]);

  return isScreenMatch;
}
