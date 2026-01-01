import React, { useState } from "react";
import axios from "axios";

const API = "https://hr-onboarding-generator-2.onrender.com";

function App() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [sections, setSections] = useState([]);
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleSection = (section) => {
    setSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const generate = async () => {
    setLoading(true);
    const res = await axios.post(`${API}/api/documents/generate`, {
      employeeName: name,
      role,
      sections,
    });
    setDoc(res.data);
    setLoading(false);
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
        <input type="checkbox" onChange={() => toggleSection("Company Policies")} />
        Company Polici
