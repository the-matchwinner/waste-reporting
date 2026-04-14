export default function MarkerPopup({ marker, role, setMarkers }) {
    return (
      <div>
        <p>Status: {marker.status}</p>
  
        {/* ONLY VOLUNTEER CAN CLAIM */}
        {role === "volunteer" && marker.status === "pending" && (
          <button
            onClick={() => {
              setMarkers(prev =>
                prev.map(m =>
                  m.id === marker.id
                    ? { ...m, status: "claimed" }
                    : m
                )
              );
            }}
          >
            Claim
          </button>
        )}
  
        {/* ONLY VOLUNTEER CAN COMPLETE */}
        {role === "volunteer" && marker.status === "claimed" && (
          <button
            onClick={() => {
              setMarkers(prev =>
                prev.map(m =>
                  m.id === marker.id
                    ? { ...m, status: "completed" }
                    : m
                )
              );
            }}
          >
            Mark as Done
          </button>
        )}
      </div>
    );
  }