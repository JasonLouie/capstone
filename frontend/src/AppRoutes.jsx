import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
// import { useUserStore } from "./store";
import Game from "./pages/Game";
import Profile from "./pages/Profile";
import About from "./pages/About";

export default function AppRoutes() {
    // const loggedIn = useUserStore(state => state.tokens);
    const loggedIn = false;

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/play" element={<Game />}/>
            <Route path="/about" element={<About />} />
            {!loggedIn ? 
                <>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                </> : 
                <>
                    <Route path="/users/profile" element={<Profile />} />
                </>
            }
        </Routes>
    );
}