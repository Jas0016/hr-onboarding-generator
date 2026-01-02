import { useState, useEffect } from "react";

const API = "https://hr-onboarding-generator-2.onrender.com/api/documents";

function App() {
  const [employeeName, setEmployeeName] = useState("");
  const [role, setRole] = useState("");
  const [elements, setElements] = useState({
    policies: true,
    benefits: true,
    team: true
  });
  const [preview, setPreview] = useState("");
  const [docId, setDocId] = useState(null);
  const [history, setHistory] = useState([]);

  const selectedElements = Object.keys(elements).filter(k => elements[k]);

  const generatePreview = async () => {
    const res = await fetch(`${API}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employeeName,
        role,
        selectedElements
      })
    });

    const data = await res.json();
    setPreview(data.content);
    setDocId(data.documentId);
  };

  const loadHistory = async () => {
    const res = await fetch(`${API}/history`);
    const data = await res.json();
    setHistory(data);
  };

  useEffect(() => {
    loadHistory();
  }, []);

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

      <h3>Select Onboarding Elements</h3>
      {Object.keys(elements).map(k => (
        <label key={k}>
          <input
            type="checkbox"
            checked={elements[k]}
            onChange={() =>
              setElements({ ...elements, [k]: !elements[k] })
            }
          />{" "}
          {k}
          <br />
        </label>
      ))}

      <br />
      <button onClick={generatePreview}>Generate Preview</button>

      {preview && (
        <>
          <hr />
          <h3>Preview</h3>
          <pre>{preview}</pre>
          <button
            onClick={() =>
              window.open(`${API}/download/${docId}`, "_blank")
            }
          >
            Download PDF
          </button>
        </>
      )}

      <hr />
      <h3>Document History</h3>
      {history.map(h => (
        <div key={h._id} style={{ marginBottom: 20 }}>
          <strong>{h.employeeName}</strong> — {h.role}
          <br />
          {new Date(h.createdAt).toLocaleString()}
          <br />
          <button
            onClick={() =>
              window.open(`${API}/download/${h._id}`, "_blank")
            }
          >
            Download PDF
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;
