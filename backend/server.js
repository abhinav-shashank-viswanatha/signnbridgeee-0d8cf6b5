const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/translate", async (req, res) => {
  const { text, target } = req.body;

  try {
    const response = await axios.post(
      "https://libretranslate.de/translate",
      {
        q: text,
        source: "auto",
        target: target,
        format: "text"
      }
    );

    res.json({ translatedText: response.data.translatedText });

  } catch (error) {
    console.error(error.message);
    res.json({ translatedText: "Translation failed" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
