import React, { useState } from "react";
import "./style.css";
import Title from "./Title";
import Instructions from "./Instructions";
import FileInput from "./FileInput";
import ProcessButton from "./ProcessButton";
import DownloadButton from "./DownloadButton";
import TimeRemaining from "./TimeRemaining";
import "./App.css";

function processCsv(csv) {
  // simple sample script for testing
  // split the CSV data into lines
  const lines = csv.split("\n");
  // split each line into columns
  const data = lines.map((line) => line.split(","));
  // return the processed data
  return data;
}

// function to convert the processed data to CSV format
function convertToCsv(data) {
  // join the rows with newline characters
  const csv = data.map((row) => row.join(",")).join("\n");
  // return the CSV data
  return csv;
}

function App() {
  // state to store the CSV file selected by the user
  const [file, setFile] = useState(null);
  // state to store the processing time remaining
  const [timeRemaining, setTimeRemaining] = useState(0);
  // state to store the processed data
  const [processedData, setProcessedData] = useState(null);

  //function tom handle the CSV file selected by the user
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  //function to start processing the CSV file
  const handleProcessFile = () => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      //process the CSV file using a script
      const data = processCsv(event.target.result);
      // set the processed data in state
      setProcessedData(data);
      // update the processing time remaining
      setTimeRemaining(5);
    };
    reader.readAsText(file);
  };

  // function to download the processed data s a CSV
  const handleDownload = () => {
    const csv = convertToCsv(processedData);
    // create a Blob object containing the CSV data
    const blob = new Blob([csv], { type: "text/csv" });
    // create a temp URL for the blob obj
    const url = URL.createObjectURL(blob);
    // create a link element to trigger the download
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "processed.csv");
    // simulate a clock on the link to trigger the download
    link.click();
  };

  return (
    <div>
      <Title />
      <Instructions />
      <br />
      <FileInput onFileChange={handleFileChange} />
      <ProcessButton onClick={handleProcessFile} />
      {timeRemaining > 0 && <TimeRemaining time={timeRemaining} />}
      {processedData && (
        <DownloadButton
          onClick={handleDownload}
          processedData={processedData}
        />
      )}
    </div>
  );
}

export default App;
