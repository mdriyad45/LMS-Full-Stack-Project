import React, { Fragment, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ProtectedRoute = ({ authenticated, user, element }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // If not logged in and trying to access anything except authPage
    if (!authenticated && !location.pathname.includes("/authPage")) {
      navigate("/authPage");
    }

    if (
      authenticated &&
      user?.role !== "admin" &&
      location.pathname.includes("/admin")
    ) {
      navigate("/home");
    }

    if (
      authenticated &&
      user?.role === "admin" &&
      !location.pathname.includes("/admin")
    ) {
      navigate("/admin");
    }

    if (authenticated && location.pathname.includes("/authPage")) {
      navigate("/home");
    }
  }, [authenticated, user, location.pathname, navigate]);

  return <Fragment>{element}</Fragment>;
};

export default ProtectedRoute;
