import { useEffect, useState } from "react";

/** Tracks whether the window is scrolled far enough to show the "scroll to top" button. */
export function useScrollTopButton(threshold = 300) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > threshold);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return { visible, scrollToTop };
}
