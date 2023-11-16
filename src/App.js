import React, { useState, useEffect } from "react";
import axios from "axios";
import { Parser } from "json2csv";
import "./style.css";
import Title from "./Title";
import Instructions from "./Instructions";
import FileInput from "./FileInput";
import ProcessButton from "./ProcessButton";
import DownloadButton from "./DownloadButton";
import TimeRemaining from "./TimeRemaining";
import "./App.css";

const API_ENDPOINT = "https://api.chainalysis.com/api/risk/v2/entities/";
const SERVER_ADDRESS = "http://localhost:3001/api/entities/";

function convertToCsv(data) {
  const csv = data.map((row) => row.join(",")).join("\n");
  return csv;
}

function App() {
  // state to store the CSV file selected by the user
  const [file, setFile] = useState(null);
  // state to store the processing time remaining
  const [timeRemaining, setTimeRemaining] = useState(0);
  // state to store the processed data
  const [processedData, setProcessedData] = useState(null);
  // state to store the output CSV file
  const [outputCsv, setOutputCsv] = useState(null);
  // state to store the API key
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  //function tom handle the CSV file selected by the user
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  async function processCsv(csv, apiKey) {
    const lines = csv.split("\n").slice(1); // skip the first line
    setTimeRemaining(lines.length * 2);
    const data = [];
    for (const line of lines) {
      const columns = line.split(",");
      const userId = columns[0]; // the user-id is the first column
      const address = columns[1]; // the address is the second column
      const postResponse = await axios.post(SERVER_ADDRESS, {
        url: API_ENDPOINT,
        data: { address: address },
        headers: { Token: apiKey, "Content-Type": "application/json" },
      });
      const getResponse = await axios.get(`${SERVER_ADDRESS}${address}`, {
        headers: { Token: apiKey, "Content-Type": "application/json" },
      });
      const responseData = { ...getResponse.data, ...postResponse.data };
      // Flatten the JSON object
      const flattenedData = {};
      for (let key in responseData) {
        if (responseData[key] && typeof responseData[key] === "object") {
          if (key === "cluster") {
            flattenedData["cluster.name"] = responseData[key].name;
            flattenedData["cluster.category"] = responseData[key].category;
          } else {
            flattenedData[key] = responseData[key];
          }
        } else {
          flattenedData[key] = responseData[key];
        }
      }
      data.push({ userId, address, ...flattenedData });
      setTimeRemaining((prevTime) => prevTime - 2);
    }
    // TODO: Remove `cluster` phantom category

    // Convert JSON to CSV
    const parser = new Parser();
    const csvData = parser.parse(data);

    // Create a downloadable link for the new CSV file
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "results.csv";
    link.click();
    return data;
  }

  //function to start processing the CSV file
  const handleProcessFile = async () => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const csv = event.target.result;
      const lines = csv.split("\n");
      setTimeRemaining(lines.length * 2);
      const processedData = await processCsv(csv, apiKey);
      const newOutputCsv = convertToCsv(processedData);
      setOutputCsv(newOutputCsv);
      setProcessedData(processedData);
    };
    reader.readAsText(file);
  };

  // function to download the processed data s a CSV
  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([outputCsv], { type: "text/csv" });
    element.href = URL.createObjectURL(file);
    element.download = "results.csv";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div>
      <Title />
      <Instructions />
      <br />
      <label>
        Enter your API Key:
        <input
          type="text"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
      </label>
      <br />
      <FileInput onFileChange={handleFileChange} />
      <ProcessButton onClick={handleProcessFile} />
      <p>Time remaining: {timeRemaining} seconds</p>
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
