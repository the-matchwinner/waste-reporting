export default function Login({ setUser }) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0f172a",
        color: "white",
        flexDirection: "column",
        gap: "20px"
      }}>
        <h1>Waste Management System</h1>
  
        <button onClick={() => {
          const user = { role: "public" };
          localStorage.setItem("user", JSON.stringify(user));
          setUser(user);
        }}>
          Continue as Public
        </button>
  
        <button onClick={() => {
          const user = { role: "volunteer" };
          localStorage.setItem("user", JSON.stringify(user));
          setUser(user);
        }}>
          Login as Volunteer
        </button>
      </div>
    );
  }