import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const container = document.getElementById("root")!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
