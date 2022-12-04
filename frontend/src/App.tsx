import { css } from "@emotion/react";
import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Index } from "./pages/Index";

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
