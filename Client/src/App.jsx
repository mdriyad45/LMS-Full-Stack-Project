import { Route, Routes } from "react-router-dom";
import "./App.css";
import AuthPage from "./pages/authPage/authPage";



function App() {
  return (
    <Routes>
      <Route path="/authPage" element={<AuthPage/>}/>

    </Routes>
  );
}

export default App;
