// Copyright (c) 2026 Andy Yates. All rights reserved.
import React from "react";
import ReactDOM from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import App from "./App";
import { initializeAnalytics } from "./analytics";
import "./styles.css";

registerSW({ immediate: true });
initializeAnalytics();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
