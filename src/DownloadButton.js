import React from "react";

// DownloadButton component
export default function DownloadButton(props) {
  return (
    <button onClick={() => props.onClick(props.processedData)}>
      Download Results
    </button>
  );
}
