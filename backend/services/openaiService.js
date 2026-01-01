const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateOnboardingDocument(employeeName, role, sections) {
  const prompt = `
You are an HR assistant.

Create a professional onboarding document.

Employee Name: ${employeeName}
Role: ${role}

Include these sections:
${sections.join("\n")}

Tone: Professional and welcoming.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content;
}

module.exports = { generateOnboardingDocument };
