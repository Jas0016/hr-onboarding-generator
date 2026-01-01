const OpenAI = require("openai");
const Template = require("../models/Template");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateOnboardingDocument(employeeName, role, sections) {
  // 1️⃣ Fetch selected templates from MongoDB
  const templates = await Template.find({
    name: { $in: sections },
  });

  const combinedClauses = templates
    .map((t) => `- ${t.content}`)
    .join("\n");

  // 2️⃣ Try OpenAI
  try {
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `
You are an HR assistant.

Create a professional onboarding document.

Employee Name: ${employeeName}
Role: ${role}

Use the following clauses:
${combinedClauses}

Tone: Professional and welcoming.
`,
    });

    const output =
      response.output &&
      response.output[0] &&
      response.output[0].content &&
      response.output[0].content[0] &&
      response.output[0].content[0].text;

    if (!output) throw new Error("Empty AI response");

    return output;
  } catch (err) {
    console.error("OpenAI failed, using fallback");

    // 3️⃣ Fallback (still valid for demo)
    return `
Welcome ${employeeName}!

We are pleased to welcome you as a ${role}.

${combinedClauses}

We look forward to your contributions and wish you success in your role.
`;
  }
}

module.exports = { generateOnboardingDocument };
