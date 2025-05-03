import React, { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export default function Map3D({ history }) {
  const points = useMemo(() => {
    if (!history.length) return [];
    const base = history[0];
    return history
      .filter((p) => p.latitude != null && p.longitude != null && p.altitude != null)
      .map((p) => [
        (p.longitude - base.longitude) * 10000, // X axis
        p.altitude, // Y axis (altitude)
        (p.latitude - base.latitude) * 10000, // Z axis
      ]);
  }, [history]);

  return (
    <div className="map3d-container">
      <Canvas camera={{ position: [0, 300, 400], fov: 60 }}>
        <ambientLight intensity={0.8} />
        <pointLight position={[100, 200, 100]} />
        <OrbitControls enablePan enableZoom enableRotate />
        {points.length > 1 && (
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={points.length}
                array={new Float32Array(points.flat())}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="red" />
          </line>
        )}
        {points.length > 0 && (
          <mesh position={points[points.length - 1]}>
            <sphereGeometry args={[5, 32, 32]} />
            <meshStandardMaterial color="blue" />
          </mesh>
        )}
      </Canvas>
    </div>
  );
}