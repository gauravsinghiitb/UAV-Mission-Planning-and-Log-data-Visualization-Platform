import React from "react";

export default function Dashboard({ state }) {
  const fields = [
    { label: "Flight Time", value: state.time_s, unit: "s", precision: 2 },
    { label: "Latitude", value: state.latitude, precision: 7 },
    { label: "Longitude", value: state.longitude, precision: 7 },
    { label: "Altitude", value: state.altitude, unit: "m", precision: 2 },
    { label: "Speed", value: state.speed, unit: "m/s", precision: 4 },
    { label: "Vertical Speed", value: state.vz !== undefined ? Math.abs(state.vz) : undefined, unit: "m/s", precision: 2  },
    { label: "Roll", value: state.roll, unit: "°", precision: 2 },
    { label: "Pitch", value: state.pitch, unit: "°", precision: 2 },
    { label: "Battery Voltage", value: state.voltage, unit: "V", precision: 5 },
    { label: "RSSI", value: state.rssi, precision: 2 }
  ];

  return (
    <div className="dashboard">
      <h2>📊 Flight Data</h2>
      <table>
        <tbody>
          {fields.map((f, idx) => {
            if (idx % 2 === 0) {
              return (
                <tr key={idx}>
                  <td><b>{f.label}:</b></td>
                  <td>
                    {f.value !== null && f.value !== undefined
                      ? (typeof f.value === "number" 
                          ? f.value.toFixed(f.precision) 
                          : f.value) + (f.unit ? ` ${f.unit}` : "")
                      : "N/A"}
                  </td>
                  {fields[idx + 1] && (
                    <>
                      <td><b>{fields[idx + 1].label}:</b></td>
                      <td>
                        {fields[idx + 1].value !== null && fields[idx + 1].value !== undefined
                          ? (typeof fields[idx + 1].value === "number" 
                              ? fields[idx + 1].value.toFixed(fields[idx + 1].precision) 
                              : fields[idx + 1].value) + (fields[idx + 1].unit ? ` ${fields[idx + 1].unit}` : "")
                          : "N/A"}
                      </td>
                    </>
                  )}
                </tr>
              );
            }
            return null;
          })}
        </tbody>
      </table>
    </div>
  );
}
