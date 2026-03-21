import { useState, useEffect } from "react";

export function FaultPanel() {
  const [faults, setFaults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [machineId, setMachineId] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("low");

  useEffect(() => {
    async function load() {
      const res = await fetch("http://localhost:5000/api/faults");
      const data = await res.json();
      setFaults(data);
      setLoading(false);
    }
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  async function submitFault() {
    if (!machineId || !description) return; // basic validation
    await fetch("http://localhost:5000/api/faults", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ machineId, description, severity }),
    });
    setMachineId("");
    setDescription("");
    setSeverity("low");
  }

  return (
    <div className="card">
      <h2>Fault Reports</h2>

      <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
        {/* Left — submit form */}
        <div style={{ minWidth: "260px" }}>
          <p className="section-label">Submit New Fault</p>
          <input
            placeholder="Machine ID"
            value={machineId}
            onChange={(e) => setMachineId(e.target.value)}
          />
          <input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button onClick={submitFault}>Submit</button>
        </div>

        {/* Right — fault list */}
        <div style={{ flex: 1 }}>
          <p className="section-label">Recent Faults</p>
          {loading ? (
            <p style={{ color: "#64748b" }}>Loading...</p>
          ) : faults.length === 0 ? (
            <p style={{ color: "#64748b", fontSize: "12px" }}>
              No faults reported
            </p>
          ) : (
            faults.map((f) => (
              <div key={f.id} className="fault-card">
                <div>
                  <p style={{ fontWeight: 500, marginBottom: "4px" }}>
                    Machine {f.machine_id} — {f.description}
                  </p>
                  <p style={{ color: "#64748b", fontSize: "12px" }}>
                    {f.created_at}
                  </p>
                </div>
                <span className={`severity ${f.severity}`}>{f.severity}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
