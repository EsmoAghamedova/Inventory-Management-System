import { Grid2X2, Plus, ShoppingCart } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import "./components.css";

const SideBar = () => {
  return (
    <aside className="side-bar">
      <nav>
        <NavLink to="/dashboard" className="side-bar-link">
          <Grid2X2 size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/add-stock" className="side-bar-link">
          <Plus size={20} />
          <span>Add Stock</span>
        </NavLink>

        <NavLink to="/sales" className="side-bar-link">
          <ShoppingCart size={20} />
          <span>Sales</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default SideBar;
