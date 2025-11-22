import { Outlet, Navigate } from "react-router";
import { useUserStore } from "../stores/userStore";

export default function AuthRoutes() {
    const {authenticated} = useUserStore.getState();
    return authenticated ? <Outlet /> : <Navigate to="login"/>;
}