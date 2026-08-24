import { Outlet } from "react-router-dom";
import NavBarDashboard from "./NavBarDashboard.jsx";
import SideBar from "./SideBar.jsx";
import "./components.css";

const Display = () => {
  return (
    <>
      <NavBarDashboard />
      <section className="Display-and-SideBar-Wrapper">
        <SideBar />
        <main className="Display Outlet Main">
          <Outlet />
        </main>
      </section>
    </>
  );
};

export default Display;
