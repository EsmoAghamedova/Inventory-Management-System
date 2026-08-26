import React from "react";
import { useState } from "react";

const StatCard = () => {
  const [cardData, setCardData] = useState({
    title: "Last Month",
    amount: 999,
    disc: "+10% from last month",
    icon: "object",
  });

  return (
    <div className="stat-card">
      <span className="stat-title">{cardData.title}</span>
      <span className="stat-amount">{cardData.amount}</span>
      <span className="growth">{cardData.disc}</span>
    </div>
  );
};

export default StatCard;
