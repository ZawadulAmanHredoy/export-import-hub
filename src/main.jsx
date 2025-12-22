import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import "./styles.css";
import { AuthProvider } from "./providers/AuthProvider.jsx";
import { ThemeProvider } from "./providers/ThemeProvider.jsx";

const qc = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={qc}>
        <BrowserRouter>
          <AuthProvider>
            <ThemeProvider>
              <App />
              <Toaster position="top-right" />
            </ThemeProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
);
