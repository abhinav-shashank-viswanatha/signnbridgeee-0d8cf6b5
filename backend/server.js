const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/translate", async (req, res) => {
  const { text, target } = req.body;

  try {
    const response = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        q: text,
        source: "auto",
        target: target,
        format: "text"
      })
    });

    const data = await response.json();

    res.json({ translatedText: data.translatedText });

  } catch (error) {
    res.json({ translatedText: "Translation failed" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
