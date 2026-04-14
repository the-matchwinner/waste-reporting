export default function RoleSelector({ role, setRole }) {
    return (
      <div style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        zIndex: 1000
      }}>
        <button onClick={() => setRole("public")}>
          Public
        </button>
  
        <button onClick={() => setRole("volunteer")}>
          Volunteer
        </button>
      </div>
    );
  }