import { Navigate, Outlet } from "react-router-dom"
import { useAuthContext } from "../context/authContext"
import { TODOLIST } from "./paths"

export const PublicRoute = () => {
    const {isAuthenticated} = useAuthContext()

    if(isAuthenticated) return <Navigate to={TODOLIST} />

    return (
       <Outlet />
    )
}
