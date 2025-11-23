import { useEffect } from "react";
import AppRoutes from "./AppRoutes";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { useUserStore } from "./stores/userStore";
import { usePokemonStore } from "./stores/pokemonStore";

export default function App() {
    const { checkAuth, authenticated } = useUserStore(state => state);
    const { pokemonObject, initpokemonObject } = usePokemonStore(state => state);
    useEffect(() => {
        if (!pokemonObject) initpokemonObject();
        if (authenticated) checkAuth();
    }, [authenticated]);

    return (
        <>
            <Header />
            <AppRoutes />
            <Footer />
        </>
    );
}
