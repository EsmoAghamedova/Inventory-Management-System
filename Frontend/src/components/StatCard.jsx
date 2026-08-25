import React from "react";

const StatCard = (props) => {
  return (
    <div className="stat-card">
      <span className="stat-head">{props.heading}</span>
      <span className="amount">{props.amount}</span>
      <span className="condition growth">+4% from last week</span>
    </div>
  );
};

export default StatCard;
