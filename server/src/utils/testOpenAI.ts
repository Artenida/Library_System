import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

async function testOpenAI() {
  try {
    const response = await openai.responses.create({
      model: "gpt-5-nano",
      input: "write a haiku about AI",
    });

    return response.output_text;
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    return "Error calling OpenAI";
  }
}

export default testOpenAI;
