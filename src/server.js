const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
const ENTITIES_ENDPOINT = "https://api.chainalysis.com/api/risk/v2/entities/";

app.post("/api/entities", async (req, res) => {
  const { url, data, headers } = req.body;
  console.log("POST request received:", { url, data, headers });
  try {
    const response = await axios.post(url, data, { headers });
    res.json(response.data);
    console.log("POST request completed successfully: ", data);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
    console.log("POST request unsuccessful:", error);
  }
});

app.get("/api/entities/:address", async (req, res) => {
  const { address } = req.params;
  const headers = req.headers;
  console.log("GET request received:", { address });
  try {
    const response = await axios.get(`${ENTITIES_ENDPOINT}${address}`, {
      headers: {
        Token: headers.token,
        "Content-Type": "application/json",
      },
    });
    res.json(response.data);
    console.log("GET request completed successfully: ", address);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
    console.log(
      "GET request unsuccessful:",
      `${ENTITIES_ENDPOINT}${address}`,
      headers
    );
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Proxy server running on port ${port}`));
