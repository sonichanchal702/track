import { useSelector } from "react-redux";
import React from "react";

const Overview = () => {
  const agency = useSelector((s) => s.agency);

  return (
    <>
      <div className="p-10 grid grid-cols-4 gap-6">
        <div className="card">Clients</div>
        <div className="card">Projects</div>
      </div>
    </>
  );
};

export default Overview;
