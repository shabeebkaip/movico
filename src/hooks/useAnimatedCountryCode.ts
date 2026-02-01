import { useState, useEffect } from "react";

export const gccCountryCodes = ["+971", "+966", "+965", "+973", "+968", "+974"];

export function useAnimatedCountryCode(interval: number = 2000) {
  const [currentCodeIndex, setCurrentCodeIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentCodeIndex((prev) => (prev + 1) % gccCountryCodes.length);
    }, interval);
    return () => clearInterval(timer);
  }, [interval]);

  return gccCountryCodes[currentCodeIndex];
}
