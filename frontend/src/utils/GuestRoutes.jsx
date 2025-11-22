import { Outlet, Navigate } from "react-router";
import { useUserStore } from "../stores/userStore";

export default function GuestRoutes() {
    const {authenticated} = useUserStore.getState();
    return !authenticated ? <Outlet /> : <Navigate to="/users/profile"/>;
}