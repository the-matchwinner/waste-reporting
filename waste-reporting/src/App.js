import { useState, useEffect } from "react";
import MapView from "./components/MapView";
import Login from "./components/Login";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  return user ? (
    <MapView user={user} />
  ) : (
    <Login setUser={setUser} />
  );
}

export default App;