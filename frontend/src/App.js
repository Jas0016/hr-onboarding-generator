import React, { useState } from "react";

const API_URL = "https://hr-onboarding-generator-2.onrender.com";

function App() {
  const [employeeName, setEmployeeName] = useState("");
  const [role, setRole] = useState("");
  const [elements, setElements] = useState({
    policies: true,
    benefits: true,
    team: true,
  });

  const [preview, setPreview] = useState("");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(false);

  const generatePreview = async () => {
    setLoading(true);
    setPreview("");

    const res = await fetch(`${API_URL}/api/documents/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employeeName,
        role,
        elements: Object.keys(elements).filter((k) => elements[k]),
        previewOnly: true,
      }),
    });

    const data = await res.json();
    setPreview(data.content || "");
    setLoading(false);
  };

  const downloadPDF = async () => {
    const res = await fetch(`${API_URL}/api/documents/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employeeName,
        role,
        elements: Object.keys(elements).filter((k) => elements[k]),
      }),
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${employeeName}_Onboarding.pdf`;
    a.click();
  };

  const loadHistory = async () => {
    const res = await fetch(`${API_URL}/api/documents/history`);
    const data = await res.json();
    setHistory(data);
    setShowHistory(true);
  };

  return (
    <div style={{ padding: "40px", fontFamily: "serif" }}>
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

      <h3>Select Onboarding Elements</h3>
      {Object.keys(elements).map((key) => (
        <label key={key} style={{ display: "block" }}>
          <input
            type="checkbox"
            checked={elements[key]}
            onChange={() =>
              setElements({ ...elements, [key]: !elements[key] })
            }
          />
          {key === "policies" && " Company Policies"}
          {key === "benefits" && " Employee Benefits"}
          {key === "team" && " Team Introduction"}
        </label>
      ))}

      <br />
      <button onClick={generatePreview}>Generate Preview</button>

      {loading && <p>Generating preview…</p>}

      {preview && (
        <>
          <hr />
          <h2>Preview</h2>
          <pre style={{ whiteSpace: "pre-wrap" }}>{preview}</pre>
          <button onClick={downloadPDF}>Download PDF</button>
        </>
      )}

      <hr />
      <button onClick={loadHistory}>
        View Generated Documents by Employee
      </button>

      {showHistory && (
        <>
          <h2>Generated Documents by Employee</h2>
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
