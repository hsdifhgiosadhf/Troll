import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/giaodien.css";
import { App } from "@/App";

const nutGoc = document.getElementById("root");
if (nutGoc) {
  createRoot(nutGoc).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
