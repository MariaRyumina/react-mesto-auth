import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element: Component, ...props }) => {

    const verify = props.loggedIn ? props.onCheckToken() : false

    return (
        verify ? <Component {...props} /> : <Navigate to="/sign-in" replace />
    )
}

export default ProtectedRoute;