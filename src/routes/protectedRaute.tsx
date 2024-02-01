

import { Outlet, Navigate} from "react-router-dom";
import { useAuth } from "../Autentication/AutProvider";
import React from "react";

export default function ProtectedRoute(){
    const auth = useAuth()
    return auth.esAutentico ? <Outlet/> : <Navigate to="/" />
}