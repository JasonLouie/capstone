import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useUserStore } from "./store";
import Game from "./pages/Game";
import Profile from "./pages/Profile";

export default function AppRoutes() {
    const loggedIn = useUserStore(state => state.loggedIn);

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game/play" element={<Game />}/>
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