import React from "react";

export default function ProgressBar({ progress = 0 }) {
    const pct = Math.max(0, Math.min(100, Math.round(progress || 0)));
    return (
        <div
            className="progress-bar"
            role="progressbar"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={pct}
            aria-label={`Progresso ${pct}%`}
        >
            <div className="progress-fill" style={{ width: `${pct}%` }} />
            <div className="progress-text">{pct}%</div>
        </div>
    );
}