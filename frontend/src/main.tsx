import React from "react";
import { createRoot } from "react-dom/client";
import liff from "@line/liff";
import { LiffMockPlugin } from "@line/liff-mock";
import App from "./App";

liff.use(new LiffMockPlugin());

const container = document.getElementById("root")!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
