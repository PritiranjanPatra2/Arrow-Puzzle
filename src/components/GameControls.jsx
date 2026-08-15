import React from 'react';
import { RotateCcw, Lightbulb, RefreshCw } from 'lucide-react';

export function GameControls({
  historyLength,
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
        <RotateCcw size={20} />
        <span>Undo</span>
        {historyLength > 0 && <span className="badge-pill">{historyLength}</span>}
      </button>

      <button
        className="control-btn highlight-gold"
        onClick={onHint}
        disabled={disabled}
        title="Highlight next movable arrow"
      >
        <Lightbulb size={20} />
        <span>Hint</span>
      </button>

      <button
        className="control-btn"
        onClick={onRestart}
        disabled={disabled}
        title="Restart this level"
      >
        <RefreshCw size={20} />
        <span>Restart</span>
      </button>
    </div>
  );
}
