import React, { useState } from "react";
import axios from "axios";

const API = "https://hr-onboarding-generator-2.onrender.com";

function App() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [doc, setDoc] = useState(null);

  const generate = async () => {
    const res = await axios.post(`${API}/api/documents/generate`, {
      employeeName: name,
      role,
      sections: [
        "Company policies",
        "Employee benefits",
        "Team introduction"
      ]
    });
    setDoc(res.data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>HR Onboarding Document Generator</h2>

      <input
        placeholder="Employee Name"
        onChange={(e) => setName(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Role"
        onChange={(e) => setRole(e.target.value)}
      />
      <br /><br />

      <button onClick={generate}>Generate</button>

      {doc && (
        <>
          <h3>Preview</h3>
          <p>{doc.content}</p>
          <a
            href={`${API}/api/documents/download/${doc._id}`}
            target="_blank"
            rel="noreferrer"
          >
            Download PDF
          </a>
        </>
      )}
    </div>
  );
}

export default App;
