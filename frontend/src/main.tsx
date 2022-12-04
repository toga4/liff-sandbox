import React from "react";
import { createRoot } from "react-dom/client";
import liff from "@line/liff";
import { LiffMockPlugin } from "@line/liff-mock";
import App from "./App";

liff.use(new LiffMockPlugin());

const main = async () => {
  try {
    await liff.init({
      liffId: import.meta.env.VITE_LIFF_ID,
      mock: import.meta.env.VITE_LIFF_MOCK === "true",
    });
  } catch (e) {
    alert(`LIFF error: ${e}`);
    return;
  }

  const container = document.getElementById("root");
  if (!container) {
    throw new Error("root element not found");
  }
  createRoot(container).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

main();
