import { Route, Routes } from "react-router";
import Home from "./pages/Home";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />}></Route>
        </Routes>
    );
}