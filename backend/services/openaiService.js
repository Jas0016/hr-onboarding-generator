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

  return response.output_text;
}

module.exports = { generateOnboardingDocument };
