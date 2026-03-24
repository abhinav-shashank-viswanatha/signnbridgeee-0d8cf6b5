const BACKEND_URL = "https://signbridge-backend.onrender.com";

export async function translateText(inputText: string, targetLang: string): Promise<string> {
  try {
    const response = await fetch(`${BACKEND_URL}/translate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: inputText,
        target: targetLang
      })
    });

    const data = await response.json();
    return data.translatedText;
  } catch (error) {
    return "Translation failed";
  }
}
