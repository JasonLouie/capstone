import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Game from "./pages/Game";
import Profile from "./pages/Profile";
import About from "./pages/About";
import AuthRoutes from "./utils/AuthRoutes";
import GuestRoutes from "./utils/GuestRoutes";
import Settings from "./pages/Settings";
import Pokedex from "./pages/Pokedex";
import NoMatch from "./pages/NoMatch";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/play" element={<Game />} />
            <Route path="/about" element={<About />} />
            <Route path="/pokedex" element={<Pokedex />}/>
            <Route element={<GuestRoutes />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
            </Route>
            <Route element={<AuthRoutes />}>
                <Route path="/users/profile" element={<Profile />} />
                <Route path="/users/settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NoMatch />} />
        </Routes>
    );
}