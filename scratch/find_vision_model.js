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

async function findWorkingVisionModel() {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  // List of candidate vision models on Groq
  const candidateModels = [
    "meta-llama/llama-3.2-11b-vision-instruct",
    "llama-3.2-11b-vision-preview",
    "llama-3.2-90b-vision-preview",
    "meta-llama/llama-3.2-90b-vision-instruct",
    "groq/llama-3.2-11b-vision-preview"
  ];

  for (const model of candidateModels) {
    try {
      const res = await groq.chat.completions.create({
        model,
        messages: [{ role: "user", content: "Hi" }]
      });
      console.log(`FOUND WORKING GROQ MODEL: ${model}`);
      return model;
    } catch (e) {
      console.log(`Model ${model}: ${e.message}`);
    }
  }
}

findWorkingVisionModel();
