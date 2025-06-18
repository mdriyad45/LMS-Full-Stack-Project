import { Route, Routes } from "react-router-dom";
import "./App.css";
import AuthPage from "./pages/AuthPage/AuthPage";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { useContext } from "react";
import { authContext } from "./context/auth-context/authContext";
import NotFoundPage from "./pages/not_found/NotFoundPage";
import InstructorDashBoardPage from "./pages/instructor/InstructorDashBoardPage";
import StudentHomePage from "./pages/student/StudentHomePage";
import AddNewCoursePage from "./components/instructor_view/AddNewCourse/AddNewCoursePage";

function App() {
  const { auth } = useContext(authContext);
  return (
    <Routes>
      <Route
        path="/authPage"
        element={
          <ProtectedRoute
            authenticated={auth.authenticate}
            user={auth.user}
            element={<AuthPage />}
          />
        }
      />

      <Route
        path="/instructor"
        element={
          <ProtectedRoute
            authenticated={auth.authenticate}
            user={auth.user}
            element={<InstructorDashBoardPage />}
          />
        }
      />

      <Route
        path="/instructor/create-new-course"
        element={
          <ProtectedRoute
            authenticated={auth.authenticate}
            user={auth.user}
            element={<AddNewCoursePage />}
          />
        }
      />

      <Route path="" element={<StudentHomePage />} />
      <Route path="/home" element={<StudentHomePage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
