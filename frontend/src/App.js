import { useState } from "react";

function App() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [elements, setElements] = useState([]);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleElement = (key) => {
    setElements((prev) =>
      prev.includes(key)
        ? prev.filter((e) => e !== key)
        : [...prev, key]
    );
  };

  const generateDocument = async () => {
    setError("");
    setPreview("");
    setLoading(true);

    try {
      const res = await fetch(
        "https://hr-onboarding-generator-2.onrender.com/api/documents/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            employeeName: name,
            role: role,
            elements: elements,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Generation failed");
      }

      // PDF download
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${name}_onboarding.pdf`;
      a.click();

      // Preview text (simple frontend preview)
      setPreview(
        `Welcome ${name}!\n\nWe are pleased to welcome you as a ${role}.\n\nWe look forward to your contributions.`
      );
    } catch (err) {
      setError("Generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "serif" }}>
      <h1>HR Onboarding Document Generator</h1>

      <input
        placeholder="Employee Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br />
      <br />

      <input
        placeholder="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />
      <br />
      <br />

      <h3>Select Onboarding Elements</h3>

      <label>
        <input
          type="checkbox"
          onChange={() => toggleElement("company_policies")}
        />
        Company Policies
      </label>
      <br />

      <label>
        <input
          type="checkbox"
          onChange={() => toggleElement("employee_benefits")}
        />
        Employee Benefits
      </label>
      <br />

      <label>
        <input
          type="checkbox"
          onChange={() => toggleElement("team_introduction")}
        />
        Team Introduction
      </label>
      <br />
      <br />

      <button onClick={generateDocument} disabled={loading}>
        {loading ? "Generating..." : "Generate & Download PDF"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {preview && (
        <>
          <hr />
          <h2>Preview</h2>
          <pre>{preview}</pre>
        </>
      )}
    </div>
  );
}

export default App;
