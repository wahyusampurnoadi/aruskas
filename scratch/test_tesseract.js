const Tesseract = require("tesseract.js");

async function testTesseract() {
  console.log("Testing Tesseract worker creation...");
  try {
    const worker = await Tesseract.createWorker("ind+eng");
    console.log("Tesseract worker created successfully!");
    await worker.terminate();
  } catch (err) {
    console.error("Tesseract Error:", err);
  }
}

testTesseract();
