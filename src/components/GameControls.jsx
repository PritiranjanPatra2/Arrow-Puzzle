import React from 'react';
import { RotateCcw, Lightbulb, RefreshCw } from 'lucide-react';

export function GameControls({
  historyLength,
  hintsRemaining = 7,
  onUndo,
  onHint,
  onRestart,
  disabled
}) {
  return (
    <div className="game-controls">
      <button
        className="control-btn"
        onClick={onUndo}
        disabled={disabled || historyLength === 0}
        title="Undo previous move"
      >
        <RotateCcw size={18} />
        <span>Undo</span>
        {historyLength > 0 && <span className="badge-pill">{historyLength}</span>}
      </button>

      <button
        className="control-btn highlight-gold"
        onClick={onHint}
        disabled={disabled || hintsRemaining <= 0}
        title={`Highlight next movable arrow (${hintsRemaining} hints remaining)`}
      >
        <Lightbulb size={18} />
        <span>Hint</span>
        <span className="badge-pill gold-badge">{hintsRemaining}</span>
      </button>

      <button
        className="control-btn"
        onClick={onRestart}
        disabled={disabled}
        title="Restart this level"
      >
        <RefreshCw size={18} />
        <span>Restart</span>
      </button>
    </div>
  );
}
