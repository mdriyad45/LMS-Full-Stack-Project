import React, { Fragment, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ProtectedRoute = ({ authenticated, user, element }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authenticated && !location.pathname.includes("/authPage")) {
      navigate("/authPage");
    }

    if (authenticated && location.pathname.includes("/authPage")) {
      navigate("/home");
    }
    if (authenticated && location.pathname.includes("/instructor")) {
      if (user?.role !== "instructor") {
        navigate("/home");
      }
    }

    if (
      authenticated &&
      user?.role === "instructor" &&
      !location.pathname.includes("/instrucotr") &&
      !location.pathname.includes("/home")
    ) {
      navigate("/instructor");
    }
  }, [authenticated, user, location.pathname, navigate]);

  return <Fragment>{element}</Fragment>;
};

export default ProtectedRoute;
