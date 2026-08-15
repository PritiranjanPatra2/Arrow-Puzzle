import React, { useState } from 'react';
import { ArrowLeft, Lock, Star, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { sounds } from '../audio/soundEffects.js';

export function LevelSelect({
  highestUnlockedLevel,
  completedLevels,
  stars,
  onSelectLevel,
  onBack
}) {
  // Page size: 25 levels per view (40 pages total for 1000 levels)
  const PAGE_SIZE = 25;
  const TOTAL_LEVELS = 1000;
  const TOTAL_PAGES = Math.ceil(TOTAL_LEVELS / PAGE_SIZE); // 40 pages

  // Default to page of the highest unlocked level
  const [currentPage, setCurrentPage] = useState(() => {
    return Math.min(TOTAL_PAGES, Math.max(1, Math.ceil(highestUnlockedLevel / PAGE_SIZE)));
  });

  const pageStart = (currentPage - 1) * PAGE_SIZE + 1;
  const pageEnd = Math.min(TOTAL_LEVELS, currentPage * PAGE_SIZE);

  const levelsInCurrentPage = [];
  for (let l = pageStart; l <= pageEnd; l++) {
    levelsInCurrentPage.push(l);
  }

  const completedSet = new Set(completedLevels);

  // Chapter definition (10 Chapters of 100 levels)
  const currentChapter = Math.ceil(currentPage / 4);
  const chapterName = [
    'Tutorial & Foundations',
    'Novice Dependencies',
    'Challenger Chains',
    'Tactical Networks',
    'Expert Crossroads',
    'Advanced Logic',
    'Master Traps',
    'Grandmaster Depth',
    'Extreme Complexity',
    'Ultimate 1000 Summit'
  ][currentChapter - 1] || 'Level Matrix';

  return (
    <div className="level-select-screen">
      {/* Header */}
      <header className="level-select-header">
        <button
          className="icon-btn"
          onClick={() => {
            sounds.playClick();
            onBack();
          }}
          aria-label="Back to Home"
        >
          <ArrowLeft size={22} />
        </button>
        <div className="level-select-titles">
          <h1 className="screen-title">LEVEL SELECT</h1>
          <span className="screen-subtitle">
            Chapter {currentChapter}/10: {chapterName}
          </span>
        </div>
        <button
          className="quick-continue-btn"
          onClick={() => {
            sounds.playClick();
            onSelectLevel(highestUnlockedLevel);
          }}
        >
          <Play size={14} fill="currentColor" />
          <span>Lvl {highestUnlockedLevel}</span>
        </button>
      </header>

      {/* Pagination Bar */}
      <div className="pagination-controls-bar">
        <button
          className="page-nav-btn"
          disabled={currentPage <= 1}
          onClick={() => {
            sounds.playClick();
            setCurrentPage(p => Math.max(1, p - 1));
          }}
          aria-label="Previous page"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="page-indicator-badge">
          <span className="page-range">
            Levels {pageStart} – {pageEnd}
          </span>
          <span className="page-sub">Page {currentPage} of {TOTAL_PAGES}</span>
        </div>

        <button
          className="page-nav-btn"
          disabled={currentPage >= TOTAL_PAGES}
          onClick={() => {
            sounds.playClick();
            setCurrentPage(p => Math.min(TOTAL_PAGES, p + 1));
          }}
          aria-label="Next page"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Quick Chapter Jump Select */}
      <div className="chapter-jump-row">
        <label htmlFor="chapter-select" className="jump-label">Jump to:</label>
        <select
          id="chapter-select"
          className="chapter-dropdown"
          value={Math.ceil(currentPage / 4)}
          onChange={(e) => {
            const chap = parseInt(e.target.value, 10);
            setCurrentPage((chap - 1) * 4 + 1);
            sounds.playClick();
          }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(c => (
            <option key={c} value={c}>
              Chapter {c} (Levels {(c - 1) * 100 + 1}–{c * 100})
            </option>
          ))}
        </select>
      </div>

      {/* 25-Level Responsive Grid */}
      <div className="level-grid-scroll-area">
        <div className="level-grid">
          {levelsInCurrentPage.map(lvl => {
            const isUnlocked = lvl <= highestUnlockedLevel;
            const isCurrent = lvl === highestUnlockedLevel;
            const isCompleted = completedSet.has(lvl);
            const levelStars = stars[lvl] || 0;

            return (
              <button
                key={lvl}
                disabled={!isUnlocked}
                className={`level-tile ${isUnlocked ? 'unlocked' : 'locked'} ${
                  isCurrent ? 'current-pulse' : ''
                } ${isCompleted ? 'completed' : ''}`}
                onClick={() => {
                  if (isUnlocked) {
                    sounds.playClick();
                    onSelectLevel(lvl);
                  }
                }}
              >
                {isUnlocked ? (
                  <>
                    <span className="level-num">{lvl}</span>
                    <div className="level-tile-stars">
                      {[1, 2, 3].map(s => (
                        <Star
                          key={s}
                          size={10}
                          className={s <= levelStars ? 'star-filled' : 'star-empty'}
                        />
                      ))}
                    </div>
                    {isCurrent && (
                      <span className="current-indicator" title="Current Level">
                        ▶
                      </span>
                    )}
                    {lvl === 1000 && (
                      <span className="crown-badge" title="Level 1000 Supreme Summit">
                        👑
                      </span>
                    )}
                  </>
                ) : (
                  <div className="locked-content">
                    <Lock size={14} className="lock-icon" />
                    <span className="locked-num">{lvl}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
