import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from 'sonner';
import App from "./App.tsx";
import "./index.css";

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <StrictMode>
       <BrowserRouter>
         <App />
         <Toaster zIndex={40} />
       </BrowserRouter>
    </StrictMode>
  );
}
