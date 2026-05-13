import React from "react";

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center border-t-4 border-indigo-500 hover:shadow-lg transition-shadow">
      <div className="mb-4 text-6xl">{icon}</div>
      <p className="text-gray-400 text-sm uppercase tracking-wide mb-2">
        {title}
      </p>
      <p className="text-5xl font-bold text-indigo-600">{value}</p>
    </div>
  );
};

export default StatCard;
