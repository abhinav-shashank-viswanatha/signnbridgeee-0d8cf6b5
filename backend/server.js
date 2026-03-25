const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/translate", async (req, res) => {
  const { text, target } = req.body;

  try {
    // 🔹 Try LibreTranslate first
    try {
      const response = await axios.post(
        "https://libretranslate.com/translate",
        {
          q: text,
          source: "auto",
          target: target,
          format: "text"
        }
      );

      return res.json({ translatedText: response.data.translatedText });
    } catch (err) {
      console.log("LibreTranslate failed, trying fallback...");
    }

    // 🔹 Fallback: MyMemory API
    const fallback = await axios.get(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${target}`
    );

    return res.json({
      translatedText: fallback.data.responseData.translatedText
    });

  } catch (error) {
    console.error(error.message);
    res.json({ translatedText: "Translation failed" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
