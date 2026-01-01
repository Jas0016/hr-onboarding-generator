const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateOnboardingDocument(employeeName, role, sections) {
  try {
    const prompt = `
Create a professional HR onboarding document.

Employee Name: ${employeeName}
Role: ${role}

Include these sections:
${sections.join("\n")}

Tone: Professional and welcoming.
`;

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    const output =
      response.output &&
      response.output[0] &&
      response.output[0].content &&
      response.output[0].content[0] &&
      response.output[0].content[0].text;

    if (!output) throw new Error("Empty AI output");

    return output;
  } catch (error) {
    console.error("OpenAI failed, using fallback:", error.message);

    // ✅ Guaranteed fallback (demo-safe)
    return `
Welcome ${employeeName}!

We are pleased to welcome you as a ${role}.

This onboarding document covers:
- Company policies and professional conduct
- Employee benefits and leave structure
- Team introduction and reporting hierarchy

We look forward to your contributions and wish you success in your role.
`;
  }
}

module.exports = { generateOnboardingDocument };
