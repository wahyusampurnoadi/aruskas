const fs = require("fs");
const path = require("path");
const Groq = require("groq-sdk");

const envPath = path.join(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  envContent.split("\n").forEach((line) => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  });
}

async function listGroqModels() {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  try {
    const list = await groq.models.list();
    console.log("GROQ MODELS LIST:");
    list.data.forEach((m) => console.log("- ", m.id));
  } catch (e) {
    console.error("Error listing Groq models:", e.message);
  }
}

listGroqModels();
