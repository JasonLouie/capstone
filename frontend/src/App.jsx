import { useEffect } from "react";
import AppRoutes from "./AppRoutes";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { getUser } from "./api/userApiCalls";
import { useUserStore } from "./store";

export default function App() {
    const { loginUser, logoutUser } = useUserStore();
    useEffect(() => {
        async function getUserInfo() {
            try {
                const user = await getUser();
                loginUser(user);
            } catch (err) {
                logoutUser();
            }
        }
        // Run this function each time the app loads to verify that the user is logged in.
        getUserInfo();
    }, []);

    return (
        <>
            <Header />
            <AppRoutes />
            <Footer />
        </>
    );
}
