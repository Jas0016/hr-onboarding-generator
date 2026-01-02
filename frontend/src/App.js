import { useState } from "react";

const BACKEND = "https://hr-onboarding-generator-2.onrender.com";

function App() {
  const [employeeName, setEmployeeName] = useState("");
  const [role, setRole] = useState("");
  const [elements, setElements] = useState([]);
  const [preview, setPreview] = useState("");
  const [docId, setDocId] = useState("");

  const toggle = (key) => {
    setElements((prev) =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const generatePreview = async () => {
    const res = await fetch(`${BACKEND}/api/documents/preview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employeeName, role, elements }),
    });
    const data = await res.json();
    setPreview(data.content);
    setDocId(data.documentId);
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>HR Onboarding Document Generator</h1>

      <input placeholder="Employee Name" onChange={e => setEmployeeName(e.target.value)} />
      <br /><br />
      <input placeholder="Role" onChange={e => setRole(e.target.value)} />
      <br /><br />

      <h3>Select Onboarding Elements</h3>
      <label><input type="checkbox" onChange={() => toggle("company_policies")} /> Company Policies</label><br />
      <label><input type="checkbox" onChange={() => toggle("employee_benefits")} /> Employee Benefits</label><br />
      <label><input type="checkbox" onChange={() => toggle("team_introduction")} /> Team Introduction</label><br /><br />

      <button onClick={generatePreview}>Generate Preview</button>

      {preview && (
        <>
          <hr />
          <h2>Preview</h2>
          <pre>{preview}</pre>
          <a href={`${BACKEND}/api/documents/${docId}/pdf`}>
            <button>Download PDF</button>
          </a>
        </>
      )}
    </div>
  );
}

export default App;
