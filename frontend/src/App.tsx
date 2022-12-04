import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Index } from "./pages/Index";
import { css } from "@emotion/react";

export const App = () => {
  const style = css({
    fontFamily: "Avenir, Helvetica, Arial, sans-serif",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
    textAlign: "center",
    color: "#2c3e50",
    marginTop: "60px",
  });

  return (
    <div css={style}>
      <Routes>
        <Route path="/*" element={<Index />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  );
};
