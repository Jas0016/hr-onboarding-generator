import { useState } from "react";

const API = "https://hr-onboarding-generator-2.onrender.com/api/documents";

function App() {
  const [employeeName, setEmployeeName] = useState("");
  const [role, setRole] = useState("");

  const [elements, setElements] = useState({
    company_policies: true,
    employee_benefits: true,
    team_introduction: true,
  });

  const [preview, setPreview] = useState("");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectedElements = Object.keys(elements).filter(
    (key) => elements[key]
  );

  // -------- PREVIEW --------
  const generatePreview = async () => {
    if (!employeeName || !role || selectedElements.length === 0) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    setPreview("");

    const res = await fetch(`${API}/preview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employeeName,
        role,
        elements: selectedElements,
      }),
    });

    const data = await res.json();
    setPreview(data.content);
    setLoading(false);
  };

  // -------- DOWNLOAD PDF --------
  const downloadPDF = async () => {
    const res = await fetch(`${API}/download`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employeeName,
        role,
        elements: selectedElements,
        content: preview,
      }),
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${employeeName}_Onboarding.pdf`;
    a.click();
  };

  // -------- HISTORY TOGGLE --------
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
    <div style={{ padding: "30px", fontFamily: "Arial, sans-serif" }}>
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

      <label>
        <input
          type="checkbox"
          checked={elements.company_policies}
          onChange={() =>
            setElements({
              ...elements,
              company_policies: !elements.company_policies,
            })
          }
        />
        Company Policies
      </label>
      <br />

      <label>
        <input
          type="checkbox"
          checked={elements.employee_benefits}
          onChange={() =>
            setElements({
              ...elements,
              employee_benefits: !elements.employee_benefits,
            })
          }
        />
        Employee Benefits
      </label>
      <br />

      <label>
        <input
          type="checkbox"
          checked={elements.team_introduction}
          onChange={() =>
            setElements({
              ...elements,
              team_introduction: !elements.team_introduction,
            })
          }
        />
        Team Introduction
      </label>

      <br /><br />
      <button onClick={generatePreview}>Generate Preview</button>

      {loading && <p>Generating preview...</p>}

      {preview && (
        <>
          <hr />
          <h2>Preview</h2>
          <pre style={{ whiteSpace: "pre-wrap" }}>{preview}</pre>
          <button onClick={downloadPDF}>Download PDF</button>
        </>
      )}

      <hr />
      <button onClick={toggleHistory}>History</button>

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
