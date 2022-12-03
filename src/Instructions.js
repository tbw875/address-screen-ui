import React from "react";
import "./style.css";

export default function Title() {
  return (
    <div className="instructions-box">
      <h3>Instructions:</h3>
      <ul>
        <li>Make sure your CSV file has addresses in a single column</li>
        <li>
          Make sure the header of the column is{" "}
          <span className="paragraph-text">`address`</span>
        </li>
        <li>Click "Choose File" to upload the file to the system</li>
        <li>
          Click "Process." Wait for the API calls to take place. (This may take
          some time)
        </li>
        <li>Once complete, click "Download Results"</li>
      </ul>
    </div>
  );
}
