import { useState } from "react";

function App() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [elements, setElements] = useState([]);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleElement = (key) => {
    setElements((prev) =>
      prev.includes(key)
        ? prev.filter((e) => e !== key)
        : [...prev, key]
    );
  };

  const generateDocument = async () => {
    try {
      setLoading(true);
      setPreview("");

      const response = await fetch(
        "https://hr-onboarding-generator-2.onrender.com/api/documents/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name,
            role,
            elements
          })
        }
      );

      if (!response.ok) {
        const err = await response.json();
        console.error("Backend error:", err);
        throw new Error("Generation failed");
      }

      const data = await response.json();
      setPreview(data.content);
    } catch (err) {
      alert("Generation failed. Check inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>HR Onboarding Document Generator</h1>

      <input
        placeholder="Employee Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />
      <br /><br />

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

      <br /><br />

      <button onClick={generateDocument} disabled={loading}>
        {loading ? "Generating..." : "Generate"}
      </button>

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
