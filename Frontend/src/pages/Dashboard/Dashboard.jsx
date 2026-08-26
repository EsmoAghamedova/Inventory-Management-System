import { Import } from "lucide-react";
import "./Dashboard.css";
import PieChart from "../../components/PieChart.jsx";
import StatCard from "../../components/StatCard.jsx";

const Dashboard = () => {
  const user = "Rohan";

  return (
    <>
      <header className="page-head">
        <h2>Welcome, {user}</h2>
        <p>Here's what's happening with your inventory today.</p>
      </header>
      <div className="stat-cards-holder">
        <StatCard></StatCard>
        <StatCard></StatCard>
        <StatCard></StatCard>
        <StatCard></StatCard>
      </div>
    </>
  );
};

export default Dashboard;
