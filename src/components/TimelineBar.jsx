import React from "react";

export default function TimelineBar({ currentIndex, total, setIdx }) {
  const percentage = (currentIndex / total) * 100;

  const handleClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const clickedPercentage = clickX / width;
    const newIdx = Math.floor(clickedPercentage * total);
    setIdx(newIdx);
  };

  return (
    <div className="timeline-container" onClick={handleClick}>
      <div className="timeline-progress" style={{ width: `${percentage}%` }} />
    </div>
  );
}
