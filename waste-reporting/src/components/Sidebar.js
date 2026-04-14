export default function Sidebar({ markers, heatmapOn, setHeatmapOn }) {
    const pending = markers.filter(m => m.status === "pending").length;
    const claimed = markers.filter(m => m.status === "claimed").length;
    const completed = markers.filter(m => m.status === "completed").length;
  
    return (
      <div style={{
        width: "260px",
        background: "#1e293b",
        color: "white",
        padding: "20px"
      }}>
        <h2>Dashboard</h2>
  
        <p>Pending: {pending}</p>
        <p>Claimed: {claimed}</p>
        <p>Completed: {completed}</p>
  
        <button onClick={() => setHeatmapOn(!heatmapOn)}>
          Toggle Heatmap
        </button>
      </div>
    );
  }