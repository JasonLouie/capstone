import { Outlet, Route, Routes } from "react-router";
import { about, terms, privacy } from "./utils/text";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Game from "./pages/Game";
import Profile from "./pages/Profile";
import AuthRoutes from "./utils/AuthRoutes";
import GuestRoutes from "./utils/GuestRoutes";
import Settings from "./pages/Settings";
import Pokedex from "./pages/Pokedex";
import NoMatch from "./pages/NoMatch";
import Info from "./pages/Info";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/play" element={<Game />} />
            <Route path="/about" element={<Info title="About PokéGuesser" text={about}/>} />
            <Route path="/terms" element={<Info title="Terms of Use" text={terms}/>}/>
            <Route path="/privacy" element={<Info title="Privacy Policy" text={privacy}/>}/>
            <Route path="/pokedex" element={<Pokedex />}/>
            <Route element={<GuestRoutes />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
            </Route>
            <Route element={<AuthRoutes />}>
                <Route path="/users" element={<Outlet />}>
                    <Route path="profile" element={<Profile />} />
                    <Route path="settings" element={<Settings />} />
                </Route>
            </Route>
            <Route path="*" element={<NoMatch />} />
        </Routes>
    );
}