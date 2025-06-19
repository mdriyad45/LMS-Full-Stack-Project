import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import AuthPorvider from "./context/auth-context/authContext";
import InstructorProvider from "./context/instructor-context/InstructorProvider";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthPorvider>
      <InstructorProvider>
        <App />
      </InstructorProvider>
    </AuthPorvider>
  </BrowserRouter>
);
