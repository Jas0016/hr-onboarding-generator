const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateOnboardingDocument(employeeName, role, sections) {
  const prompt = `
You are an HR assistant.

Create a professional onboarding document.

Employee Name: ${employeeName}
Role: ${role}

Include the following sections:
${sections.join("\n")}

Tone: Professional and welcoming.
`;

  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: prompt,
  });

  // ✅ SAFE extraction (this is the key fix)
  const output =
    response.output &&
    response.output[0] &&
    response.output[0].content &&
    response.output[0].content[0] &&
    response.output[0].content[0].text;

  if (!output) {
    throw new Error("OpenAI returned empty output");
  }

  return output;
}

module.exports = { generateOnboardingDocument };
