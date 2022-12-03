import React from "react";
import "./style.css";

export default function Title() {
  return (
    <div>
      <h1 className="big-title">Batch Address Screening UI</h1>
      <p className="paragraph-text">
        Welcome to the UI for the Address Screening script.
      </p>
      <p className="paragraph-text">
        Here, you can upload a CSV file of addresses
      </p>
    </div>
  );
}
