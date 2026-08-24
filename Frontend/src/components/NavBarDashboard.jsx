import { Bell } from "lucide-react";
import "./components.css";

const NavBarDashboard = () => {
  const profileLink =
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  return (
    <nav className="nav-bar-dashboard">
      <h2>Stock Count</h2>
      <ul className="nav-right">
        <Bell style={{ height: "100%" }} />

        <div
          style={{
            backgroundImage: `url(${profileLink})`,
            backgroundSize: "contain",
          }}
          className="nav-bar-dashboard-pfp pfp"
        ></div>
      </ul>
    </nav>
  );
};

export default NavBarDashboard;
