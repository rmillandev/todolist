import { Navigate, Outlet } from "react-router-dom"
import { useAuthContext } from "../context/authContext"
import { LOGIN } from "./paths"

export const PrivateRoute = () => {
    const {isAuthenticated} = useAuthContext()

    if(!isAuthenticated) return <Navigate to={LOGIN} />

    return (
       <Outlet />
    )
}
