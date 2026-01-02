import { useState } from "react";

const API = "https://hr-onboarding-generator-2.onrender.com/api/documents";

function App() {
  const [employeeName, setEmployeeName] = useState("");
  const [role, setRole] = useState("");
  const [elements, setElements] = useState([
    "company_policies",
    "employee_benefits",
    "team_introduction",
  ]);

  const [preview, setPreview] = useState("");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const generatePreview = async () => {
    const res = await fetch(`${API}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employeeName,
        role,
        elements,
        previewOnly: true,
      }),
    });

    const data = await res.json();
    setPreview(data.content);
  };

  const downloadPDF = async () => {
    const res = await fetch(`${API}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employeeName,
        role,
        elements,
        previewOnly: false,
      }),
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${employeeName}_Onboarding.pdf`;
    a.click();
  };

  const toggleHistory = async () => {
    if (showHistory) {
      setShowHistory(false);
      return;
    }

    const res = await fetch(`${API}/history`);
    const data = await res.json();
    setHistory(data);
    setShowHistory(true);
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>HR Onboarding Document Generator</h1>

      <input
        placeholder="Employee Name"
        value={employeeName}
        onChange={(e) => setEmployeeName(e.target.value)}
      />
      <br />
      <br />

      <input
        placeholder="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />

      <h3>Select Onboarding Elements</h3>
      <label>
        <input type="checkbox" checked readOnly /> Company Policies
      </label>
      <br />
      <label>
        <input type="checkbox" checked readOnly /> Employee Benefits
      </label>
      <br />
      <label>
        <input type="checkbox" checked readOnly /> Team Introduction
      </label>

      <br />
      <br />
      <button onClick={generatePreview}>Generate Preview</button>

      {preview && (
        <>
          <hr />
          <h2>Preview</h2>
          <pre style={{ whiteSpace: "pre-wrap" }}>{preview}</pre>
          <button onClick={downloadPDF}>Download PDF</button>
        </>
      )}

      <hr />
      <button onClick={toggleHistory}>
        View History (by Employee)
      </button>

      {showHistory && (
        <>
          <h2>Generated Documents History</h2>
          <ul>
            {history.map((h) => (
              <li key={h._id}>
                <strong>{h.employeeName}</strong> — {h.role}
                <br />
                <small>{new Date(h.createdAt).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
