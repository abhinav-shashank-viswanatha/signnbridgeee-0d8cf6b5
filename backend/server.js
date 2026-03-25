const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/translate", async (req, res) => {
  const { text, target } = req.body;

  console.log("Incoming request:", text, target);

  try {
    // ✅ Try MyMemory API (more reliable)
    const response = await axios.get(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${target}`
    );

    console.log("API Response:", response.data);

    const translated = response.data?.responseData?.translatedText;

    if (translated) {
      return res.json({ translatedText: translated });
    } else {
      return res.json({ translatedText: "No translation found" });
    }

  } catch (error) {
    console.error("ERROR:", error.message);
    return res.json({ translatedText: "Translation failed" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
