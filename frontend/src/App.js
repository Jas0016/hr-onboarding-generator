import { useState } from "react";

function App() {
  const [employeeName, setEmployeeName] = useState("");
  const [role, setRole] = useState("");
  const [elements, setElements] = useState({
    policies: true,
    benefits: true,
    team: true,
  });
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");

  const generatePreview = async () => {
    setError("");
    setPreview("");

    const selectedElements = [];
    if (elements.policies) selectedElements.push("Company Policies");
    if (elements.benefits) selectedElements.push("Employee Benefits");
    if (elements.team) selectedElements.push("Team Introduction");

    if (!employeeName || !role || selectedElements.length === 0) {
      setError("Please fill all fields and select at least one option.");
      return;
    }

    try {
      const res = await fetch(
        "https://hr-onboarding-generator-2.onrender.com/api/documents/generate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            employeeName,
            role,
            elements: selectedElements,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Generation failed");
      }

      const data = await res.json();
      setPreview(data.previewText);
    } catch (err) {
      setError("Generation failed. Check backend.");
    }
  };

  const downloadPDF = async () => {
    const selectedElements = [];
    if (elements.policies) selectedElements.push("Company Policies");
    if (elements.benefits) selectedElements.push("Employee Benefits");
    if (elements.team) selectedElements.push("Team Introduction");

    const res = await fetch(
      "https://hr-onboarding-generator-2.onrender.com/api/documents/download",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeName,
          role,
          elements: selectedElements,
        }),
      }
    );

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "onboarding.pdf";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>HR Onboarding Document Generator</h1>

      <input
        placeholder="Employee Name"
        value={employeeName}
        onChange={(e) => setEmployeeName(e.target.value)}
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
          checked={elements.policies}
          onChange={() =>
            setElements({ ...elements, policies: !elements.policies })
          }
        />
        Company Policies
      </label>
      <br />

      <label>
        <input
          type="checkbox"
          checked={elements.benefits}
          onChange={() =>
            setElements({ ...elements, benefits: !elements.benefits })
          }
        />
        Employee Benefits
      </label>
      <br />

      <label>
        <input
          type="checkbox"
          checked={elements.team}
          onChange={() =>
            setElements({ ...elements, team: !elements.team })
          }
        />
        Team Introduction
      </label>
      <br /><br />

      <button onClick={generatePreview}>Generate Preview</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {preview && (
        <>
          <h2>Preview</h2>
          <pre>{preview}</pre>
          <button onClick={downloadPDF}>Download PDF</button>
        </>
      )}
    </div>
  );
}

export default App;
