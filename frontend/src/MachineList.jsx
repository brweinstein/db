import { useState, useEffect } from "react";

export function MachineList({ onSelect, selectedMachine }) {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("http://localhost:5000/api/machines");
      const data = await res.json();
      setMachines(data);
      setLoading(false);
    }
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p style={{ color: "#64748b" }}>Loading...</p>;

  const offline = machines.filter((m) => m.status === "offline");

  return (
    <>
      <div>
        <p className="section-label">All Machines</p>
        <ul>
          {machines.map((machine) => (
            <li
              key={machine.id}
              className={`machine-item ${selectedMachine?.id === machine.id ? "selected" : ""}`}
              onClick={() => onSelect(machine)}
            >
              <span className={`dot ${machine.status}`}></span>
              {machine.name}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="section-label">Offline</p>
        {offline.length === 0 ? (
          <p style={{ color: "#64748b", fontSize: "12px" }}>
            All machines running
          </p>
        ) : (
          <ul>
            {offline.map((machine) => (
              <li
                key={machine.id}
                className="machine-item"
                onClick={() => onSelect(machine)}
              >
                <span className="dot offline"></span>
                {machine.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
