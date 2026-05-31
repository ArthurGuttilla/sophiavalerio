import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

import Landing from "./components/Landing.jsx";
import Home from "./components/Home.jsx";
import Experience from "./components/Experience.jsx";
import "./index.css";
import "./components.css";
import "./scenes.css";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/data/:id" element={<Experience />} />
        <Route path="*" element={<Landing />} />
      </Routes>
    </AnimatePresence>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <AnimatedRoutes />
    </HashRouter>
  </React.StrictMode>
);
