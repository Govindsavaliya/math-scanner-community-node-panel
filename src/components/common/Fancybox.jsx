import { useEffect } from "react";
import { Fancybox as NativeFancybox } from "@fancyapps/ui/dist/fancybox.esm.js";
import "@fancyapps/ui/dist/fancybox.css";

/** Binds the lightbox to every `[data-fancybox]` element rendered inside. */
export default function Fancybox({ delegate = "[data-fancybox]", options, children }) {
  useEffect(() => {
    NativeFancybox.bind(delegate, options || {});
    return () => NativeFancybox.destroy();
  }, [delegate, options]);

  return <>{children}</>;
}
