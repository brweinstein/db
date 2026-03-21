import { useState } from "react";
import { MachineList } from "./MachineList";
import { FaultPanel } from "./FaultPanel";
import { UptimeChart } from "./UptimeChart";

function App() {
  const [selectedMachine, setSelectedMachine] = useState(null);

  return (
    <div className="dashboard">
      <nav className="navbar">
        <h1>Machine Dashboard</h1>
      </nav>

      <div className="main">
        <aside className="sidebar">
          <MachineList
            onSelect={setSelectedMachine}
            selectedMachine={selectedMachine}
          />
        </aside>

        <div className="content">
          {selectedMachine ? (
            <div className="card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <h2>{selectedMachine.name}</h2>
                <span className={`badge ${selectedMachine.status}`}>
                  <span className={`dot ${selectedMachine.status}`}></span>
                  {selectedMachine.status}
                </span>
              </div>
              <p style={{ color: "#64748b", marginBottom: "20px" }}>
                {selectedMachine.location}
              </p>
              <UptimeChart machineId={selectedMachine.id} />
            </div>
          ) : (
            <div
              className="card"
              style={{ color: "#64748b", textAlign: "center", padding: "40px" }}
            >
              <p>Select a machine from the sidebar to view details</p>
            </div>
          )}

          <FaultPanel />
        </div>
      </div>
    </div>
  );
}

export default App;
