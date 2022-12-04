import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import liff from "@line/liff";
import { App } from "./App";
import { isMocked } from "./mock";

const main = async () => {
  try {
    await liff.init({
      liffId: import.meta.env.VITE_LIFF_ID,
      mock: isMocked,
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
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
};

main();
