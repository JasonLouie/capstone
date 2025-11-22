import { useEffect } from "react";
import AppRoutes from "./AppRoutes";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { useUserStore } from "./stores/userStore";


export default function App() {
    const { checkAuth, authenticated } = useUserStore(state => state);
    useEffect(() => {
        if (authenticated) {
            checkAuth();
        }
    }, [authenticated]);

    return (
        <>
            <Header />
            <AppRoutes />
            <Footer />
        </>
    );
}
