import { createRoot } from "react-dom/client";
import "@fontsource-variable/inter";
import "react-toastify/dist/ReactToastify.css";
import "@/styles/index.css";
import App from "@/app/App";

createRoot(document.getElementById("root")).render(<App />);
