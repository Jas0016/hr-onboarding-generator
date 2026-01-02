import { useState } from "react";

function App() {
  const [employeeName, setEmployeeName] = useState("");
  const [role, setRole] = useState("");
  const [elements, setElements] = useState([]);
  const [preview, setPreview] = useState("");

  const toggleElement = (el) => {
    setElements(prev =>
      prev.includes(el)
        ? prev.filter(e => e !== el)
        : [...prev, el]
    );
  };

  const generatePreview = async () => {
    if (!employeeName || !role || elements.length === 0) {
      alert("Fill all fields");
      return;
    }

    setPreview(`
Welcome ${employeeName}!

We are pleased to welcome you as a ${role}.

${elements.join("\n")}

We look forward to your contributions.
    `);
  };

  const downloadPDF = async () => {
    const res = await fetch(
      "https://hr-onboarding-generator-2.onrender.com/api/documents/generate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeName,
          role,
          elements
        })
      }
    );

    if (!res.ok) {
      alert("Generation failed");
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "onboarding.pdf";
    a.click();
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>HR Onboarding Document Generator</h1>

      <input
        placeholder="Employee Name"
        value={employeeName}
        onChange={e => setEmployeeName(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Role"
        value={role}
        onChange={e => setRole(e.target.value)}
      />
      <br /><br />

      <h3>Select Onboarding Elements</h3>
      <label>
        <input type="checkbox" onChange={() => toggleElement("Company Policies")} />
        Company Policies
      </label><br />
      <label>
        <input type="checkbox" onChange={() => toggleElement("Employee Benefits")} />
        Employee Benefits
      </label><br />
      <label>
        <input type="checkbox" onChange={() => toggleElement("Team Introduction")} />
        Team Introduction
      </label><br /><br />

      <button onClick={generatePreview}>Generate Preview</button>

      {preview && (
        <>
          <h3>Preview</h3>
          <pre>{preview}</pre>
          <button onClick={downloadPDF}>Download PDF</button>
        </>
      )}
    </div>
  );
}

export default App;
