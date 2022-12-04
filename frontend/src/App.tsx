import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Index } from "./pages/Index";
import "./App.css";

export const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/*" element={<Index />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  );
};
