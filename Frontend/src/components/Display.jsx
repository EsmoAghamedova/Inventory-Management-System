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
        <main className="Display " style={{ padding: "1.3rem" }}>
          <Outlet />
        </main>
      </section>
    </>
  );
};

export default Display;
