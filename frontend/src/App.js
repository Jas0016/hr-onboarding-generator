import React, { useState } from "react";
import axios from "axios";

const API = "https://hr-onboarding-generator-2.onrender.com";

function App() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    try {
      setLoading(true);

      const res = await axios.post(`${API}/api/documents/generate`, {
        employeeName: name,
        role,
        sections: [
          "Company policies and professional conduct",
          "Employee benefits and leave policy",
          "Team introduction and reporting structure",
        ],
      });

      setDoc(res.data);
    } catch (error) {
      alert(
        error.response?.data?.error ||
          error.message ||
          "Something went wrong"
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 30, fontFamily: "Arial" }}>
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

      <button onClick={generate}>
        {loading ? "Generating..." : "Generate Document"}
      </button>

      {doc && (
        <>
          <h3>Preview</h3>
          <p style={{ whiteSpace: "pre-line" }}>{doc.content}</p>
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
