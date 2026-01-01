import React, { useState } from "react";
import axios from "axios";

const API = "https://hr-onboarding-generator-2.onrender.com";

function App() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [sections, setSections] = useState([]);
  const [doc, setDoc] = useState(null);

  const toggle = (s) => {
    setSections((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const generate = async () => {
    const res = await axios.post(`${API}/api/documents/generate`, {
      employeeName: name,
      role,
      sections,
    });
    setDoc(res.data);
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>HR Onboarding Document Generator</h2>

      <input placeholder="Employee Name" onChange={e => setName(e.target.value)} />
      <br /><br />

      <input placeholder="Role" onChange={e => setRole(e.target.value)} />
      <br /><br />

      <h4>Select Onboarding Elements</h4>
      <label>
        <input type="checkbox" onChange={() => toggle("Company Policies")} />
        Company Policies
      </label><br />
      <label>
        <input type="checkbox" onChange={() => toggle("Employee Benefits")} />
        Employee Benefits
      </label><br />
      <label>
        <input type="checkbox" onChange={() => toggle("Team Introduction")} />
        Team Introduction
      </label><br /><br />

      <button onClick={generate}>Generate</button>

      {doc && (
        <>
          <h3>Preview</h3>
          <pre>{doc.content}</pre>
          <a href={`${API}/api/documents/download/${doc._id}`} target="_blank" rel="noreferrer">
            Download PDF
          </a>
        </>
      )}
    </div>
  );
}

export default App;
